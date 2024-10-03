import React, { FC, ReactNode, useState } from 'react';
import Column from '@/components/utils/Container/Column';
import Text from '@/components/utils/Text';
import styles from './FormField.module.scss';
import Container, { ContainerProps } from '../Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';

interface FormFieldProps extends ContainerProps {
    complete: boolean
    formFieldTitle: ReactNode
    formFieldSubtitle?: ReactNode
}

const FormField: FC<FormFieldProps> = ({children, complete, formFieldTitle, formFieldSubtitle}) => {
    const [open, setOpen] = useState<boolean>(true)
    return (
        <Container className={styles.formFieldContainer}>
            <Column className={styles.formField}>
                <Container padding onClick={() => setOpen(!open)} className={styles.stepTitle} justify='flex-start'>
                    <Container padding={0.5} style={{cursor: 'pointer'}}>
                        <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} />
                    </Container>
                    <Container padding={0.5} className={styles.stepTitleText}>
                        <Text className={styles.stepTitle} weight={200}>
                            {formFieldTitle}
                        </Text>
                    </Container>
                    <Container padding={0.5} className={styles.checkbox}>
                        {complete ? (
                            <FontAwesomeIcon className={styles.check} icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon  icon={faSquare} />
                        )}
                    </Container>
                </Container>
                {open && children}
            </Column>
        </Container>
);
};

export default FormField;