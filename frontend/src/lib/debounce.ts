export function debounce<T extends (...args: any[]) => any>(callback: T, wait = 1000) {
    let timeoutId: NodeJS.Timeout
    const callable = (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback(...args), wait)
    }
    return callable as unknown as T
}
