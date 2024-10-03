import { FC } from 'react'

import styles from './Loading.module.scss'
import Container from './utils/Container/Container'
import Text from './utils/Text'


const Loading: FC<{text?: string, local?: boolean}> = ({text, local = false}) => {
    return (
        <div className={styles.loadingContainer} style={{position: local ? 'absolute' : 'fixed', flexDirection: local ? 'row' : 'column'}}>
            <div className={styles.loader} style={{height: local ? '2rem' : '5rem', width: local ? '2rem' : '5rem'}} />
            {text && (
            <Container padding>
                <Text weight={600}>{text}</Text>
            </Container>
            )}
        </div>
    )
}

export default Loading
