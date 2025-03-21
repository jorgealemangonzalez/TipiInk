import mixpanel from 'mixpanel-browser'

import { isTestEnvironment } from '../environment.ts'

const projectToken = isTestEnvironment
    ? '2b86dbe53383c0f7b088079cd728129c' // Testing
    : 'e4fe06a0b9dc693edc7ad73b8538380e' // Production

mixpanel.init(projectToken, {
    api_host: 'https://mixpanel-tracking-proxy-7tducinnmq-uc.a.run.app',
})

// Function to get URL parameter by name
function getParameterByName(name: string) {
    const url = window.location.href
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Capture UTM parameters
const utm_source = getParameterByName('utm_source')
const utm_medium = getParameterByName('utm_medium')
const utm_campaign = getParameterByName('utm_campaign')
const utm_term = getParameterByName('utm_term')
const utm_content = getParameterByName('utm_content')
const fbclid = getParameterByName('fbclid')
const gclid = getParameterByName('gclid')

mixpanel.register_once({
    utm_source: utm_source,
    utm_medium: utm_medium,
    utm_campaign: utm_campaign,
    utm_term: utm_term,
    utm_content: utm_content,
    fbclid: fbclid,
    gclid: gclid,
})
