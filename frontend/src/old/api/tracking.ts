import mixpanel from 'mixpanel-browser'
import Hotjar from '@hotjar/browser'
import {isTestEnvironment} from '../../environment.ts'

if ( !isTestEnvironment ) {
    Hotjar.init(5093383, 6)
}

const projectToken = isTestEnvironment ?
    "8dce5ddf7d724972b76c69a784c2d6d0" : // Testing
    "71401458c7812557ad326e7139502b23"   // Production

mixpanel.init(projectToken, {
    api_host: "https://mixpanel-tracking-proxy-7tducinnmq-uc.a.run.app",
})

