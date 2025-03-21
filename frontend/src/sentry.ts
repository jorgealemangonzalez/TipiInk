import { useEffect } from 'react'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'

import * as Sentry from '@sentry/react'

import { isTestEnvironment } from './environment.ts'

const sentryFeedback = Sentry.feedbackIntegration({
    colorScheme: 'system',
    autoInject: false, // TODO ONLY DISABLE IN CHAT
    triggerLabel: 'Reportar un error', // The label of the injected button that opens up the feedback form.
    triggerAriaLabel: 'Reportar un error', // The aria label of the injected button that opens up the feedback form.
    formTitle: 'Reportar un error', // The title at the top of the feedback form.
    submitButtonLabel: 'Enviar reporte de error', // The label of the submit button in the feedback form.
    cancelButtonLabel: 'Cancelar', // The label of cancel buttons in the feedback form.
    confirmButtonLabel: 'Confirmar', // The label of confirm buttons in the feedback form.
    addScreenshotButtonLabel: 'Añadir una captura de pantalla', // The label of the button to add a screenshot.
    removeScreenshotButtonLabel: 'Eliminar captura de pantalla', // The label of the button to remove the screenshot.
    nameLabel: 'Nombre', // The label of the name input field.
    namePlaceholder: 'Tu nombre', // The placeholder for the name input field.
    emailLabel: 'Correo electrónico', // The label of the email input field.
    emailPlaceholder: 'tu.correo@ejemplo.org', // The placeholder for the email input field.
    isRequiredLabel: '(requerido)', // The label shown next to an input field that is required.
    messageLabel: 'Descripción', // The label for the feedback description input field.
    messagePlaceholder: '¿Cuál es el error? ¿Qué esperabas?', // The placeholder for the feedback description input field.
    successMessageText: '¡Gracias por tu reporte!', // The message displayed after a successful feedback submission.
})

if (!isTestEnvironment) {
    Sentry.init({
        environment: isTestEnvironment ? 'test' : 'production',
        dsn: 'https://91f1913184d6b7bbf5a28d7a52bdc24d@o4507768963268608.ingest.us.sentry.io/4507768967987200',
        integrations: [
            // See docs for support of different versions of variation of react router
            // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
            Sentry.reactRouterV6BrowserTracingIntegration({
                useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes,
            }),
            Sentry.replayIntegration(),
            Sentry.browserProfilingIntegration(),
            sentryFeedback,
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        tracesSampleRate: 1.0,

        // Set profilesSampleRate to 1.0 to profile every transaction.
        // Since profilesSampleRate is relative to tracesSampleRate,
        // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
        // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
        // results in 25% of transactions being profiled (0.5*0.5=0.25)
        profilesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/us-central1-tipi-ink\.cloudfunctions\.net/],

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
    })
}

export { Sentry, sentryFeedback }
