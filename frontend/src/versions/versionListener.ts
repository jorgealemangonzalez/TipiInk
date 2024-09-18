import {Version} from './Version.ts'
import {collection, getDocs, limit, orderBy, query, QuerySnapshot, Timestamp} from "firebase/firestore"
import {getCollection} from "@/firebase/getCollection.ts"
import {firestore} from "@/firebase/firebase.ts"
import {isLocalEnvironment} from "@/environment.ts"
import {Sentry} from "@/sentry.ts"
import mixpanel from "mixpanel-browser"

const getCurrentVersionFromDb = async () => {
    if (isLocalEnvironment) {
        return {
            id: 'test',
            commitHash: 'test',
            createdAt: Timestamp.now(),
            isBreaking: false
        } as Version
    }

    const versionsRef = collection(firestore, 'app_versions')
    const versions = await getDocs(query(versionsRef,
        orderBy('createdAt', 'desc'),
        limit(1)
    )) as QuerySnapshot<Version>
    return {...versions.docs[0].data(), id: versions.docs[0].id} as Version
}

async function listenToVersionChanges() {

    let currentVersion: Version = await getCurrentVersionFromDb()

    function setCurrentLocalVersion(latestBreakingVersion: Version) {
        console.log('Setting current version to', {latestBreakingVersion})
        currentVersion = latestBreakingVersion
        localStorage.setItem('version', JSON.stringify(latestBreakingVersion))
    }

    setCurrentLocalVersion(currentVersion)

    getCollection<Version>({
        orderBy: ["createdAt", "desc"],
        where: [["isBreaking", "==", true]],
        path: 'app_versions',
        limit: 1
    },
    ([latestBreakingVersion]) => {
        try {
            console.log('Listener received a new version:', {latestBreakingVersion})
            if (
                latestBreakingVersion &&
                    latestBreakingVersion.createdAt.toMillis() > currentVersion.createdAt.toMillis()
            ) {
                mixpanel.track('Client version updated', {
                    latestBreakingVersion,
                    currentVersion
                })
                setCurrentLocalVersion(latestBreakingVersion)
                window.location.reload()
            }
        } catch (e) {
            console.error(e)
            Sentry.captureException(e)
        }
    })
}

try {
    listenToVersionChanges()
} catch (e) {
    console.error(e)
    Sentry.captureException(e)
}
