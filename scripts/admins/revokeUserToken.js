const { Command } = require('commander')
const { getAuthInstance } = require('../platform/firebase')

const command = new Command('revoke-user-token')

command
    .argument('<userEmail>', 'The email of the user to revoke the token for')
    .action(userEmail => uploadToFirestore(userEmail))

const uploadToFirestore = async userEmail => {
    console.log(`Will revoke token for user with email ${userEmail}`)
    try {
        const auth = getAuthInstance()

        const user = await auth.getUserByEmail(userEmail)

        await auth.revokeRefreshTokens(user.uid)
        console.log(`Token revoked for user: ${userEmail}`)

        const updatedUser = await auth.getUser(user.uid)
        console.log(`Token revoked at: ${updatedUser.tokensValidAfterTime}`)
    } catch (error) {
        console.error('Error revoking token:', error)
    }
}

module.exports = command
