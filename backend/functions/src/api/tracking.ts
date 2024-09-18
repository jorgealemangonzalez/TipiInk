import {PropertyDict, Mixpanel} from 'mixpanel'
import {onFunctionsInit} from '../functions/OnFunctionsInit'
import * as MixpanelInitializer from 'mixpanel'

let mixpanel: Mixpanel

onFunctionsInit(() => {
    mixpanel = MixpanelInitializer.init(process.env.MIXPANEL_TOKEN as string)
})

export const trackEvent = (uid: string, eventName: string, properties: PropertyDict = {}) =>
    new Promise((resolve, reject) => {
        mixpanel.track(eventName, {distinct_id: uid, ...properties}, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    })
