import Container from "@/components/utils/Container/Container";
import { FC } from "react";
import styles from './Checkbox.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

const Checkbox: FC<{ value: boolean; onChange: (value: boolean) => void }> = ({ value, onChange }) => {
    return <Container padding={[0.5, 0.5, 0.5, 0]} className={styles.checkboxContainer} onClick={() => onChange(!value)}><FontAwesomeIcon className={styles.checkbox} icon={value ? faCheckSquare : faSquare} /></Container>
};

export default Checkbox