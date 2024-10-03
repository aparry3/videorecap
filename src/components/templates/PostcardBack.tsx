import { FC, useEffect, useRef } from "react";
import Container from "../utils/Container/Container";
import styles from './templates.module.scss'
import { LOGO_STRING } from "./logo";
import { AspectRatio } from "@/lib/@types/Card";


interface PostcardBackProps {
    onLoad: (htmlElement: HTMLElement) => void
    factor?: number
    size?: AspectRatio
    qrCode?: string
    message?: string
    sender?: string
}

export const FACTOR = 96


export const TEMPLATE_CONFIG: {[key in AspectRatio]: {aspect: [number, number], addressDimensions: [number, number], surrounding: number}} = {
    // "4x6": {
    //     aspect: [6.25, 4.25],
    //     addressDimensions: [3.4335, 2.5]
    // },
    "4x6": {
        aspect: [6, 4],
        addressDimensions: [0, 0],
        surrounding: 0.10
    },
    "425x6": {
        aspect: [6.25, 4.50],
        addressDimensions: [3.945, 2.5826],
        surrounding: 0.125

    },
    "5x7": {
        aspect: [7, 5],
        addressDimensions: [0, 0],
        surrounding: 0.10
    }
}
export const PostcardBack: FC<PostcardBackProps> = ({onLoad, factor = FACTOR, size = "425x6", qrCode = '/qrcode.jpg', message, sender}) => {
    const height = TEMPLATE_CONFIG[size].aspect[1]
    const width = TEMPLATE_CONFIG[size].aspect[0]
    const addressWidth = TEMPLATE_CONFIG[size].addressDimensions[0]
    const addressHeight = TEMPLATE_CONFIG[size].addressDimensions[1]
    const surrounding = TEMPLATE_CONFIG[size].surrounding

    const _height = factor * height;
    const _width = factor * width
    const backRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (backRef.current) {
            onLoad(backRef.current)
        }
    }, [backRef, onLoad, message, qrCode, sender])
    return (
        <Container className={styles.templateContainer}>
            <div ref={backRef} className={styles.template} style={{
                    position: 'relative',
                    fontFamily: 'Whisper',
                    boxSizing: 'border-box',
                    width: `${_width}px`,
                    height: `${_height}px`,
                    // background: '#FCF0D8',
                    background: 'white',
                    color: '#2D7B61',
                    justifyContent: 'center',
                    display: 'flex'
                 }}>
                <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,                        
                        padding: `${2*surrounding/height*100}%`,
                        fontFamily: 'Montagu Slab',
                        fontSize:  `${0.0286*height*factor}px`,
                        fontWeight: 600,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        color: '#2D7B61',
                        boxSizing: 'border-box'
                    }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <img src='/logos/letters.png' style={{
                            width: 'auto',
                            height: `${0.05*height*factor}px`
                            }}/>
                        </div>
                        <div style={{
                        padding: '5%',
                        flexShrink: 0
                        }}>
                            Better Letter Card Co.
                        </div>

                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize:  `${0.0236*height*factor}px`,
                        fontWeight: 400,
                    }}>
                        https://betterlettercards.com
                    </div>
                </div>
                <div style={{
                    // width: size === '4x6' ? '50%' : '100%',
                    flexGrow: 1,
                    height: '100%',
                    display: 'flex',
                    boxSizing: 'border-box',
                    paddingLeft:`${surrounding*factor}px`,

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection:'column',
                        alignItems: 'center',
                        width: `100%`,
                        height: `100%`
                    }}>
                        <img src={qrCode} style={{
                            maxWidth: '55%',
                            maxHeight: '45%'}} />
                    </div>
                </div>
                { (message || size === '425x6') && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        alignItems: 'center',
                        width: size === '4x6' ? '50%' : `${addressWidth/width * 100}%`,
                        minWidth: size === '4x6' ? '50%' : `${addressWidth/width * 100}%`,
                        height: '100%',
                        fontWeight: 600,
                        fontSize: `${0.04*height*factor}px`,
                        fontStyle: 'italic'
                    }}>
                    <div style={{
                        boxSizing: 'border-box',
                            padding: '0 10%',
                            display: "flex",
                            flexDirection: 'column',
                            flexGrow: 1,
                            height: size === '4x6' ? '100%' : `${100 - (addressWidth/width * 100)}%`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            wordWrap: 'normal'
                        }}>
                        <div style={{
                            textAlign: 'left'
                        }}>
                            <span>{message}</span>
                        </div>
                        {sender && (
                        <div style={{
                            textAlign: 'right',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                            padding: '0 20%',
                            boxSizing: 'border-box'
                        }}>
                            <span style={{padding: '6px'}}>- {sender}</span>
                        </div>)}
                    </div>
                    <div style={{
                        height: `${addressHeight/height * 100}%`,
                        width: `100%`,
                    }} />
                </div>

                )}
            </div>
        </Container>
    )
}

export default PostcardBack