import {ChangeEvent, FormEvent, useRef, useState} from 'react'
import {uploadFileToStorage} from '@/firebase/fileStorage.ts'
import {useUser} from '@/auth/auth.tsx'
import {useChatBotConfig} from '@/old/contexts/ChatBotConfig.tsx'
import {ExclamationTriangleIcon, TrashIcon} from '@heroicons/react/24/outline'
import {useTranslation} from 'react-i18next'

export const KnowledgeBase = () => {
    const { uid } = useUser()
    const { config, setConfigSync, setConfig } = useChatBotConfig()
    const [files, setFiles] = useState<FileList | null>(null)
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { t } = useTranslation()

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                if (selectedFiles[i].size > 200 * 1024 * 1024) { // 100 MB
                    setErrorMessage(t('file.exceeds.size', `File {{name}} exceeds 200 MB`, { name: selectedFiles[i].name }))
                    setFiles(null)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                    return
                }
                if (config.files?.some(file => file.name === selectedFiles[i].name)) {
                    setErrorMessage(t('file.already.exists', `File {{name}} already exists`, { name: selectedFiles[i].name }))
                    setFiles(null)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                    return
                }
            }
            setFiles(selectedFiles)
            setErrorMessage(null)
        }
    }

    function buildPath(file: File) {
        return `customers/${uid}/${file.name}`
    }

    async function uploadFiles() {
        const filesArray = Array.from(files!)
        const totalSize = filesArray.reduce((acc, file) => acc + file.size, 0)
        let totalUploaded = 0
        await Promise.all(filesArray.map(file => {
            let previousTotalFileUploaded = 0
            return uploadFileToStorage(buildPath(file), file, (totalFileUploaded) => {
                totalUploaded = totalUploaded + (totalFileUploaded - previousTotalFileUploaded) // Add just the delta
                previousTotalFileUploaded = totalFileUploaded
                setProgress(totalUploaded / totalSize * 100)
            })
        }))
    }

    const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!files || files.length === 0) return

        setIsUploading(true)
        await uploadFiles()
        await setConfigSync({
            files: [
                ...(config?.files || []),
                ...Array.from(files).map(file => ({
                    name: file.name,
                    path: buildPath(file),
                })),
            ],
        })
        setIsUploading(false)
        setFiles(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveFile = async (filePath: string) => {
        console.log('Removing file:', filePath)
        const updatedFiles = config.files?.filter(file => file.path !== filePath) || []
        setConfig({ files: updatedFiles })
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-center">{t('knowledge.base', 'Your knowledge base')}</h1>
            {errorMessage && (
                <div role="alert" className="alert alert-error">
                    <ExclamationTriangleIcon className="h-6 w-6 shrink-0 stroke-2"/>
                    <span>{errorMessage}</span>
                </div>
            )}
            {config.files && (
                <div className="py-2">
                    <div className="flex flex-col gap-2">
                        {config.files?.map(file => (
                            <div key={file.path} className="flex justify-between items-center gap-4">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap w-full">{file.name}</span>
                                <button
                                    className="btn hover:btn-error btn-ghost btn-sm btn-circle"
                                    onClick={() => handleRemoveFile(file.path)}
                                >
                                    <TrashIcon className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <form onSubmit={handleUpload}>
                <div className="form-control w-full mb-4">
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-sm w-full"
                        accept=".c, .cpp, .css, .csv, .docx, .gif, .go, .html, .java, .jpeg, .jpg, .js, .json, .md, .pdf, .php, .pkl, .png, .pptx, .py, .rb, .tar, .tex, .ts, .txt, .webp, .xlsx, .xml, .zip"
                    />
                </div>
                {isUploading && (
                    <div className="mb-4">
                        <label className="label">
                            <span className="label-text">{t('upload.progress', 'Upload Progress')}</span>
                        </label>
                        <progress
                            className="progress progress-primary w-full"
                            value={progress}
                            max="100"
                        ></progress>
                    </div>
                )}
                <button type="submit" className="btn btn-primary w-full" disabled={isUploading || !files}>
                    {isUploading ? t('uploading', 'Uploading...') : t('upload', 'Upload')}
                </button>
            </form>
        </div>
    )
}

export const AddKnowledgeModal = () => <dialog id="my_modal_3" className="modal">
    <form method="dialog" className="modal-backdrop">
        <button>close</button>
    </form>
    <div className="modal-box pt-8">
        <KnowledgeBase/>
    </div>
</dialog>
