import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Organization, OrganizationDBModel } from './OrganizationEntity'

/**
 * Converter for Organization entity to and from Firestore
 */
export const organizationConverter: FirestoreDataConverter<Organization, OrganizationDBModel> = {
    toFirestore: (organization: Organization) => ({
        name: organization.name,
        trieveGroupIds: organization.trieveGroupIds,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<Organization, OrganizationDBModel>) => {
        const data = snapshot.data()
        return {
            ...data,
            id: snapshot.id,
        }
    },
}
