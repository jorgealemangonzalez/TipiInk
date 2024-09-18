const admin = require('firebase-admin');

// Replace with the path to your service account key file
const serviceAccount = require('./admin-sdk-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function listAdminUsers() {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const adminUsers = listUsersResult.users.filter(user => user.customClaims && user.customClaims.admin === true);

        if (adminUsers.length === 0) {
            console.log('No admin users found.');
        } else {
            console.log('Admin users:');
            adminUsers.forEach(user => {
                console.log(`- ${user.email} (UID: ${user.uid})`);
            });
        }
    } catch (error) {
        console.error('Error listing admin users:', error);
    }
}

listAdminUsers();
