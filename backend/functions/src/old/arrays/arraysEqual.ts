export function arraysEqual(arr1: unknown[], arr2: unknown[]) {
    return arr1.length === arr2.length &&
            new Set(arr1).size === new Set(arr2).size &&
            arr1.every((element) => arr2.includes(element))
}
