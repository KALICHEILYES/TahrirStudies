import admin from "firebase-admin";

let app;
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

export default async function handler(req, res) {
  try {
    // نعمل UID تجريبي (لاحقًا رح يكون من تسجيل الدخول)
    const uid = "test-user";
    const token = await admin.auth().createCustomToken(uid);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Firebase error:", error);
    res.status(500).json({ error: error.message });
  }
}
