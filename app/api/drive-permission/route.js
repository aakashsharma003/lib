import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { fileId, allowAccess } = body;

        if (!fileId) {
            return NextResponse.json({ error: "No file ID provided" }, { status: 400 });
        }

        const client = await clerkClient();
        let tokens = [];
        try {
            tokens = await client.users.getUserOauthAccessToken(userId, "oauth_google");
        } catch (err) {
            return NextResponse.json({ error: "Google OAuth not found", needsConsent: true }, { status: 403 });
        }

        const token = Array.isArray(tokens) ? tokens[0]?.token : tokens.data?.[0]?.token;

        if (!token) {
            return NextResponse.json({ error: "No Google token found. Drive consent required.", needsConsent: true }, { status: 403 });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const drive = google.drive({ version: "v3", auth: oauth2Client });

        try {
            if (allowAccess) {
                // Make it accessible to anyone with the link
                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    }
                });
            } else {
                // To revoke "anyone" access, we typically need to list permissions and delete the one matching "anyone".
                // Since the feature requirement just mentions toggling it ON, we'll implement a basic revoke if they toggle OFF.
                const perms = await drive.permissions.list({ fileId: fileId });
                const anyonePerm = perms.data.permissions.find(p => p.type === 'anyone');
                if (anyonePerm) {
                    await drive.permissions.delete({ fileId: fileId, permissionId: anyonePerm.id });
                }
            }
        } catch (permError) {
            console.error("Drive permission update error:", permError);
            if (permError.code === 403 || permError.message?.includes("insufficientPermissions")) {
                return NextResponse.json({ error: "Missing Drive permissions", needsConsent: true }, { status: 403 });
            }
            return NextResponse.json({ error: "Failed to update permissions" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in drive permission update:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
