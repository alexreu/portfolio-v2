import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const apply = process.argv.includes("--apply");
const useCliUserToken = process.argv.includes("--cli-user-token");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
if (!projectId || !dataset)
    throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_DATASET explicitly.");
if (apply && !process.env.SANITY_API_WRITE_TOKEN && !useCliUserToken)
    throw new Error("--apply requires SANITY_API_WRITE_TOKEN or --cli-user-token.");
const client = useCliUserToken
    ? getCliClient({ apiVersion: "2023-05-03" }).withConfig({
          projectId,
          dataset,
          useCdn: false,
          perspective: "raw",
      })
    : createClient({
          projectId,
          dataset,
          apiVersion: "2023-05-03",
          useCdn: false,
          token: process.env.SANITY_API_WRITE_TOKEN,
          perspective: "raw",
      });
const content = JSON.parse(
    await readFile(new URL("../content/pricing.json", import.meta.url), "utf8"),
);
const ids = [...content.offers.map(({ _id }) => _id), content.maintenance._id];
const documents = await client.fetch("*[_id in $ids || _id in $draftIds]", {
    ids,
    draftIds: ids.map((id) => `drafts.${id}`),
});
if (documents.some(({ _id }) => _id.startsWith("drafts.")))
    throw new Error("Resolve existing pricing/maintenance drafts before migrating.");
for (const offer of content.offers) {
    if (!documents.some(({ _id }) => _id === offer._id))
        throw new Error(
            `Missing source offer ${offer._id}. Review the content mapping before proceeding.`,
        );
}
const existingMaintenance = documents.find(({ _id }) => _id === content.maintenance._id);
if (existingMaintenance)
    throw new Error(
        "Maintenance already exists: migration already applied or content requires manual review.",
    );
console.log(
    JSON.stringify(
        {
            projectId,
            dataset,
            mode: apply ? "apply" : "dry-run",
            updates: content.offers.map(({ _id, name, price }) => ({ _id, name, price })),
            create: content.maintenance,
        },
        null,
        2,
    ),
);
if (!apply) process.exit(0);
await mkdir(".sanity-backups", { recursive: true });
const backup = `.sanity-backups/pricing-${Date.now()}.json`;
await writeFile(backup, JSON.stringify(documents, null, 2), { mode: 0o600 });
let transaction = client.transaction();
for (const { _id, _type, ...fields } of content.offers) {
    const previous = documents.find((document) => document._id === _id);
    transaction = transaction.patch(_id, (patch) =>
        patch
            .ifRevisionId(previous._rev)
            .set(fields)
            .unset(["minimumBudget", "monthlyFee", "commitment", "priceCustom", "featureIcons"]),
    );
}
transaction = transaction.create(content.maintenance);
await transaction.commit();
console.log(`Migration completed atomically. Backup: ${backup}`);
