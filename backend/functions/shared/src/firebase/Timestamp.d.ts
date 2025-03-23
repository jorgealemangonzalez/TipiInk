/**
 * This is a copy of the Timestamp type from firebase/firestore to avoid the dependency.
 * This type will be overwritten by the actual type on the frontend and backend modules.
 */
export interface Timestamp {
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    readonly seconds: number

    /** The non-negative fractions of a second at nanosecond resolution. */
    readonly nanoseconds: number

    /**
     * Returns a new `Date` corresponding to this timestamp. This may lose
     * precision.
     *
     * @return JavaScript `Date` object representing the same point in time as
     * this `Timestamp`, with millisecond precision.
     */
    toDate(): Date

    /**
     * Returns the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     *
     * @return The point in time corresponding to this timestamp, represented as
     * the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis(): number

    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other The `Timestamp` to compare against.
     * @return 'true' if this `Timestamp` is equal to the provided one.
     */
    isEqual(other: Timestamp): boolean

    /**
     * Converts this object to a primitive `string`, which allows `Timestamp` objects to be compared
     * using the `>`, `<=`, `>=` and `>` operators.
     *
     * @return a string encoding of this object.
     */
    valueOf(): string
}
