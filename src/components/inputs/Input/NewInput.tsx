import { CSSProperties, FC, FormEvent, HTMLProps, useEffect } from "react"
import Container from "../../utils/Container/Container"
import styles from './NewInput.module.scss';
import { generateUrlSafeId } from "@/app/helpers/utils";
import Dash from "@/components/utils/Dash";
import Column from "@/components/utils/Container/Column";


interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
    onChange?: (value?: string) => void
    inverse?: boolean
    inputStyle?: CSSProperties
}

const Input: FC<InputProps> = ({value, label, onChange, inputStyle, inverse, style, className, disabled, ...props}) => {
    const id = `input-${generateUrlSafeId()}`

    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement
        if (onChange) onChange(target?.value)
    }
    return (
    <Column className={styles.promo}>
        <input className={`${styles.promoInput} ${disabled ? styles.disabled : ''}`} id={id} onChange={(e) => handleChange(e)} value={value} placeholder=" " disabled={disabled}/>
        <label className={styles.promoLabel} htmlFor={id}>{label}</label>
        <Container className={styles.dash}/>
    </Column>
    )
}

export default Input;