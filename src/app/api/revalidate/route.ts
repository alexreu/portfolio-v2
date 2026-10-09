import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return Response.json({ message: "Invalid Secret" }, { status: 401 });
    }

    // Every route built from Sanity content, so crawlers never read a stale copy.
    for (const path of ["/", "/mariage", "/sitemap.xml", "/llms.txt"]) {
        revalidatePath(path);
    }

    return Response.json({ revalidated: true, timestamp: Date.now() });
}
