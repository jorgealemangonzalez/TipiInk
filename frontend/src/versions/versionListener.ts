import { QuerySnapshot, Timestamp, collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import mixpanel from 'mixpanel-browser'

import { isLocalEnvironment } from '@/environment.ts'
import { CollectionCache } from '@/firebase/cache/CollectionCache.ts'
import { firestore } from '@/firebase/firebase.ts'
import { listenCollection } from '@/firebase/getCollection.ts'
import { Sentry } from '@/sentry.ts'

import { Version } from './Version.ts'

const getCurrentVersionFromDb = async () => {
    if (isLocalEnvironment) {
        return {
            id: 'test',
            commitHash: 'test',
            createdAt: Timestamp.now(),
            isBreaking: false,
        } as Version
    }

    const versionsRef = collection(firestore, 'app_versions')
    const versions = (await getDocs(
        query(versionsRef, orderBy('createdAt', 'desc'), limit(1)),
    )) as QuerySnapshot<Version>
    return { ...versions.docs[0].data(), id: versions.docs[0].id } as Version
}

async function listenToVersionChanges() {
    let currentVersion: Version = await getCurrentVersionFromDb()

    function setCurrentLocalVersion(latestBreakingVersion: Version) {
        console.log('Setting current version to', { latestBreakingVersion })
        currentVersion = latestBreakingVersion
        localStorage.setItem('version', JSON.stringify(latestBreakingVersion))
    }

    setCurrentLocalVersion(currentVersion)

    listenCollection<Version>(
        {
            orderBy: ['createdAt', 'desc'],
            where: [['isBreaking', '==', true]],
            path: 'app_versions',
            limit: 1,
        },
        async ([latestBreakingVersion]) => {
            try {
                console.log('Listener received a new version:', { latestBreakingVersion })
                if (
                    latestBreakingVersion &&
                    latestBreakingVersion.createdAt.toMillis() > currentVersion.createdAt.toMillis()
                ) {
                    mixpanel.track('Client version updated', {
                        latestBreakingVersion,
                        currentVersion,
                    })
                    await CollectionCache.erase()
                    setCurrentLocalVersion(latestBreakingVersion)
                    window.location.reload()
                }
            } catch (e) {
                console.error(e)
                Sentry.captureException(e)
            }
        },
    )
}

try {
    listenToVersionChanges()
} catch (e) {
    console.error(e)
    Sentry.captureException(e)
}
