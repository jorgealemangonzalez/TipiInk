import {useEffect} from 'react'
import {auth, signOut} from '@/firebase/firebase.ts'


function LogOut() {
    useEffect(() => {
        signOut(auth)
    }, [])
    return <></>
}

export default LogOut
