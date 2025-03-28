const { Command } = require('commander')
const program = new Command()
const { setConfig } = require('./config')
const upload = require('./events/uploadToFirestore')
const download = require('./events/downloadToLocal')
const designateAsAdmin = require('./admins/designateAsAdmin')
const listAdminUsers = require('./admins/listAdminUsers')
const revokeUserToken = require('./admins/revokeUserToken')
const runMigration = require('./platform/migrations/runMigration')
const writeVersion = require('./platform/writeVersion')

program.option('--prod', 'Run in production mode', false)

program.addCommand(upload)
program.addCommand(download)
program.addCommand(designateAsAdmin)
program.addCommand(listAdminUsers)
program.addCommand(revokeUserToken)
program.addCommand(runMigration)
program.addCommand(writeVersion)

program.hook('preAction', command => {
    console.log(`Running in ${command.opts().prod ? 'PROD' : 'LOCAL'} env`)
    setConfig('prod', command.opts().prod)
})

program.parse(process.argv)
