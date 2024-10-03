import { CSSProperties, FC, FormEvent, HTMLProps } from "react"
import Container from "../../utils/Container/Container"
import styles from './Input.module.scss';


interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
    onChange?: (value?: string) => void
    inverse?: boolean
    inputStyle?: CSSProperties
}

const Input: FC<InputProps> = ({value, onChange, inputStyle, inverse, style, className, ...props}) => {
    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement
        if (onChange) onChange(target?.value)
    }
    return (
        <Container padding={0.5} className={`${styles.inputContainer} ${className ?? ''}`} style={style}>
            <input autoComplete='new-password' className={`${styles.input} ${inverse ? styles.inverse : ''}`} value={value} onChange={handleChange} style={inputStyle} {...props} />
        </Container>
    )
}

export default Input;