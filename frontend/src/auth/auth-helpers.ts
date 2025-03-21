import { createContext, useContext } from 'react'

import { User as FUser } from 'firebase/auth'

import { User as UserDbModel } from '@monorepo/functions/src/types/User'

export type User = FUser & { isAdmin: boolean } & UserDbModel

export interface AuthContextType {
    user?: User
    isLoggedIn: boolean
    isLoadingUser: boolean
    anonymousSignIn: () => Promise<User>
    googleSignIn: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider')
    }
    return context
}

export const useUser = () => {
    const context = useAuth()
    if (context.user === undefined) {
        throw new Error('useUser must be used when authenticated')
    }
    return context.user
}
