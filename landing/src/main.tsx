import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './api/tracking.ts'
import './i18n.ts'
import {LandingPage} from "./LandingPage.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LandingPage/>
    </React.StrictMode>
)
