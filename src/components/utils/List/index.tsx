import { Children, FC, ReactNode } from "react"
import Container from "../Container/Container"
import Column from "../Container/Column"
import Text from "../Text"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faDotCircle } from "@fortawesome/free-solid-svg-icons"
import styles from './List.module.scss'

const List: FC<{children: ReactNode, ordered?: boolean, check?: boolean}> = ({children, ordered = true, check = false}) => {
    return (
        <Column padding={[1,1,1,2]} style={{width: '100%'}}>
        {Children.map(children, (child, index) => (
            <Container justify='flex-start' padding={0.25} style={{width: '100%', textAlign: 'left'}}>
                <Container justify='flex-start' className={styles.number}>
                    {ordered ? (
                        <Text>{index + 1}</Text>
                    ) : (
                        <FontAwesomeIcon className={styles.dot} icon={check ? faCheck : faDotCircle} />
                    )}
                </Container>
                <Container justify="flex-start">
                    {child}
                </Container>
            </Container>
        ))}
        </Column>
    )
}

export default List