import { FC, HTMLAttributes, ReactNode } from "react"
import styles from './Link.module.scss'
import Container from "../Container/Container"


const Link: FC<{link: string, className?: string,  newWindow?: boolean, inline?: boolean, children: ReactNode}> = ({className, link, newWindow = false, inline, children}) => {
    return inline ? (
        <a href={`${link}`} className={styles.link}>
            {children}
        </a>
    ) : (
        <Container className={className || ''}>
            <a href={`${link}`} className={styles.email} target={newWindow ? '_blank' : '_self'}>
                {children}
            </a>
        </Container>
    )
}
export default Link