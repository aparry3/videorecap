"use client";
import { FC, FormEvent, useState } from "react"
import Input from "../inputs/Input"
import Button from "../utils/Button"
import Column from "../utils/Container/Column"
import Form from "../utils/Container/Form"
import Loading from "../loading";
import { __DEPRECATED_createCard } from "@/app/helpers/cards";
import { useRouter } from "next/navigation";
import { MailMethod } from "@/lib/@types/Card";

const EmailForm : FC<{promo?: string, onSubmit?: (val?: string) => void, color?: string, textColor?: string}> = ({promo, onSubmit, color, textColor}) => {
    const router = useRouter()
    const [email, setEmail] = useState<string>()
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (onSubmit) {onSubmit(email)}
        else {
            if (!!email) {
                setLoading(true)
                try {
                    const card = await __DEPRECATED_createCard(email, MailMethod.ENVELOPE, promo)
                    if (card) {
                        router.push(`/create/${card.id}`);
                    } else {
                        setError("Error creating card")
                    }
                } catch (e: any) {
                    setError(`Error: ${e.message}`)
                    setLoading(false)
                }
            }
        }

    }

    const _style = color ? {background: color, color: textColor} : {}
    return (
        <>
        {loading && <Loading />}
        <Column id='body' style={{width: '100%'}} >
            <Form onSubmit={handleSubmit} style={{width: '100%'}}>
                <Input value={email} onChange={(value) => setEmail(value)} placeholder='enter your email to begin...' />
            </Form>
            <Button style={_style} disabled={!email} onClick={handleSubmit}>
                Make a Card
            </Button>
        </Column>

        </>

    )
}

export default EmailForm