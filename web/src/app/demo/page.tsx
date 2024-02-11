"use client"

import { tss } from "tss-react/mui"
import { fr } from "@codegouvfr/react-dsfr"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import ViewDisplayContext from "@/context/ViewDisplayContext"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { Select } from "@codegouvfr/react-dsfr/Select"
import { Button } from "@codegouvfr/react-dsfr/Button"

const models = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-1106"
]

// We create a union type restricted to the available models except for 'undefined'
type Model = typeof models[number] | undefined

export default function Demo() {
    // We'll leverage our context to create a full height layout for our chat interface
    const {setIsFullHeight} = useContext(ViewDisplayContext)

    // We'll need a hold of our message textarea to adjust its height when user types into it
    const messageTextareaRef = useRef<HTMLTextAreaElement>(null)

    // We retrieve our styles
    const {classes, cx} = useStyles()

    const [model, setModel] = useState<Model>()
    const [message, setMessage] = useState<string>("")

    // When the page loads, we set it to a full height layout
    useEffect(() => {
        setIsFullHeight(true)

        // When the component unmounts, we reset the layout to its original size
        return () => setIsFullHeight(false)
    }, [])

    /**
     * Selects a model
     * @param event
     */
    const handleChangeModel = (event: ChangeEvent<HTMLSelectElement>) => {
        setModel(event.target.value)
    }

    /**
     * Adjusts the height of the message textarea on user input
     * @param event
     */
    const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (messageTextareaRef.current) {
            messageTextareaRef.current.style.height = 'auto'
            messageTextareaRef.current.style.height = `${event.target.scrollHeight}px`
        }
        setMessage(event.target.value)
    }

    const handleSubmitMessage = async () => {
        // Fixme: beware of the cahcing behavior of Next.js
        const res = await fetch('/api/chatbot/hello/')
        const response = await res.json()
        console.log(response)
    }

    return (
        <div className={cx('fr-container', classes.container)}>
            {/* Sidebar */}
            <aside className={classes.sidebar}>
                <h4>Chat App</h4>

                {/* New Chat button */}
                <Button
                    iconId="fr-icon-refresh-line"
                    className='fr-mb-3w'
                    iconPosition="right"
                    priority="secondary"
                    onClick={function noRefCheck() {
                    }}
                >
                    Nouveau Chat
                </Button>

                {/* Model selection */}
                <Select
                    label="Modèle"
                    nativeSelectProps={{
                        value: model,
                        onChange: handleChangeModel,
                    }}
                >
                    <option value="" disabled>Modèle</option>
                    {models.map(model => <option key={model} value={model}>{model}</option>)}
                </Select>
            </aside>

            {/* Chat message section */}
            <section className={classes.chatContainer}>

                {/* Message textarea + Send button */}
                <div className={classes.chatTextareaContainer}>
                    <div className={classes.chatTextareaInnerContainer}>
                        {/* Message textarea */}
                        <Input
                            label={null}
                            textArea
                            className={classes.chatTextarea}
                            nativeTextAreaProps={{
                                ref: messageTextareaRef,
                                placeholder: 'Demandez moi quelque chose...',
                                rows: 1,
                                value: message,
                                onChange: handleChangeMessage
                            }}
                        />

                        {/* Send button */}
                        <Button
                            iconId="fr-icon-send-plane-fill"
                            className={cx(classes.chatTextareaIcon)}
                            onClick={handleSubmitMessage}
                            title="Envoi de message"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

const spacingUnit = fr.spacing("3w")

const useStyles = tss
    .create(() => ({
        container: {
            padding: 0,
            marginTop: spacingUnit,
            marginBottom: spacingUnit,
            height: `calc(100% - 2 * ${spacingUnit})`,
            display: 'flex',
            border: `1px solid ${fr.colors.decisions.border.disabled.grey.default}`,
            borderRadius: 16,
        },
        sidebar: {
            backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
            width: 270,
            padding: fr.spacing("3w"),
            borderRight: `1px solid ${fr.colors.decisions.border.disabled.grey.default}`,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
        },
        chatContainer: {
            flex: 1,
            position: 'relative',
        },
        chatTextareaContainer: {
            position: 'absolute',
            bottom: 16,
            left: 24,
            right: 24,
        },
        chatTextareaInnerContainer: {
            position: 'relative',
        },
        chatTextarea: {
            flex: 1,
            textarea: {
                minHeight: 48,
                overflowY: 'auto',
                resize: 'none',
                paddingRight: fr.spacing("5w"),
                paddingTop: fr.spacing("3v"),
            }
        },
        chatTextareaIcon: {
            position: 'absolute',
            right: 16,
            bottom: 4,
            borderRadius: '50%',
            display: 'flex',
            '::before': {
                margin: 'auto',
                transform: 'translate(-1px, 2px)'
            }
        }
    }))