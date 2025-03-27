const { Command } = require('commander')

const command = new Command('migrate')

const availableMigrations = {
    'test-migration': require('./20250325-test-migration'),
    'add-production-cost': require('./20240803-add-production-cost'),
    'migrate-recipe-ingredients': require('./20240327-migrate-recipe-ingredients'),
}

const requiredArguments = {
    'test-migration': 'organizationId',
    'add-production-cost': 'organizationId',
    'migrate-recipe-ingredients': 'organizationId',
}

command
    .argument('<migrationName>', 'Name of the migration to run')
    .argument('[migrationArg]', 'Second argument that will be passed to the migration script', '')
    .action(async (migrationName, migrationArg) => {
        if (!migrationName) {
            console.log('Available migrations:')
            Object.keys(availableMigrations).forEach(migration => console.log(`- ${migration}`))
            return
        }

        try {
            const migration = availableMigrations[migrationName]
            if (!migration) {
                console.error(`Migration "${migrationName}" not found.`)
                process.exit(1)
            }

            const requiredArg = requiredArguments[migrationName]

            if (requiredArg && !migrationArg) {
                console.error(`Argument "${requiredArg}" is required for migration "${migrationName}".`)
                process.exit(1)
            }

            await migration(migrationArg)
            console.log(`Migration "${migrationName}" completed successfully.`)
        } catch (error) {
            console.error(`Error running migration "${migrationName}":`, error)
            process.exit(1)
        }
    })

module.exports = command
