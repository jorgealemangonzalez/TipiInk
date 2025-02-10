import { useState, useCallback, useEffect } from "react"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import VapiWebClient from "@vapi-ai/web"

const vapi = new VapiWebClient("27ed500b-e974-4805-89a5-76a7f7d70044")

export function AssistantButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [callInProgress, setCallInProgress] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [transcript, setTranscript] = useState("")
    const [assistantResponse, setAssistantResponse] = useState("")

    useEffect(() => {
        // Set up event listeners
        vapi.on("message", (message) => {
            console.log("Message:", message)
        })

        vapi.on("speech-start", () => {
            console.log("Speech started")
        })

        vapi.on("speech-end", () => {
            console.log("Speech ended")
            setIsListening(false)
        })

        vapi.on("call-start", () => {
            console.log("Call started")
            setIsListening(true)
            setIsLoading(false)
            setCallInProgress(true)
        })

        vapi.on("call-end", () => {
            console.log("Call ended")
            setIsListening(false)
            setCallInProgress(false)
        })

        vapi.on("error", (error) => {
            console.error("VAPI error:", error)
            setError(error.message || "Error en la comunicación con el asistente")
            stopListening()
        })

        // Cleanup event listeners
        return () => {
            vapi.stop()
            vapi.removeAllListeners()
        }
    }, [])

    const stopListening = () => {
        console.log("Clicked to stop listening")
        vapi.stop()
        setIsListening(false)
        setIsLoading(false)
        setTranscript("")
        setAssistantResponse("")
        setCallInProgress(false)
    }

    const handleClick = async () => {
        if (callInProgress) {
            stopListening()
        } else {
            setIsLoading(true)
            setError(null)
            setTranscript("")
            setAssistantResponse("")

            try {
                const assistant = await vapi.start("d92417fe-3a9d-4a90-8741-ab7c312be2f2")
                setIsListening(true)
                console.log("Assistant started:", assistant)
            } catch (error) {
                console.error("Error iniciando VAPI:", error)
                setError(error instanceof Error ? error.message : "Error desconocido")
                stopListening()
            }
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600",
                    "before:absolute before:h-full before:w-full before:rounded-full before:bg-blue-500/30 before:transition-all before:duration-300",
                    isLoading && "before:animate-ping",
                    isListening && "before:animate-bounce",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-70"
                )}
                title={isListening ? "Detener" : "Comenzar a escuchar"}
            >
                <Mic
                    className={cn(
                        "h-6 w-6 transition-opacity duration-300",
                        isLoading && "animate-pulse",
                        isListening && "animate-bounce"
                    )}
                />
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {transcript && (
                <div className="max-w-md rounded-lg bg-gray-100 p-4">
                    <p className="text-sm text-gray-600">Transcripción:</p>
                    <p className="text-gray-800">{transcript}</p>
                </div>
            )}
            {assistantResponse && (
                <div className="max-w-md rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-600">Respuesta:</p>
                    <p className="text-gray-800">{assistantResponse}</p>
                </div>
            )}
        </div>
    )
}
