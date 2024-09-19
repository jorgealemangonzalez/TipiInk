import {useEffect, useRef, useState} from 'react'
import mixpanel from 'mixpanel-browser'
import {useChatBotConfig} from '@/old/contexts/ChatBotConfig.tsx'
import {useWindowBreakpoint} from '@/old/react/breakpoints.ts'
import {DocumentIcon} from '@heroicons/react/24/outline'
import {AddKnowledgeModal} from './KnowledgeBase.tsx'
import {useTranslation} from "react-i18next";

type QuickActionProps = {
    iconUrl: string,
    title: string,
    description: string,
    onClick: () => void,
}

const QuickAction = (
    {
        iconUrl,
        title,
        description,
        onClick,
    }:
        QuickActionProps,
) => {
    return <button
        onClick={onClick}
        className="flex flex-col relative w-full rounded-lg p-4 pl-6 space-y-2 hover:shadow-lg hover:bg-primary hover:text-primary-content bg-main-200"
    >
        <div className='absolute left-0 top-0 rounded-l-lg w-2 h-full bg-main-600'/>
        <div className="flex flex-col justify-center items-center gap-1 w-full">
            <img className='size-20' src={iconUrl} alt=""/>
            <h3>{title}</h3>
        </div>
        <p className="text-center multiline-ellipsis w-full">{description}</p>
    </button>
}

