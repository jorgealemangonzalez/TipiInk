import {LiveChat, TestChat} from '../../../../backend/functions/src/types/ChatBotConfig'
import {collection, getDocs, limit, orderBy, query, QuerySnapshot, where} from 'firebase/firestore'
import {firestore} from '@/firebase/firebase.ts'
import {getDocument} from '@/firebase/DocumentsDAO.ts'

const chatsCollection = collection(firestore, 'chats')

export async function getTestChat(chatId: string) {
    return await getDocument<TestChat>({collectionName: 'chats', id: chatId})
}

export async function getActiveTestChat(uid: string) {
    const chats = await getDocs(query(
        chatsCollection,
        where('uid', '==', uid),
        where('isTest', '==', true),
        orderBy('createdAt', 'desc'),
        limit(1),
    )) as QuerySnapshot<TestChat>

    if (chats.empty) return undefined
    else return {...chats.docs[0].data(), id: chats.docs[0].id} as TestChat
}

export async function getActiveLiveChat(uid: string, chatBotId: string) {
    const chats = await getDocs(query(
        chatsCollection,
        where('uid', '==', uid),
        where('isTest', '==', false),
        where('chatBotConfigId', '==', chatBotId!),
        orderBy('createdAt', 'desc'),
        limit(1),
    )) as QuerySnapshot<LiveChat>

    if (chats.empty) return undefined
    else return {...chats.docs[0].data(), id: chats.docs[0].id} as LiveChat
}
