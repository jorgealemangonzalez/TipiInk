import {useEffect, useState} from 'react'

export const useWindowBreakpoint = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return {
        isSmOrBigger: width >= 640,
        isMdOrBigger: width >= 768,
        isLgOrBigger: width >= 1024,
        isXlOrBigger: width >= 1280,
        isXxlOrBigger: width >= 1536,
    }
}
