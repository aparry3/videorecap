import Textarea from "@/components/inputs/Textarea"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import { FC } from "react"
import styles from './Message.module.scss'
import Text from '@/components/utils/Text'

interface MessageProps {
    onMessageChange: (message?: string) => void
    message?: string
}


const Message: FC<MessageProps> = ({onMessageChange, message}) => {

    return (
        <Column style={{height: '100%', width: '100%'}}>
            <Container padding style={{width: '100%', flexGrow: 1}}>
                <Textarea value={message} onChange={(value) => onMessageChange(value)} placeholder="Your message (optional)..."/>
            </Container>
            {/* <Container padding style={{width: '100%'}}>
                <Input value={sender} onChange={(value) => setSender(value)} placeholder="who's the card from? (optional)"/>
            </Container> */}
        </Column>
    )
}

export default Message