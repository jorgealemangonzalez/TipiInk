import { useEffect, useRef, useState } from 'react'

import { Mic } from 'lucide-react'

import { cn } from '@/lib/utils'
import VapiWebClient from '@vapi-ai/web'

const vapi = new VapiWebClient('27ed500b-e974-4805-89a5-76a7f7d70044')
const INACTIVITY_TIMEOUT = 10000

export function AssistantButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [callInProgress, setCallInProgress] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [transcript, setTranscript] = useState('')
    const [assistantResponse, setAssistantResponse] = useState('')
    const inactivityTimer = useRef<NodeJS.Timeout>()

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current)
        }
        inactivityTimer.current = setTimeout(() => {
            console.log('Stopping due to inactivity')
            stopListening()
        }, INACTIVITY_TIMEOUT)
    }

    useEffect(() => {
        // Set up event listeners
        vapi.on('message', message => {
            console.log('Message:', message)
            resetInactivityTimer()
        })

        vapi.on('speech-start', () => {
            console.log('Speech started')
            resetInactivityTimer()
        })

        vapi.on('speech-end', () => {
            console.log('Speech ended')
            resetInactivityTimer()
        })

        vapi.on('call-start', () => {
            console.log('Call started')
            setIsListening(true)
            setIsLoading(false)
            setCallInProgress(true)
            resetInactivityTimer()
        })

        vapi.on('call-end', () => {
            console.log('Call ended')
            setIsListening(false)
            setCallInProgress(false)
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current)
            }
        })

        vapi.on('error', error => {
            console.error('VAPI error:', error)
            setError(error.message || 'Error en la comunicación con el asistente')
            stopListening()
        })

        // Cleanup event listeners and timer
        return () => {
            vapi.stop()
            vapi.removeAllListeners()
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current)
            }
        }
    }, [])

    const stopListening = () => {
        console.log('Stopping assistant')
        vapi.stop()
        setIsLoading(false)
        setIsListening(false)
        setCallInProgress(false)
        setTranscript('')
        setError(null)
        setAssistantResponse('')
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current)
        }
    }

    const handleClick = async () => {
        if (callInProgress) {
            stopListening()
        } else {
            setIsLoading(true)
            setError(null)
            setTranscript('')
            setAssistantResponse('')

            try {
                const assistant = await vapi.start('d92417fe-3a9d-4a90-8741-ab7c312be2f2')

                console.log('Assistant started:', assistant)
            } catch (error) {
                console.error('Error iniciando VAPI:', error)
                setError(error instanceof Error ? error.message : 'Error desconocido')
                stopListening()
            }
        }
    }

    return (
        <div className='flex flex-col items-center gap-4'>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={cn(
                    'relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300',
                    'before:absolute before:h-full before:w-full before:rounded-full before:transition-all before:duration-300',
                    isListening
                        ? 'bg-red-500 before:bg-red-500/30 hover:bg-red-600'
                        : 'bg-blue-500 before:bg-blue-500/30 hover:bg-blue-600',
                    isLoading && 'before:animate-ping',
                    isListening && 'before:animate-bounce',
                    'disabled:cursor-not-allowed disabled:opacity-70',
                )}
                title={isListening ? 'Detener' : 'Comenzar a escuchar'}
            >
                <Mic
                    className={cn(
                        'h-6 w-6 transition-opacity duration-300',
                        isLoading && 'animate-pulse',
                        isListening && 'animate-bounce',
                    )}
                />
            </button>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            {transcript && (
                <div className='max-w-md rounded-lg bg-gray-100 p-4'>
                    <p className='text-sm text-gray-600'>Transcripción:</p>
                    <p className='text-gray-800'>{transcript}</p>
                </div>
            )}
            {assistantResponse && (
                <div className='max-w-md rounded-lg bg-blue-50 p-4'>
                    <p className='text-sm text-blue-600'>Respuesta:</p>
                    <p className='text-gray-800'>{assistantResponse}</p>
                </div>
            )}
        </div>
    )
}
