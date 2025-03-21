import React from 'react'
import ReactDOM from 'react-dom/client'

import { LandingPage } from './LandingPage.tsx'
import './api/tracking.ts'
import './i18n.ts'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LandingPage />
    </React.StrictMode>,
)