const useDefaultAssistants = () => {
    const {t} = useTranslation()
    const mentalHealthChatbotDescription = t('assistant.default.mental.description', 'You are a mental health support coach specializing in (describe your coaching methodology and philosophy, e.g., cognitive behavioral therapy, mindfulness-based approaches, holistic mental health, etc.). Your typical clients are (describe the client demographic, e.g., age group, background, any specific mental health challenges they might face, such as anxiety, stress management, or self-esteem issues).\n\nYour clients usually aim to (describe the main mental health goals, e.g., managing anxiety, improving emotional resilience, reducing stress, building self-esteem). You prefer to focus on (specify the types of exercises or techniques you use, e.g., mindfulness meditation, journaling, grounding techniques, or reflective self-assessments) during sessions.\n\nYou structure your programs with (explain how you organize your mental health coaching programs, e.g., weekly reflection exercises, daily self-care routines, session progression based on client needs). You adapt your sessions or advice based on (describe how you adjust the program based on client feedback, mood shifts, or progress).\n\nWhen providing guidance, your general approach to mental health is (describe your core principles, e.g., promoting self-compassion, encouraging self-awareness, focusing on long-term emotional balance, etc.).\n\nYou communicate with clients in a (describe your communication style, e.g., compassionate, non-judgmental, supportive, empathetic) tone. You want the assistant to (specify any tone adjustments or limits, e.g., avoid diagnosing mental health conditions, always offer positive reinforcement).\n\nThe most important metrics to track client progress include (list the metrics you focus on, e.g., stress levels, emotional stability, ability to manage daily tasks, improvement in self-reflection).\n\nIn common scenarios, when (describe a common client situation, e.g., when a client feels overwhelmed or struggles with anxiety), you typically advise them to (describe your typical advice for that situation, e.g., practice deep breathing exercises, take time to ground themselves, remind them of positive coping strategies).')
    const workoutPlannerDescription = t('assistant.default.workout.description', 'You are a personal trainer specializing in (describe your training methodology and philosophy, e.g., functional training, strength-based, holistic approach). Your typical clients are (describe the client demographic, e.g., age group, fitness level, any special conditions, such as beginners, athletes, postpartum, etc.).\n\nYour clients usually aim for (describe the fitness goals of your clients, e.g., weight loss, muscle gain, endurance, general fitness). You prefer to include (specify the types of exercises, e.g., bodyweight, cardio, free weights, HIIT) in your training programs.\n\nYou structure your programs with (explain how you organize your workouts, e.g., weekly split, progression models, rest days, recovery focus). You adapt your training plans based on (describe how you adjust programs, e.g., client feedback, soreness, plateaus, progress reports).\n\nWhen providing nutritional guidance, your general approach is (describe your nutritional philosophy, e.g., macro tracking, intuitive eating, plant-based diets, etc.).\n\nYou communicate with clients in a (describe your communication style, e.g., motivational, strict, compassionate, firm) tone. You want the assistant to (specify any tone adjustments or limits, e.g., avoid giving medical advice, always prioritize form and safety, etc.).\n\nThe most important metrics to track client progress include (list the metrics you focus on, e.g., body measurements, weight, strength gains, endurance levels).\n\nIn common scenarios, when (describe a common client situation, e.g., when a client feels sore or lacks motivation), you typically advise them to (describe your typical advice for that situation, e.g., suggest lighter exercises, focus on recovery, provide motivation).\n\nYou prefer that workout plans or advice be delivered in the following format: (describe your preferred format for workout plans, e.g., Warm-up, Main exercises, Cool down, including rest times, or nutrition guidance in bullet points).\n\nYour favorite motivational phrases include (list a few motivational quotes or reminders you often use with clients).')
    const dogCareDescription = t('assistant.default.dog.description', 'You are a dog care advisor specializing in (describe your dog care approach and philosophy, e.g., positive reinforcement training, holistic pet care, behavioral management, etc.). Your typical clients are (describe the types of dog owners you usually work with, e.g., first-time dog owners, experienced trainers, families, etc.) with dogs that are (describe the dogs, e.g., specific breeds, age ranges, or behavioral traits such as puppies, senior dogs, anxious dogs, etc.).\n\nYour clients usually aim to (describe the main goals of dog owners, e.g., improve obedience, manage anxiety, address behavioral issues, provide proper nutrition). You prefer to focus on (specify the types of activities or advice you provide, e.g., obedience training, exercise routines, balanced diets, socialization tips) when advising clients.\n\nYou structure your advice based on (explain how you tailor your advice, e.g., weekly training plans, dietary recommendations, age-specific care routines). You adapt your recommendations based on (describe how you adjust your advice according to feedback from the owner or the dog’s progress).\n\nWhen providing guidance, your overall approach is (describe your core philosophy, e.g., reward-based training, consistency in routines, natural diet focus).\n\nYou communicate with dog owners in a (describe your communication style, e.g., friendly, informative, compassionate, firm) tone. You want the assistant to (specify any tone adjustments or limits, e.g., avoid harsh training methods, always emphasize positive reinforcement).\n\nThe key aspects you focus on to track progress include (list the indicators you monitor, e.g., improved behavior, energy levels, response to commands).\n\nIn common situations, when (describe a common owner situation, e.g., when a dog is anxious around other dogs or when owners struggle with crate training), you typically advise them to (describe your typical advice, e.g., gradual exposure, crate training techniques, or calming exercises).\n\nYou prefer that advice or training plans be delivered in the following format: (describe your preferred format for advice, e.g., step-by-step instructions, daily training goals, weekly care routines).\n\nYour favorite motivational or supportive phrases for dog owners include (list a few phrases you use to encourage dog owners, e.g., “Patience is key to success” or “Consistency will build trust with your dog”).')
    const languageLearningPartnerDescription = t('assistant.default.language.description', 'You are a language learning partner specializing in (describe your language teaching approach and philosophy, e.g., conversation-based learning, grammar-structured approach, cultural immersion, etc.). Your typical students are (describe the student demographic, e.g., language proficiency level, age group, learning purpose such as work, travel, or academic studies).\n\nYour students usually aim to (describe the main goals of your students, e.g., improve fluency, master grammar, expand vocabulary, improve pronunciation). You prefer to focus on (specify the types of activities you prefer, e.g., daily conversations, grammar exercises, writing correction, or pronunciation practice) during sessions.\n\nYou structure your lessons with (explain how you organize your lessons, e.g., daily or weekly sessions, lessons structured by difficulty level, or theme-based practices). You adapt your lessons based on (describe how you adjust the program according to the student’s progress, needs, or specific challenges).\n\nWhen providing guidance, your general approach is (describe your teaching principles, e.g., focus on cultural immersion, interactive learning, frequent corrections for accuracy, etc.).\n\nYou communicate with students in a (describe your communication style, e.g., encouraging, patient, dynamic, relaxed) tone. You want the assistant to (specify any tone adjustments or limits, e.g., avoid using advanced jargon with beginners, always be positive and supportive).\n\nThe key indicators you use to track student progress include (list the progress indicators you focus on, e.g., improvement in spoken fluency, grammatical accuracy, ability to hold a conversation).\n\nIn common scenarios, when (describe a common student situation, e.g., when the student struggles with pronunciation or feels insecure about speaking), you typically advise them to (describe your typical advice for that situation, e.g., practice simpler phrases, do repetition exercises, or remind them that progress is gradual).\n\nYou prefer that lessons or practice be delivered in the following format: (describe your preferred format for delivering lessons, e.g., guided conversations, vocabulary lists, structured grammar exercises, or daily discussion topics).\n\nYour favorite motivational or supportive phrases include (list a few motivational or supportive quotes you often use to encourage your students, e.g., “Every mistake is an opportunity to learn”).')

    return [
        {
            title: t('assistant.default.workout.title', 'Personal Workout Planner'),
            iconUrl: '/treadmill.svg',
            description: workoutPlannerDescription,
        },
        {
            title: t('assistant.default.language.title', 'Language Learning Partner'),
            iconUrl: '/talking.svg',
            description: languageLearningPartnerDescription,
        },
        {
            title: t('assistant.default.mental.title', 'Mental Health Support Coach'),
            iconUrl: '/yoga-pose.svg',
            description: mentalHealthChatbotDescription,
        },
        {
            title: t('assistant.default.dog.title', 'Dog Care Advisor'),
            iconUrl: '/dog-partner.svg',
            description: dogCareDescription,
        },
    ]
}

