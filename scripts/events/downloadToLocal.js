const { getFirestoreInstance } = require('../platform/firebase')
const { Command } = require('commander')
const fs = require('fs')
const { getConfig } = require('../config')

const ORGANIZATION_FILE_NAME = getConfig().ORGANIZATION_FILE_NAME

const command = new Command('download')

command
    .argument('<organizationId>', 'Organization id to download recipes and suppliers from')
    .action(organizationId => download(organizationId))

const download = async organizationId => {
    console.log(`Will download recipes and suppliers from organization ${organizationId}`)
    const firestore = getFirestoreInstance()

    // Get all recipes from the organization
    const recipesSnapshot = await firestore.collection(`organizations/${organizationId}/recipes`).get()
    const recipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(`Downloaded ${recipes.length} recipes from organization ${organizationId}`)

    // Get all suppliers
    const suppliersSnapshot = await firestore.collection('suppliers').get()
    const suppliers = suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(`Downloaded ${suppliers.length} suppliers`)

    // Get the organization data itself (if it exists)
    const organizationDoc = await firestore.collection('organizations').doc(organizationId).get()
    const organizationData = organizationDoc.exists ? organizationDoc.data() : {}

    const path = require('path')

    const dir = path.dirname(ORGANIZATION_FILE_NAME)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    console.log(`Writing data to file ${ORGANIZATION_FILE_NAME}...`)
    fs.writeFileSync(
        `./${ORGANIZATION_FILE_NAME}`,
        JSON.stringify(
            {
                id: organizationId,
                ...organizationData,
                recipes,
                suppliers,
            },
            null,
            4,
        ),
        'utf8',
    )

    console.log(`Successfully saved organization data to ${ORGANIZATION_FILE_NAME}`)
}

module.exports = command
