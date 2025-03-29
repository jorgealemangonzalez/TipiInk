import { Timestamp } from '../firebase/Timestamp'

/**
 * Type definition for Trieve chunk group names
 */
export type ChunkGroups = 'recipes' | 'suppliers' | 'ingredients'

/**
 * Database model for Organization
 */
export interface OrganizationDBModel {
    name?: string
    trieveGroupIds?: Partial<Record<ChunkGroups, string>>
    createdAt: Timestamp
    updatedAt: Timestamp
}

/**
 * Organization entity with ID
 */
export interface Organization extends OrganizationDBModel {
    id: string
}

/**
 * Interface for updating organization data
 */
export type OrganizationUpdate = Partial<OrganizationDBModel>

/**
 * Default organization data
 */
export const defaultOrganization: Omit<OrganizationDBModel, 'createdAt' | 'updatedAt'> = {
    name: '',
    trieveGroupIds: {},
}

/**
 * Map of group names to descriptions
 */
export const groupNameToDescription: Record<ChunkGroups, string> = {
    recipes: 'Group of recipes',
    suppliers: 'Group of suppliers',
    ingredients: 'Group of ingredients',
}
