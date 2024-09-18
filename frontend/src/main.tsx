import {Sentry} from './sentry'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './api/tracking.ts'
import './i18n.ts'
import './versions/versionListener.ts'
import {RoutingComponent} from './navigation/RoutingComponent.tsx'
import {BrowserRouter} from 'react-router-dom'
import {UnauthenticatedProviders} from './contexts/providers.tsx'
import {ErrorPage} from "./ErrorPage.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={<ErrorPage/>} showDialog>
            <UnauthenticatedProviders>
                <BrowserRouter>
                    <RoutingComponent/>
                </BrowserRouter>
            </UnauthenticatedProviders>
        </Sentry.ErrorBoundary>
    </React.StrictMode>
)
