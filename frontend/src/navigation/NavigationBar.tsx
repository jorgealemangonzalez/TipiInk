import {NavLink} from 'react-router-dom'
import {ChatBubbleLeftRightIcon, MagnifyingGlassIcon, RocketLaunchIcon} from '@heroicons/react/24/outline'
import {useTranslation} from "react-i18next"

export const NavigationBar = () => {
    const {t} = useTranslation()
    return (
        <div className='fixed p-4 flex flex-row justify-center lg:justify-start w-full'>
            <ul className="menu bg-main-200 menu-horizontal rounded-box gap-1">
                <li>
                    <NavLink
                        to="/create"
                        className={({ isActive }) => isActive ? "active" : "hover:bg-main-300"}>
                        <ChatBubbleLeftRightIcon className="h5 w-5"/>
                        {t('create', 'Create')}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/publish"
                        className={({ isActive }) => isActive ? "active" : "hover:bg-main-300"}>
                        <RocketLaunchIcon className="h5 w-5"/>
                        {t('publish', 'Publish')}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/learn"
                        className={({ isActive }) => isActive ? "active" : "hover:bg-main-300"}>
                        <MagnifyingGlassIcon className="h5 w-5"/>
                        {t('learn', 'Learn')}
                    </NavLink>
                </li>
                {/*<li>*/}
                {/*    <NavLink*/}
                {/*        to="/feedback"*/}
                {/*        className={({ isActive }) => isActive ? "active" : "hover:bg-neutral-300"}>*/}
                {/*        <QuestionMarkCircleIcon className="h5 w-5"/>*/}
                {/*        Feedback*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
            </ul>
        </div>
    )
}
