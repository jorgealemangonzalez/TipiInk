export const getDocumentData = <T>(doc: FirebaseFirestore.DocumentSnapshot): T => {
    return {...doc.data(), id: doc.id} as T
}
