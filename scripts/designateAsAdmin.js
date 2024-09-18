const admin = require('firebase-admin');

// Replace with the path to your service account key file
const serviceAccount = require('./admin-sdk-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function setAdmin(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        const uid = user.uid;

        await admin.auth().setCustomUserClaims(uid, { admin: true });
        console.log(`User with email ${email} (UID: ${uid}) set as admin successfully.`);
    } catch (error) {
        console.error(`Error setting user as admin: ${error}`);
    }
}

// Get the email from the command line arguments
const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument.');
    process.exit(1);
}

setAdmin(email);
