import React, {useState} from 'react'
import {httpsCallable} from 'firebase/functions'
import {signInWithCustomToken} from 'firebase/auth'
import {useUser} from "@/auth/auth.tsx"
import {auth, functions} from "@/firebase/firebase.ts"
import {useNavigate} from "react-router-dom";

export const ImpersonatePage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const user = useUser()
    const navigate = useNavigate()

    const handleImpersonate = async () => {
        try {
            setError('')
            setLoading(true)
            const createImpersonationToken = httpsCallable(functions, 'createImpersonationToken')
            const result = await createImpersonationToken({email})
            const {token} = result.data as { token: string }

            await signInWithCustomToken(auth, token)

            console.log('Successfully impersonated user:', email)
            // Navigate to create
            navigate('/')

        } catch (error: any) {
            console.error(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if(!user?.isAdmin) {
        return <div>You do not have permission to impersonate users</div>
    }

    return (
        <div>
            <h1>Impersonate User</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
            />
            <button onClick={handleImpersonate} className="btn">Impersonate</button>
            {error && <div className="text-red-500">{error}</div>}
            {loading && <span className="loading loading-lg"></span>}
        </div>
    )
}
