const fs = require('fs')
const { Command } = require('commander')
const { getFirestoreInstance } = require('../platform/firebase')
const { getConfig } = require('../config')
const { Timestamp } = require('firebase-admin/firestore')

const command = new Command('upload')

command
    .argument('<organizationId>', 'Organization id to use when uploading recipes and suppliers')
    .action(organizationId => uploadToFirestore(organizationId))

const uploadToFirestore = async organizationId => {
    console.log(`Will upload data to organization ${organizationId}`)

    const ORGANIZATION_FILE_NAME = getConfig().ORGANIZATION_FILE_NAME

    // Read the organization data from the local file
    const { recipes, suppliers, id, ...organizationData } = JSON.parse(
        fs.readFileSync(`./${ORGANIZATION_FILE_NAME}`, 'utf8'),
    )
    const firestore = getFirestoreInstance()

    // Check if organization document exists and update it if needed
    const organizationRef = firestore.collection('organizations').doc(organizationId)
    const organizationExists = (await organizationRef.get()).exists

    if (organizationExists) {
        console.log(`Organization document already exists, will only update its fields`)
        if (Object.keys(organizationData).length) {
            await organizationRef.update(organizationData)
        }
    } else {
        console.log(`Organization document does not exist, creating it...`)
        await organizationRef.set(organizationData)
    }

    // Process and upload recipes
    if (recipes?.length) {
        console.log(`Uploading ${recipes.length} recipes to organization ${organizationId}...`)

        const recipeBatch = firestore.batch()
        let batchCount = 0
        const MAX_BATCH_SIZE = 500 // Firestore batch size limit

        for (let i = 0; i < recipes.length; i++) {
            const { id: recipeId, ...recipeData } = recipes[i]

            // Convert Timestamp objects if they exist in the data
            const processedRecipeData = processTimestamps(recipeData)

            const recipeRef = firestore.collection(`organizations/${organizationId}/recipes`).doc(recipeId)
            recipeBatch.set(recipeRef, processedRecipeData, { merge: true })

            batchCount++

            // If batch is full or this is the last item, commit the batch
            if (batchCount === MAX_BATCH_SIZE || i === recipes.length - 1) {
                await recipeBatch.commit()
                console.log(`Committed batch of ${batchCount} recipes`)
                batchCount = 0
            }
        }
    }

    // Process and upload suppliers
    if (suppliers?.length) {
        console.log(`Uploading ${suppliers.length} suppliers...`)

        const supplierBatch = firestore.batch()
        let batchCount = 0
        const MAX_BATCH_SIZE = 500 // Firestore batch size limit

        for (let i = 0; i < suppliers.length; i++) {
            const { id: supplierId, ...supplierData } = suppliers[i]

            // Convert Timestamp objects if they exist in the data
            const processedSupplierData = processTimestamps(supplierData)

            const supplierRef = firestore.collection('suppliers').doc(supplierId)
            supplierBatch.set(supplierRef, processedSupplierData, { merge: true })

            batchCount++

            // If batch is full or this is the last item, commit the batch
            if (batchCount === MAX_BATCH_SIZE || i === suppliers.length - 1) {
                await supplierBatch.commit()
                console.log(`Committed batch of ${batchCount} suppliers`)
                batchCount = 0
            }
        }
    }

    console.log('Upload completed successfully!')
}

// Helper function to process Firestore Timestamp objects in the data
const processTimestamps = data => {
    const processed = { ...data }

    // Recursively process each field
    Object.entries(processed).forEach(([key, value]) => {
        // Check if the value has Timestamp format (_seconds and _nanoseconds)
        if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
            processed[key] = new Timestamp(value._seconds, value._nanoseconds)
        }
        // Recursively process nested objects
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
            processed[key] = processTimestamps(value)
        }
        // Process objects in arrays
        else if (Array.isArray(value)) {
            processed[key] = value.map(item =>
                typeof item === 'object' && item !== null ? processTimestamps(item) : item,
            )
        }
    })

    return processed
}

module.exports = command
