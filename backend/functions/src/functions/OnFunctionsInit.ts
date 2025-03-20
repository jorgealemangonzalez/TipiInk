import { onInit } from 'firebase-functions'

const initialisationFunctions: Array<() => void> = []

export const onFunctionsInit = (callback: () => void) => {
    initialisationFunctions.push(callback)
}


onInit(() => {
    initialisationFunctions.forEach(callback => callback())
})
