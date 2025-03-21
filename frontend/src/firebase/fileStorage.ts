import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { storage } from './firebase.ts'

export const uploadFileToStorage = async (
    filePath: string,
    file: File,
    onProgressUpdated?: (totalUploaded: number) => void,
): Promise<string> => {
    try {
        const storageRef = ref(storage, filePath)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on('state_changed', snapshot => {
            onProgressUpdated && onProgressUpdated(snapshot.bytesTransferred)
        })
        await uploadTask
        console.log('Uploaded file:', filePath)

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef)
        return downloadURL
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}
