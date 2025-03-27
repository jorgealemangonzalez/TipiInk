import { FC, useRef, useState } from 'react'

import { Loader2, Upload } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { uploadFileToStorage } from '@/firebase/fileStorage'
import { cn } from '@/shared/lib/utils'

interface ImageUploaderProps {
    recipeId: string
    image?: string
    onImageUploaded: (imageUrl: string) => Promise<void>
}

export const ImageUploader: FC<ImageUploaderProps> = ({ recipeId, image, onImageUploaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) return

        try {
            setIsUploading(true)
            setUploadProgress(0)
            const file = event.target.files[0]
            const fileName = `${Date.now()}`
            const filePath = `recipes/${recipeId}/${fileName}`

            // Upload file and get download URL
            const imageUrl = await uploadFileToStorage(filePath, file, totalUploaded => {
                const percentage = Math.round((totalUploaded / file.size) * 100)
                setUploadProgress(percentage)
            })

            // Update recipe with new image URL via parent callback
            await onImageUploaded(imageUrl)
        } catch (error) {
            console.error('Error uploading image:', error)
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <Card className='border-border bg-card'>
            <CardHeader>
                <h2 className='text-primary text-2xl font-bold'>Foto del plato</h2>
            </CardHeader>
            <CardContent>
                {image ? (
                    <div className='group relative'>
                        <img
                            src={image}
                            alt='Foto del plato'
                            className={cn(
                                'h-80 w-full rounded-lg object-cover transition-all duration-150',
                                isUploading && 'opacity-60',
                            )}
                        />
                        {/* Hover overlay with upload button */}
                        <div
                            onClick={triggerFileInput}
                            className={cn(
                                'absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-lg transition-all duration-150 active:scale-95',
                                isUploading ? 'bg-black/50' : 'bg-black/30 opacity-0 group-hover:opacity-100',
                            )}
                        >
                            <input
                                type='file'
                                ref={fileInputRef}
                                className='hidden'
                                accept='image/*'
                                onChange={handleImageUpload}
                            />
                            {isUploading ? (
                                <div className='flex flex-col items-center gap-2'>
                                    <div className='relative'>
                                        <Loader2 className='size-20 animate-spin text-white' />
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <span className='text-xs font-medium text-white'>{uploadProgress}%</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Upload className='h-12 w-12 text-white' />
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={triggerFileInput}
                        className='border-primary/30 active:border-primary/60 flex h-80 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-black/5 transition-all duration-150 active:scale-[0.98] active:bg-black/10'
                    >
                        <input
                            type='file'
                            ref={fileInputRef}
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageUpload}
                        />
                        {isUploading ? (
                            <div className='flex flex-col items-center gap-2'>
                                <div className='relative'>
                                    <Loader2 className='text-primary/60 h-12 w-12 animate-spin' />
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className='text-primary/90 text-xs font-medium'>{uploadProgress}%</span>
                                    </div>
                                </div>
                                <p className='text-primary/70'>Subiendo imagen... ({uploadProgress}%)</p>
                            </div>
                        ) : (
                            <>
                                <Upload className='text-primary/60 h-12 w-12' />
                                <p className='text-primary/70 max-w-sm text-center'>
                                    Sube una foto del plato terminado.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
