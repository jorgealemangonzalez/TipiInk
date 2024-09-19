import {useRef} from 'react'

export const useScrollToBottom = () => {
    const ref = useRef<HTMLDivElement>(null)

    function scrollToBottom() {
        if (ref.current) {
            const {current: {scrollHeight, clientHeight}} = ref
            ref.current.scrollTop = scrollHeight - clientHeight
        }
    }

    return {ref, scrollToBottom}
}
