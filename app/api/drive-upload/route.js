import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { Readable } from "stream";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized User. Clerk auth failed." }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");
        const allowAccess = formData.get("allowAccess") === "true";

        if (!file || file === "null") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const client = await clerkClient();
        let tokens = [];
        try {
            tokens = await client.users.getUserOauthAccessToken(userId, "oauth_google");
        } catch (err) {
            return NextResponse.json({ error: `Clerk OAuth Error: ${err.message || 'Google OAuth not found'}`, needsConsent: true }, { status: 401 });
        }

        // `tokens` might be an array or an object depending on Clerk SDK version
        const token = Array.isArray(tokens) ? tokens[0]?.token : tokens.data?.[0]?.token;

        if (!token) {
            return NextResponse.json({ error: "No Google Access token found in profile. Please grant Drive consent.", needsConsent: true }, { status: 401 });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const drive = google.drive({ version: "v3", auth: oauth2Client });

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        let driveLink = "";
        let fileId = "";

        try {
            const driveRes = await drive.files.create({
                requestBody: {
                    name: file.name,
                    mimeType: file.type,
                },
                media: {
                    mimeType: file.type,
                    body: stream,
                },
                fields: "id, webViewLink",
            });

            fileId = driveRes.data.id;

            // Always make it accessible to anyone with the link to ensure preview works without Access Denied errors
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: "reader",
                    type: "anyone",
                }
            });

            // Convert webViewLink to preview link for iframe embedding
            driveLink = driveRes.data.webViewLink ? driveRes.data.webViewLink.replace(/\/view.*/, '/preview') : `https://drive.google.com/file/d/${fileId}/preview`;
        } catch (uploadError) {
            console.error("Drive upload error:", uploadError);
            const exactError = uploadError.message || JSON.stringify(uploadError);

            if (uploadError.code === 401 || exactError.includes("Invalid Credentials")) {
                return NextResponse.json({ error: `Google Auth Expired: ${exactError}`, needsConsent: true }, { status: 401 });
            }
            if (uploadError.code === 403 || exactError.includes("insufficientPermissions")) {
                return NextResponse.json({ error: `Missing Drive permissions: ${exactError}`, needsConsent: true }, { status: 403 });
            }
            return NextResponse.json({ error: `Drive API Error: ${exactError}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, driveLink, fileId });
    } catch (error) {
        console.error("Error in drive upload:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
