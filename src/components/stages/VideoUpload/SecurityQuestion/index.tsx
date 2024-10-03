import Input from '@/components/inputs/Input';
import Textarea from '@/components/inputs/Textarea';
import Column from '@/components/utils/Container/Column';
import Container from '@/components/utils/Container/Container';
import React, { useEffect, useState } from 'react';
import Text from '@/components/utils/Text'
import Modal from '@/components/utils/Modal';
import styles from './SecurityQuestion.module.scss'
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/utils/Button';
import { on } from 'events';

interface SecurityQuestionFormProps {
    // Add your prop types here
    question?: string
    answer?: string
    onQuestionChange: (question?: string) => void
    onAnswerChange: (answer?: string) => void
}

const SecurityQuestionForm: React.FC<SecurityQuestionFormProps> = ({question, answer, onAnswerChange, onQuestionChange}) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [questionText, setQuestionText] = useState<string>(question ?? '')
    const [answerText, setAnswerText] = useState<string>(answer ?? '')

    useEffect(() => {
        setQuestionText(question ?? '')
        setAnswerText(answer ?? '')
    }, [question, answer])

    const handleDelete = () => {
        onAnswerChange(undefined)
        onQuestionChange(undefined)
        setEditing(false)
    }

    const handleConfirm = () => {
        onAnswerChange(answerText)
        onQuestionChange(questionText)
        setEditing(false)
    }

    return (
        <Container style={{width: '100%'}}>
            {(question && answer) ? (
            <Container style={{width:'100%'}} padding={0.5}>
                <Column padding style={{width: '100%'}} className={`${styles.addressChip}`} onClick={() => setEditing(true)}>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text weight={600}>{question}</Text>
                    </Container>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{answer}</Text>
                    </Container>
                </Column>
            </Container>    
            ) : (
                <Container className={styles.input}>
                    <Button padding inverted onClick={() => setEditing(true)}>
                        Enter Security Question
                    </Button>
                </Container>
            )}
            <Modal open={editing} onClose={() => setEditing(false)}>
                <Column style={{height: '100%', width: '100%'}}>
                    <Column style={{width: '100%', minHeight: '40%'}}>
                        <Container justify="flex-start" style={{width: '100%'}}>
                            <Text>Security Question</Text>
                        </Container>
                        <Container padding style={{width: '100%', flexGrow: 1}}>
                            <Textarea value={questionText} onChange={(value) => setQuestionText(value ?? '')} placeholder="Ex. Where did we meet?"/>
                        </Container>
                    </Column>
                    {/* <Container padding style={{width: '100%'}}>
                        <Input value={sender} onChange={(value) => setSender(value)} placeholder="who's the card from? (optional)"/>
                    </Container> */}
                    <Column style={{width: '100%'}}>
                        <Container justify="flex-start"  style={{width: '100%'}}>
                            <Text>Security Answer</Text>
                        </Container>
                        <Container padding style={{width: '100%', flexGrow: 1}}>
                            <Input value={answerText} onChange={(value) => setAnswerText(value ?? '')} placeholder="Freshman orientation"/>
                        </Container>
                    </Column>
                    <Container padding={0.25} justify='flex-end' className={styles.input}>
                        <Container className={styles.button}>
                            <Button onClick={(question && answer) ? handleDelete : () => setEditing(false)}>
                            {(question && answer) ? 'delete' : 'cancel'}
                            </Button>
                        </Container>
                        <Container className={styles.button}>
                            <Button disabled={!questionText || !answerText} onClick={handleConfirm}>
                                confirm
                            </Button>
                        </Container>
                    </Container>

                </Column>
            </Modal>
        </Container>
    );
};

export default SecurityQuestionForm;
