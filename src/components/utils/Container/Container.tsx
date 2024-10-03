import { FC, HTMLProps, Ref } from "react";
import styles from './Container.module.scss';
import { wrap } from "module";

export interface ContainerProps extends HTMLProps<HTMLDivElement> {
    padding?: boolean | number | [number, number] | [number, number, number, number]
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
    containerRef?: Ref<HTMLDivElement>
    wrapContainer?: boolean | 'reverse'
}

const Container: FC<ContainerProps> = ({children, wrapContainer, containerRef, padding, style, className, justify, ...props}) => {
    const _style = style || {}

    if (padding) {
        if (padding instanceof Array) {
            if (padding.length === 2) {
                _style.padding = `${padding[0]}rem ${padding[1]}rem`;
            } else {
                _style.padding = `${padding[0]}rem ${padding[1]}rem ${padding[2]}rem ${padding[3]}rem`;
            }
        } else if (typeof padding === 'number') {
            _style.padding = `${padding}rem`
        } else {
            _style.padding = `1rem`;
        }
    }

    if (justify) {
        _style.justifyContent = justify
    }

    if (wrapContainer) {
        _style.flexWrap = wrapContainer === 'reverse' ? 'wrap-reverse': 'wrap';
    }

    return (
        <div {...props} ref={containerRef} style={_style} className={`${styles.container} ${className}`}>
            {children}
        </div>
    )
}

export default Container