import { FC, useState } from "react"
import { NewRecipient } from "@/lib/@types/Recipient"
import RecipientForm from "@/components/RecipientForm"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import Text from '@/components/utils/Text'
import Modal from "@/components/utils/Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import Button from "@/components/utils/Button"
import styles from './ReturnRecipient.module.scss'

interface ReturnRecipientProps {
    onSubmit: (recipient: NewRecipient) => void
    returnRecipient?: NewRecipient
    shipping?: boolean
}

const ReturnRecipient: FC<ReturnRecipientProps> = ({onSubmit, returnRecipient, shipping}) => {
    const [editing, setEditing] = useState<boolean>(false)
    const handleSubmit = async (recipient: NewRecipient) => {
        // const savedRecipient = (await saveRecipients([recipient]))[0]
        onSubmit(recipient)
        setEditing(false)
    }

    return (
        <Column style={{width: '100%', height: '100%', overflow: 'auto'}}>
            {returnRecipient ? (
            <Container style={{width:'100%'}} padding={0.5}>
                <Column key={returnRecipient.name} padding style={{width: '100%'}} className={`${styles.addressChip}`} onClick={() => setEditing(true)}>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text weight={600}>{returnRecipient.name}</Text>
                    </Container>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.addressLineOne}</Text>
                    </Container>
                    {returnRecipient.addressLineTwo && (
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.addressLineTwo}</Text>
                    </Container>
                    )}
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.city}, {returnRecipient.state}, {returnRecipient.zipcode}</Text>
                    </Container>
                </Column>
            </Container>    
            
            ) : (
            <Container className={styles.input}>
                <Button padding inverted onClick={() => setEditing(true)}>
                    Enter {shipping ? 'Shipping Address' : 'Return Recipient'}
                </Button>
            </Container>
            )}
            <Modal open={editing} onClose={() => setEditing(false)}>
                <Container justify="flex-start" style={{width:'100%'}}>
                    <Container padding style={{cursor: 'pointer'}} onClick={() => setEditing(false)}>
                        <FontAwesomeIcon icon={faChevronLeft} /><Container padding={[0, 0.3]}>back</Container>
                    </Container>
                </Container>
                <Column justify='center' style={{flexGrow: 1, width: '100%'}}>
                    <Container padding={0.5} style={{width: '100%'}}>
                        <Text weight={600} >{`${returnRecipient ? 'Edit' : 'Enter'} ${shipping ? 'Shipping Address' : 'Return Recipient'}`}</Text>
                    </Container>
                    <RecipientForm recipientText="Your Name" recipient={returnRecipient} onSubmit={handleSubmit} />
                </Column>
            </Modal>
        </Column>
    )
}

export default ReturnRecipient