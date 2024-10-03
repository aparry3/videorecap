import { FC, ReactNode } from "react"
import styles from './Link.module.scss'
import Container from "../Container/Container"


const Email: FC<{email: string, children: ReactNode}> = ({email, children}) => {
    return (
        <Container>
            <a href={`mailto:${email}`} className={styles.email}>
                {children}
            </a>
        </Container>
    )
}
export default Email