import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return Response.json({ message: "Invalid Secret" }, { status: 401 });
    }

    revalidatePath("/");

    return Response.json({ revalidated: true, timestamp: Date.now() });
}