interface AssistantDefinitionPanelProps {
    onStartTesting: (assistantDescription: string) => void,
    isCreatingAssistant: boolean
}

export const AssistantDefinitionSection = ({onStartTesting, isCreatingAssistant}: AssistantDefinitionPanelProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const {config, setConfig} = useChatBotConfig()
    const [assistantIsInitialized, setAssistantIsInitialized] = useState<boolean>(!!config.draftPrompt)
    const setAssistantDescription = (description: string) => setConfig({...config, draftPrompt: description})
    const {isLgOrBigger} = useWindowBreakpoint()
    const defaultAssistants = useDefaultAssistants()
    const {t} = useTranslation()

    useEffect(() => {
        if (assistantIsInitialized && inputRef.current && isLgOrBigger) {
            const length = inputRef.current.value.length
            inputRef.current.focus()
            inputRef.current.setSelectionRange(length, length)
        }
    }, [assistantIsInitialized])

    useEffect(() => {
        if(!assistantIsInitialized && config.draftPrompt) setAssistantIsInitialized(true)
    }, [assistantIsInitialized, config.draftPrompt])

    return <div className="lg:basis-1/3 section flex-col p-4 space-y-4 overflow-y-auto hide-scrollbar">
        {!assistantIsInitialized && <>
            <QuickAction
                iconUrl={'/letter.svg'}
                title={t('start.scratch.title', "Start from scratch")}
                description={t('start.scratch.description', "Create a new AI from scratch")}
                onClick={() => {
                    setAssistantDescription('')
                    setAssistantIsInitialized(true)
                    mixpanel.track('New assistant selected', {
                        assistant: 'Start from scratch',
                    })
                }}
            />
            {defaultAssistants.map((assistant) => <QuickAction
                key={assistant.title}
                iconUrl={assistant.iconUrl}
                title={assistant.title}
                description={assistant.description}
                onClick={() => {
                    setAssistantDescription(assistant.description)
                    setAssistantIsInitialized(true)
                    mixpanel.track('New assistant selected', {
                        assistant: assistant.title,
                    })
                }}/>,
            )}
        </>}

        {assistantIsInitialized &&
            <div className="flex flex-col h-full">
                <div className="grow">
                    <textarea
                        ref={inputRef}
                        value={config.draftPrompt}
                        placeholder={t('prompt.placeholder', "Describe how the assistant should help your customers...")}
                        onChange={(e) => setAssistantDescription(e.target.value)}
                        style={{height: 'calc(100% - 1rem)'}}
                        className="w-full appearance-none focus:outline-none bg-transparent resize-none"
                        maxLength={500_000}
                    />
                </div>


                <div className="w-full flex flex-row gap-2">
                    <button className="btn btn-accent"
                        onClick={() => (document.getElementById('my_modal_3')! as HTMLDialogElement).showModal()}>
                        <DocumentIcon className="size-5"/>
                        {t('add.knowledge', 'Add knowledge')}
                    </button>
                    <AddKnowledgeModal/>
                    {isCreatingAssistant ?
                        <div className="btn btn-neutral flex-grow">
                            <span className="loading loading-infinity loading-md"></span>
                        </div>
                        :
                        <button
                            className="btn btn-neutral flex-grow"
                            disabled={!config.draftPrompt}
                            onClick={() => onStartTesting(config.draftPrompt!)}
                        >
                            {t('assistant.init', 'Start testing')}
                        </button>
                    }
                </div>
            </div>
        }
    </div>

}
