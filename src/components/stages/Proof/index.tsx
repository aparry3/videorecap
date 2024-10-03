import Button from "@/components/utils/Button"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import { StageProps } from "../BaseStage"
import { FC } from "react"
import styles from './Proof.module.scss'

interface ProofProps extends StageProps {
    front?: string
    back?: string
}


const Proof: FC<ProofProps> = ({onNext, front, back}) => {
    
    return (
        <Column style={{height: '100%', width: '100%'}}>
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <img src={front} style={{boxShadow: '0 0 10px -4px black', height: 'auto', width: '100%'}} />
            </Column>
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <img src={back} style={{boxShadow: '0 0 10px -4px black', height: 'auto', width: '100%'}} />
            </Column>

            <Container padding justify='flex-end' style={{width: '100%'}}>
                <Container className={styles.button}>
                    <Button onClick={() => {}} >
                        submit
                    </Button>
                </Container>
            </Container>
        </Column>
    )
}

export default Proof