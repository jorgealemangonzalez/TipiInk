import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import {PublishPage} from '../pages/publish/PublishPage.tsx'
import {FeedbackPage} from '../pages/FeedbackPage.tsx'
import {CreatePage} from '../pages/create/CreatePage.tsx'
import LogOut from '../pages/LogOut.tsx'
import {LoginPage} from '../pages/login/LoginPage.tsx'
import {UserChatPage} from '../pages/userchat/UserChatPage.tsx'
import {WithAnonymousUser} from '../auth/WithAnonymousUser.tsx'
import {useEffect} from 'react'
import {ProtectedPage} from './ProtectedPage.tsx'
import mixpanel from 'mixpanel-browser'
import {RedirectToCheckout} from '../pages/login/RedirectToCheckout.tsx'
import {LearnPage} from '../pages/learn/LearnPage.tsx'
import {ImpersonatePage} from '../pages/impersonate/ImpersonatePage'
import {JuanjoWaitingList} from "@/pages/landing/JuanjoWaitingList.tsx"

export const RoutingComponent = () => {
    const location = useLocation()

    useEffect(() => {
        mixpanel.track_pageview({ page: location.pathname.split('/')[1] })
    }, [location])

    return <Routes>
        {/** PUBLIC **/}
        <Route path="/register" element={
            <WithAnonymousUser userType='Customer'>
                <RedirectToCheckout/>
            </WithAnonymousUser>
        }/>
        <Route path="/login" element={<LoginPage/>}/>

        {/** END USERS CHAT **/}
        <Route path="/chat" element={
            <WithAnonymousUser userType='End User'>
                <UserChatPage/>
            </WithAnonymousUser>
        }/>

        <Route path="/landings/juanjo-waiting-list" element={
            <WithAnonymousUser userType='End User'>
                <JuanjoWaitingList/>
            </WithAnonymousUser>
        }/>

        {/** PRIVATE **/}
        <Route path="*" element={
            <ProtectedPage>
                <Routes>
                    <Route path="/" element={
                        <Navigate to='create'/>
                    }/>
                    <Route path="/create" element={<CreatePage/>}/>
                    <Route path="/publish" element={<PublishPage/>}/>
                    <Route path="/feedback" element={<FeedbackPage/>}/>
                    <Route path="/logout" element={<LogOut/>}/>
                    <Route path="/learn" element={<LearnPage/>}/>
                    <Route path="/impersonate" element={<ImpersonatePage />} />
                </Routes>
            </ProtectedPage>
        }/>
    </Routes>
}
