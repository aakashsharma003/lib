import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                hasFinishedTour: true,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error setting tour metadata:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
