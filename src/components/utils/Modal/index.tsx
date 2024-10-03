import { FC, ReactNode } from "react";
import Column from "../Container/Column";
import Container from "../Container/Container";
import styles from './Modal.module.scss'


const Modal: FC<{inverted?: boolean, children: ReactNode, onClose: () => void, open: boolean, large?: boolean}> = ({large = true, inverted, open, children, onClose}) => open ? (
    <Container padding className={styles.modalContainer}>
        <Container className={styles.modalBackground} onClick={() => onClose()}/>
        <Column padding className={`${styles.modal} ${inverted ? styles.inverted : ''}`} style={!large ? {minHeight: 'unset', width: 'unset', height: 'unset'} :{}} onClick={(e) => e.stopPropagation()}>
            {children}
        </Column>
    </Container> ) : <></>


export default Modal