import { NullToUndefined } from './typing'

/**
 * Recursively converts all null values to undefined in an object or array
 * @param value - The value to process
 * @returns The processed value with nulls converted to undefined
 */
export const nullToUndefined = <T>(value: T): NullToUndefined<T> => {
    if (value === null) {
        return undefined as unknown as NullToUndefined<T>
    }

    if (Array.isArray(value)) {
        return value.map(item => nullToUndefined(item)) as unknown as NullToUndefined<T>
    }

    if (value !== null && typeof value === 'object') {
        const newObj: Record<string, unknown> = {}
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                newObj[key] = nullToUndefined((value as Record<string, unknown>)[key])
            }
        }
        return newObj as NullToUndefined<T>
    }

    return value as NullToUndefined<T>
}
