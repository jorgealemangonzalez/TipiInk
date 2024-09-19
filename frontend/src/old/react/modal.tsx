import {ReactNode} from 'react'
import {XMarkIcon} from '@heroicons/react/24/outline'

export const FullPageModal = ({children, onClose}: { children: ReactNode, onClose: () => void }) => {
    return <div className="z-40 fixed inset-0 fixed">
        <XMarkIcon className="fixed z-50 top-2 left-2 cursor-pointer size-10" onClick={onClose}/>
        <div className='size-full flex flex-col justify-end'>
            {children}
        </div>
    </div>
}
