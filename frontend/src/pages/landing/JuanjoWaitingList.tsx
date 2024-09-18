import {useState} from 'react'
import {Link} from "react-router-dom"
import {addToWaitingList} from '@/api/clients.ts'
import mixpanel from "mixpanel-browser"
import {ChatBubbleLeftIcon} from "@heroicons/react/24/outline"

const Header = () => {
    return (
        <div className="text-center mb-12">
            <img
                src="/clients/juanjo/tasquita-logo.png"
                alt="La Tasquita de Enfrente"
                className="mx-auto mb-4 lg:mb-6 w-full max-w-xs lg:max-w-md"
            />
        </div>
    )
}

const ChefIntro = () => {
    return (
        <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-4">
                    Chef Juanjo Lopez Bedmar
            </h2>
            <p className="text-sm lg:text-lg font-medium text-gray-600 mb-6 max-w-2xl mx-auto">
                    Conoce mis secretos y todo lo aprendido en estos 25 años de la Tasquita de Enfrente
            </p>
            <img
                src="/clients/juanjo/juanjo-calling.png"
                alt="Chef Juanjo Lopez Bedmar"
                className="mx-auto mb-8 rounded-lg shadow-lg w-full max-w-xs lg:max-w-2xl"
            />
        </div>
    )
}

const WaitlistForm = ({email, setEmail, handleSubmit}: {
    email: string
    setEmail: (email: string) => void
    handleSubmit: (e: React.FormEvent) => void
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        setIsSubmitting(true)
        handleSubmit(e)
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6 max-w-md mx-auto">
            <div>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-main-300 focus:border-main-300 focus:z-10 text-sm lg:text-lg"
                    placeholder="Introduce tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button
                type="submit"
                disabled={!email}
                className={`w-full mt-2 flex justify-center btn py-2 lg:py-3 px-4 border border-transparent text-sm lg:text-lg font-medium rounded-md text-white btn-primary hover:bg-main-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-300`}
            >
                {isSubmitting ?
                    <span className="loading loading-infinity loading-md"></span>
                    :
                    <>Unirse a la Lista de Espera</>
                }
            </button>
        </form>
    )
}

const SubmissionSuccess = () => {
    return (
        <div className="text-center text-green-600">
            <p className="font-semibold text-base lg:text-xl">
                    ¡Gracias por unirte a la lista de espera!
            </p>
            <p className="text-sm lg:text-lg mt-2">
                    Te notificaremos cuando el chatbot esté listo.
            </p>
        </div>
    )
}

const Footer = () => {
    return (
        <div className="text-center mt-8 lg:mt-12 text-xs lg:text-sm text-gray-600 max-w-2xl">
            <p className="mb-2">© 2023 La Tasquita de Enfrente. Todos los derechos reservados.</p>
            <p>Puedes contactarnos escribiéndonos a</p>
            <p>tasquitadeenfrente@gmail.com o llamándonos al +34 915 325 449</p>
            <p className="mt-4">
                    Creado por{' '}
                <Link to="https://www.botwhirl.com" className="text-main-500 hover:underline">
                        BotWhirl
                </Link>
            </p>
        </div>
    )
}

export function JuanjoWaitingList() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addToWaitingList({email, chatBotConfigId: 'sSIHFAkY9jQE9Rxx2VVcNTfWVKx2'})
            mixpanel.people.set({email})
            setSubmitted(true)
        } catch (error) {
            console.error('Error submitting to waiting list:', error)
        }
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-4 sm:p-8">
            <div className="w-full max-w-md lg:max-w-4xl space-y-8 lg:space-y-0">
                <Header/>

                <div className="space-y-12">
                    <ChefIntro/>

                    <div className="bg-white border border-gray-200 text-black p-6 lg:p-8 rounded-xl shadow-lg mx-auto w-full max-w-md lg:max-w-2xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <ChatBubbleLeftIcon
                                className="size-16 lg:size-24 text-main-300"/>
                            <h3 className="mt-4 text-2xl lg:text-3xl font-serif font-bold">
                                    Asistente Virtual del Chef
                            </h3>
                            <p className="mt-2 text-gray-600 text-sm lg:text-lg">
                                    Únete a la lista de espera para nuestro exclusivo chatbot culinario
                            </p>
                            <p className="mt-2 text-gray-600 text-sm lg:text-lg italic">
                                    Los entresijos de la tasquita al alcance de todos, te ayudo en tu día a día
                                    culinario
                            </p>
                        </div>
                        {!submitted ?
                            <WaitlistForm email={email} setEmail={setEmail} handleSubmit={handleSubmit}/>:
                            <SubmissionSuccess/>
                        }
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}
