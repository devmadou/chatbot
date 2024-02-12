"use client"

import { tss } from "tss-react/mui"
import { fr } from "@codegouvfr/react-dsfr"
import { useContext, useEffect, useRef, useState } from "react"
import ViewDisplayContext from "@/context/ViewDisplayContext"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { Select } from "@codegouvfr/react-dsfr/Select"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircularProgress } from "@mui/material"

// Available models we allow users to choose from
const models = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-1106"
] as const

// We'll define a generic message to display when a field is not filled
const REQUIRED_FIELD_MESSAGE = 'Ce champs est requis.'

// The OpenAI API expects a specific format for messages
interface Message {
    role: "system" | "user" | "assistant"
    content: string
}

// This schema will be used to validate the form data
const schema = z.object({
    model: z.enum(models, {
        errorMap: () => ({message: REQUIRED_FIELD_MESSAGE})
    }),
    message: z.string({
        errorMap: () => ({message: REQUIRED_FIELD_MESSAGE})
    }).min(1)
})

// We can infer the type of the schema and re-use it for TS validation
type FormData = z.infer<typeof schema>

export default function Demo() {
    /* -------------------------------------------------------------------------------------------------------------- */
    /* Hooks and contexts ------------------------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------------------------------------------- */
    // We'll leverage our context to create a full height layout for our chat interface
    const {setIsFullHeight} = useContext(ViewDisplayContext)

    // We'll need to store our CSRF token to send it with our POST request
    const [csrfToken, setCsrfToken] = useState('')

    // We'll need a hold of our message textarea to adjust its height when user types into it
    const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null)

    // We'll also need to scroll our messages section to the bottom when a new message is added
    const chatSectionRef = useRef<HTMLElement | null>(null)

    // This represents the messages exchanged between the user and the chatbot
    const [messages, setMessages] = useState<Message[]>([])

    // We retrieve our styles
    const {classes, cx} = useStyles()

    // We'll use react-hook-form to handle our form validation and submission
    const {
        register,
        formState: {errors, isSubmitting},
        handleSubmit,
        control,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })


    /* -------------------------------------------------------------------------------------------------------------- */
    /* Effects ------------------------------------------------------------------------------------------------------ */
    /* -------------------------------------------------------------------------------------------------------------- */

    // When the page loads, we set it to a full height layout
    useEffect(() => {
        setIsFullHeight(true)

        // When the component unmounts, we reset the layout to its original size
        return () => setIsFullHeight(false)
    }, [])

    // We'll query our backend to get a CSRF token that is necessary for any POST request
    // Fixme: actually, you need to ensure that this token is received before posting the data
    useEffect(() => {
        fetch('/api/chatbot/csrf-token/')
            .then(response => response.json())
            .then(data => {
                setCsrfToken(data.csrfToken)
            })
    }, [])

    // Every time a new message is added, we scroll the chat section to the bottom
    useEffect(() => {
        if (chatSectionRef.current)
            chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight
    }, [messages])

    /**
     * This function is called when the form is submitted
     * It sends a POST request to the backend with the user message feed
     * @param messages
     * @param csrfToken
     */
    const handleSubmitMessage = (messages: Message[], csrfToken: string) =>
        async (data: FieldValues) => {
            // Right after form submission, we reset the message field
            setValue('message', '')

            // We update the messages list with the new one
            const updatedMessages: Message[] = [
                ...messages,
                {"role": "user", "content": data.message}
            ]

            // We update our state with the user message, so it gets displayed on the chat interface
            setMessages([...updatedMessages])

            try {
                // We send a POST request to the backend with the user message feed
                const response = await fetch('/api/chatbot/query/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({
                        model: data.model,
                        messages: updatedMessages
                    })
                })

                // We handle incorrect responses when submitting the form
                if (!response.ok) {
                    throw new Error('Form submission failed')
                }

                // We need to call the .json() method to get the response body
                const jsonResponse = await response.json()

                // We update our state with the response message received from the chatbot
                setMessages([
                    ...updatedMessages,
                    {"role": "assistant", "content": jsonResponse.message}
                ])
            } catch (e) {
                // Any error can be handled here and error feedback can be displayed to the user
            }
        }

    return (
        <form className={cx('fr-container fr-p-0', classes.container)}
              onSubmit={handleSubmit(handleSubmitMessage(messages, csrfToken))}>

            {/* Sidebar */}
            <aside className={classes.sidebar}>
                <h4>Chat App</h4>

                {/* New Chat button */}
                <Button
                    iconId="fr-icon-refresh-line"
                    className='fr-mb-3w'
                    iconPosition="right"
                    priority="secondary"
                    onClick={(e) => {
                        e.preventDefault()
                        setMessages([])
                    }}
                >
                    Nouveau Chat
                </Button>

                {/* Model selection */}
                <Select
                    label="Modèle"
                    nativeSelectProps={{
                        defaultValue: '',
                        ...register('model')
                    }}
                    state={errors?.model && 'error'}
                    stateRelatedMessage={errors?.model?.message}
                >
                    <option value="" disabled>Modèle</option>
                    {models.map(model => <option key={model} value={model}>{model}</option>)}
                </Select>
            </aside>

            {/* Chat message section */}
            <section className={classes.chatContainer} ref={chatSectionRef}>

                {/* Messages */}
                <div>
                    {
                        messages.map(
                            (message, index) =>
                                <div key={index} className='fr-mb-4w'>

                                    {/* Author avatar + name */}
                                    <div className={classes.messageAuthor}>

                                        {/* Author avatar */}
                                        <div className={
                                            cx(
                                                classes.messageAuthorAvatar,
                                                message.role === 'assistant' ?
                                                    classes.assistantColor :
                                                    classes.userColor
                                            )
                                        }>
                                            <div>
                                                <div>{message.role === 'assistant' ? 'C' : 'M'}</div>
                                            </div>
                                        </div>

                                        {/* Author name */}
                                        <div className={classes.messageAuthorName}>
                                            {message.role === 'assistant' ? 'Chatbot' : 'Moi'}
                                        </div>
                                    </div>

                                    {/* Actual message content */}
                                    <div className='fr-ml-11v'>{message.content}</div>
                                </div>
                        )
                    }
                </div>

                {/* Message textarea + Send button */}
                <div>
                    <div className={classes.chatTextareaInnerContainer}>
                        {/* Message textarea */}
                        <Controller
                            control={control}
                            name="message"
                            render={({field: {onChange: builtInOnChange, onBlur, value, ref}}) => (
                                <Input
                                    label={null}
                                    textArea
                                    className={classes.chatTextarea}
                                    state={errors?.message && 'error'}
                                    stateRelatedMessage={errors?.message?.message}
                                    nativeTextAreaProps={{
                                        placeholder: 'Demandez moi quelque chose...',
                                        rows: 1,
                                        onBlur,
                                        value,
                                        ref: (e: HTMLTextAreaElement) => {
                                            ref(e)
                                            // We can share the ref provided by react-hook-form and initialize our own ref
                                            messageTextareaRef.current = e
                                        },
                                        onChange: e => {
                                            builtInOnChange(e)
                                            if (messageTextareaRef.current) {
                                                messageTextareaRef.current.style.height = 'auto'
                                                messageTextareaRef.current.style.height = `${e.target.scrollHeight}px`
                                            }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Send button */}
                        <div className={classes.chatTextAreaButtonContainer}>

                            {/* Loading spinner */}
                            <div className={classes.messageSendLoadingContainer}>
                                {
                                    isSubmitting &&
									<CircularProgress className={classes.messageSendLoading}
													  size={36}
													  thickness={3}
													  sx={{
                                                          color: fr.colors.decisions.background.default.grey.default
                                                      }}/>
                                }
                            </div>

                            {/* Send icon button */}
                            <Button
                                iconId="fr-icon-send-plane-fill"
                                className={classes.chatTextareaIcon}
                                title="Envoi de message"
                                type="submit"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </form>
    )
}

const spacingUnit = fr.spacing("5w")
const borderRadius = 16

const useStyles = tss
    .create(() => ({
        container: {
            marginTop: spacingUnit,
            marginBottom: spacingUnit,
            height: `calc(100% - 2 * ${spacingUnit})`,
            display: 'flex',
            border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
            borderRadius,
        },
        sidebar: {
            backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
            width: 270,
            padding: fr.spacing("3w"),
            borderRight: `1px solid ${fr.colors.decisions.border.disabled.grey.default}`,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        chatContainer: {
            overflow: 'scroll',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingLeft: fr.spacing("15w"),
            paddingRight: fr.spacing("15w"),
            paddingTop: fr.spacing("5w"),
            paddingBottom: fr.spacing("1w"),
        },
        messageAuthor: {
            display: 'flex',
        },
        messageAuthorAvatar: {
            display: 'flex',
            width: 32,
            height: 32,
            color: fr.colors.decisions.background.default.grey.default,
            borderRadius: '50%',
            marginRight: fr.spacing("3v"),
            div: {
                fontSize: '0.875rem',
                fontWeight: 'bold',
                margin: 'auto',
            }
        },
        assistantColor: {
            backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
        },
        userColor: {
            backgroundColor: fr.colors.decisions.background.active.redMarianne.active,
        },
        messageAuthorName: {
            fontSize: '1rem',
            fontWeight: 'bold',
        },
        chatTextareaInnerContainer: {
            position: 'relative',
            minHeight: 85,  // We set a min height, so the error message doesn't move the textarea up
        },
        chatTextarea: {
            flex: 1,
            textarea: {
                minHeight: 48,
                overflowY: 'auto',
                resize: 'none',
                paddingRight: fr.spacing("8w"),
                paddingTop: fr.spacing("3v"),
            }
        },
        chatTextAreaButtonContainer: {
            position: 'absolute',
            right: 16,
            bottom: 42,
        },
        chatTextareaIcon: {
            borderRadius: '50%',
            display: 'flex',
            '::before': {
                margin: 'auto',
                transform: 'translate(-1px, 2px)'
            },
            ':disabled': {
                backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
            }
        },
        messageSendLoadingContainer: {
            position: 'relative',
            transform: 'translate(2px, 2px)',
        },
        messageSendLoading: {
            position: 'absolute',
        }
    }))