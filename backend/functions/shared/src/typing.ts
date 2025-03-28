/**
 * Get the type of the elements of an array
 */
export type ElementOf<T> = T extends (infer U)[] ? U : never

/**
 * This type makes all properties and sub-properties of an object optional
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPartial<U>[] // Make array optional, elements required but with DeepPartial applied
        : T[P] extends object
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            T[P] extends Function // Keep functions required
              ? T[P] // Don't make functions recursive
              : DeepPartial<T[P]> // Recursively apply DeepPartial to nested objects
          : T[P] // Keep primitive types required
}

export type EntityWithoutDbGeneratedFields<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type EntityUpdate<T> = DeepPartial<EntityWithoutDbGeneratedFields<T>>
