import { Timestamp } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'

import { ChunkGroups, Organization, OrganizationDBModel, organizationConverter } from '@tipi/shared'

import { firestore } from '../FirebaseInit'

const currentOrganizationId = 'demo'

export const getOrganizationsRef = () => firestore.collection('organizations').withConverter(organizationConverter)

export const getCurrentOrganizationRef = () => getOrganizationsRef().doc(currentOrganizationId)

export const getOrCreateCurrentOrganization = async (): Promise<Organization> => {
    try {
        const orgRef = getCurrentOrganizationRef()
        const doc = await orgRef.get()

        if (!doc.exists) {
            const now = Timestamp.now()
            const organization: OrganizationDBModel = {
                trieveGroupIds: {},
                createdAt: now,
                updatedAt: now,
            }

            await orgRef.set(organization)
            const org = await orgRef.get()
            return org.data() as Organization
        }

        return doc.data() as Organization
    } catch (error) {
        logger.error(`Error getting organization ${currentOrganizationId}:`, error)
        throw error
    }
}

export const getTrieveGroupId = async (groupName: ChunkGroups): Promise<string | undefined> => {
    try {
        const organization = await getOrCreateCurrentOrganization()

        return organization.trieveGroupIds?.[groupName]
    } catch (error) {
        logger.error(`Error getting Trieve group ID for ${groupName}:`, error)
        throw error
    }
}

export const updateTrieveGroupId = async (groupName: ChunkGroups, groupId: string): Promise<void> => {
    try {
        await getOrCreateCurrentOrganization()

        await getCurrentOrganizationRef().update({
            [`trieveGroupIds.${groupName}`]: groupId,
            updatedAt: Timestamp.now(),
        })

        logger.info(`Updated Trieve group ID for ${groupName} in organization ${currentOrganizationId}`)
    } catch (error) {
        logger.error(`Error updating Trieve group ID for ${groupName}:`, error)
        throw error
    }
}
