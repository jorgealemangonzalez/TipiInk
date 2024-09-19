import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import {LoginPage} from '@/old/pages/login/LoginPage.tsx'
import {useEffect} from 'react'
import {ProtectedPage} from './ProtectedPage.tsx'
import mixpanel from 'mixpanel-browser'
import {MainComponent} from "@/pages/MainComponent.tsx"

export const RoutingComponent = () => {
    const location = useLocation()

    useEffect(() => {
        mixpanel.track_pageview({page: location.pathname.split('/')[1]})
    }, [location])

    return <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        {/** PRIVATE **/}
        <Route path="*" element={
            <ProtectedPage>
                <Routes>
                    <Route path="/" element={<MainComponent/>}/>
                </Routes>
            </ProtectedPage>
        }/>
    </Routes>
}
