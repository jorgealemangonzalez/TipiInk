import mixpanel from 'mixpanel-browser'
import Hotjar from '@hotjar/browser'
import {isTestEnvironment} from '../environment.ts'

if ( !isTestEnvironment ) {
    Hotjar.init(5093383, 6)
}

const projectToken = isTestEnvironment ?
    "2b86dbe53383c0f7b088079cd728129c" : // Testing
    "e4fe06a0b9dc693edc7ad73b8538380e"   // Production

mixpanel.init(projectToken, {
    api_host: "https://mixpanel-tracking-proxy-7tducinnmq-uc.a.run.app",
})

