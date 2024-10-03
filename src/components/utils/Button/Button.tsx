import { ButtonHTMLAttributes, CSSProperties, DetailedHTMLProps, FC, MouseEvent, TouchEvent, useCallback, useEffect, useRef, useState } from "react"
import Container from "../../utils/Container/Container"
import styles from './Button.module.scss';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    inverted?: boolean
    disabled?: boolean
    padding?: boolean | number | [number, number] | [number, number, number, number]
    hover?: boolean
    border?: boolean

}

const Button: FC<ButtonProps> = ({children, padding, inverted, disabled, hover = true, onClick, border, ...props}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [hoverStyle, setHoverStyle] = useState<string>(styles.hover)
    const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
        // e.preventDefault()
 
        setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent<HTMLButtonElement>) => {
        // e.preventDefault()
        setIsDragging(true)
    }

    useEffect(() => {
        if (hover && !disabled) {
            setHoverStyle(inverted ? styles.invertedHover : styles.hover)
        } else {
            setHoverStyle(inverted ? styles.hover : styles.invertedHover)
        }
    }, [hover, inverted])

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (onClick && !isDragging) {
            onClick(e)
        }
    }
    return (
        <Container padding={padding || 0.5} className={styles.buttonContainer}>
            <button 
                ref={buttonRef}
                disabled={disabled} 
                className={`${styles.button} ${inverted ? styles.inverted : ''} ${hoverStyle} ${disabled ? styles.disabled : ''} ${border ? styles.border : ''}`} 
                onTouchStart={handleTouchStart} 
                onTouchMove={handleTouchMove} 
                onClick={handleClick} {...props}>
                {children}
            </button>
        </Container>
    )
}

export default Button;