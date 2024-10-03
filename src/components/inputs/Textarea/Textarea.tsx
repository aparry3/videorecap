import { FC, FormEvent, HTMLProps, useEffect } from "react"
import Container from "../../utils/Container/Container"
import styles from './Textarea.module.scss';

interface TextareaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'onChange' >{
    onChange?: (value?: string) => void
}

const Textarea: FC<TextareaProps> = ({value, onChange, ...props}) => {
    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement
        if (onChange) onChange(target?.value)
    }

    return (
        <Container padding={0.5} className={styles.textareaContainer}>
            <textarea value={value} onChange={handleChange} className={styles.textarea} {...props} />
        </Container>
    )
}

export default Textarea;