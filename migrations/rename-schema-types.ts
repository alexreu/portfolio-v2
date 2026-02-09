/**
 * Migration script: Rename Sanity document types
 * - serviceV2 -> service
 * - pricingPlanV2 -> pricingPlan
 *
 * Sanity treats _type as immutable within a transaction,
 * so we run two passes: delete old docs, then recreate with new _type.
 *
 * Usage: npx sanity exec migrations/rename-schema-types.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2023-05-03" });

const RENAMES = [
    { from: "serviceV2", to: "service" },
    { from: "pricingPlanV2", to: "pricingPlan" },
] as const;

const migrate = async () => {
    for (const { from, to } of RENAMES) {
        const docs = await client.fetch(`*[_type == "${from}"]`);

        if (docs.length === 0) {
            console.log(`[SKIP] No documents found for type "${from}"`);
            continue;
        }

        console.log(`[MIGRATE] Found ${docs.length} document(s) of type "${from}" -> "${to}"`);

        // Prepare clean documents before deleting
        const cleaned = docs.map((doc: Record<string, unknown>) => {
            const { _rev, _createdAt, _updatedAt, _type, ...fields } = doc;
            return { ...fields, _type: to };
        });

        // Pass 1: Delete old documents
        const deleteTx = client.transaction();
        for (const doc of docs) {
            deleteTx.delete(doc._id as string);
        }
        await deleteTx.commit();
        console.log(`  [DELETE] Removed ${docs.length} "${from}" document(s)`);

        // Pass 2: Recreate with new _type
        const createTx = client.transaction();
        for (const doc of cleaned) {
            createTx.createOrReplace(doc);
        }
        const result = await createTx.commit();
        console.log(`  [CREATE] Recreated ${docs.length} "${to}" document(s) (txId: ${result.transactionId})`);
    }

    // Verify migration
    console.log("\n--- Verification ---");
    for (const { from, to } of RENAMES) {
        const oldCount = await client.fetch(`count(*[_type == "${from}"])`);
        const newCount = await client.fetch(`count(*[_type == "${to}"])`);
        console.log(`  ${to}: ${newCount} document(s) | ${from} (old): ${oldCount} remaining`);
    }

    console.log("\nMigration complete.");
};

migrate().catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});
