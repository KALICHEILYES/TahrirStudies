// ملف: api/auth.js
import { Octokit } from "@octokit/rest";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

// 🔑 يجب أن تضع بيانات Firebase Admin (من Service Account)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // 1️⃣ تحقق من Firebase Token المرسل من العميل
        const { firebaseToken } = req.body;
        const decodedToken = await getAuth().verifyIdToken(firebaseToken);
        const userEmail = decodedToken.email;

        console.log("✅ مستخدم مسجل:", userEmail);

        // 2️⃣ استعمل GitHub API لتوليد access token (من GitHub App أو PAT)
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN, // ضع هنا Personal Access Token أو GitHub App Token
        });

        // 3️⃣ رجّع الـ token إلى Netlify CMS
        return res.status(200).json({
            token: process.env.GITHUB_TOKEN,
            user: {
                email: userEmail,
            },
        });

    } catch (error) {
        console.error("❌ خطأ:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
