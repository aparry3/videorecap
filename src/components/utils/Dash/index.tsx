import Container from "../Container/Container"
import styles from './Dash.module.scss'

const Dash = () => {
    return (
        <Container padding className={styles.dashContainer}>
            <Container className={styles.dash} />
        </Container>
    )
}

export default Dash