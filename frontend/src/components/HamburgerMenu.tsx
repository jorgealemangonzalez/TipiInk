import React, {useState} from 'react'
import {useTranslation} from "react-i18next"
import {Bars3Icon, ExclamationTriangleIcon} from "@heroicons/react/24/outline"
import {sentryFeedback} from "../sentry.ts"

export const HamburgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {t} = useTranslation()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const openFeedbackForm = async () => {
        const form = await sentryFeedback.createForm()
        form.appendToDom()
        form.open()
        toggleMenu()
    }

    return (
        <div className="drawer z-50">
            <input id="hamburger-drawer" type="checkbox" className="drawer-toggle" checked={isOpen}
                onChange={toggleMenu}/>
            <div className="drawer-content">
                <label htmlFor="hamburger-drawer" className="btn btn-circle btn-md btn-primary drawer-button fixed top-3 left-3">
                    <Bars3Icon className="size-6 stroke-[1.5px]"/>
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="hamburger-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li>
                        <a onClick={openFeedbackForm}>
                            <ExclamationTriangleIcon className="size-5 stroke-[1.5px] mr-1"/>
                            {t('userchat.menu.report.error', 'Report an error')}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
