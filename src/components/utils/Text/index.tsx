import { FC, HTMLProps } from "react";
import styles from './Text.module.scss';

export interface TextProps extends HTMLProps<HTMLHeadingElement> {
    weight?: number
    size?: number
    bold?: boolean
    font?: string
    as?: 'h1' | 'h2' | 'h3' | 'p'
}

const Text: FC<TextProps> = ({as, children, style, font, className, size, weight, bold, ...props}) => {
    const _style = style || {}
    if (size) {
        _style.fontSize = `${size}rem`
    }
    if (weight) {
        _style.fontWeight = weight
    }
    if (font) {
        _style.fontFamily = font
    }
    switch(as) {
        case 'h1': {
            return (
                <h1 {...props} style={_style} className={`${styles.text} ${bold ? styles.bold : ''} ${className}`}>
                    {children}
                </h1>
            )
        }
        case 'h2': {
            return (
                <h2 {...props} style={_style} className={`${styles.text} ${bold ? styles.bold : ''} ${className}`}>
                    {children}
                </h2>
            )
        }
        case 'h3': {
            return (
                <h3 {...props} style={_style} className={`${styles.text} ${bold ? styles.bold : ''} ${className}`}>
                    {children}
                </h3>
            )
        }
        case 'p': {
            return (
                <p {...props} style={_style} className={`${styles.text} ${bold ? styles.bold : ''} ${className}`}>
                    {children}
                </p>
            )
        }
        default: {
            return (
                <span {...props} style={_style} className={`${styles.text} ${bold ? styles.bold : ''} ${className}`}>
                    {children}
                </span>
            )        
        }
    }
}

export default Text