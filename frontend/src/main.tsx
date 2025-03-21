import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@/api/tracking.ts'
import { UnauthenticatedProviders } from '@/auth/providers.tsx'

import { ErrorPage } from './ErrorPage.tsx'
import { FloatingMicButton } from './features/floating-mic/ui/FloatingMicButton.tsx'
import './i18n.ts'
import './index.css'
import { RoutingComponent } from './navigation/RoutingComponent.tsx'
import { Sentry } from './sentry'
import './versions/versionListener.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={<ErrorPage />} showDialog>
            <UnauthenticatedProviders>
                <BrowserRouter>
                    <RoutingComponent />
                    <FloatingMicButton />
                </BrowserRouter>
            </UnauthenticatedProviders>
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
)
