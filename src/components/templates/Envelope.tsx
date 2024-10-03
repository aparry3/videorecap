import { FC, useCallback, useEffect, useRef } from "react";
import Container from "../utils/Container/Container";
import styles from './templates.module.scss'
import { AspectRatio } from "@/lib/@types/Card";
import Column from "../utils/Container/Column";
import Text from "../utils/Text";
import { NewRecipient, Recipient } from "@/lib/@types/Recipient";


interface EnvelopeProps {
    onLoad: (htmlElement: HTMLElement) => void
    factor?: number
    size?: AspectRatio
    recipient: NewRecipient
    returnRecipient: NewRecipient
}

export const FACTOR = 96


export const TEMPLATE_CONFIG: {[key in AspectRatio]: {aspect: [number, number], addressDimensions: [number, number], surrounding: number}} = {
    // "4x6": {
    //     aspect: [6.25, 4.25],
    //     addressDimensions: [3.4335, 2.5]
    // },
    "4x6": {
        aspect: [6, 4],
        addressDimensions: [0, 4],
        surrounding: 0.05
    },
    "425x6": {
        aspect: [6.25, 4.50],
        addressDimensions: [3.945, 2.5826],
        surrounding: 0.15

    },
    "5x7": {
        aspect: [7, 5],
        addressDimensions: [0, 0],
        surrounding: 0.05
    }
}
export const PostcardBack: FC<EnvelopeProps> = ({onLoad, factor = FACTOR, size = "425x6", recipient, returnRecipient}) => {
    const height = TEMPLATE_CONFIG[size].aspect[1]
    const width = TEMPLATE_CONFIG[size].aspect[0]

    const _height = factor * height;
    const _width = factor * width
    const envRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (envRef.current) {
            console.log(envRef)

            onLoad(envRef.current)
        }
    }, [envRef, onLoad])

    const handleLoad = useCallback((node: HTMLDivElement) => {
        onLoad(node)
    }, [])
    return (
        <Container className={styles.templateContainer}>
            <div ref={handleLoad} className={styles.template} style={{
                    position: 'relative',
                    fontFamily: 'Montserrat',
                    boxSizing: 'border-box',
                    width: `${_width}px`,
                    height: `${_height}px`,
                    background: 'white',
                    color: 'black',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: size === '4x6' ? 'row-reverse' : 'column',
                 }}>
                    <Container justify="flex-start" style={{width:'100%', position: 'absolute', top: 0}} padding={0.0286*height*factor/12}>
                        <Column key={returnRecipient.name} style={{width: '100%'}} >
                            <Container justify="flex-start" style={{width: '100%'}}>
                                <Text weight={600} size={0.0286*height*factor/12}>{returnRecipient.name}</Text>
                            </Container>
                            <Container justify="flex-start" style={{width: '100%'}}>
                                <Text weight={600} size={0.0286*height*factor/12}>{returnRecipient.addressLineOne}{returnRecipient.addressLineTwo ? `, ${returnRecipient.addressLineTwo}` : ''}</Text>
                            </Container>
                            <Container justify="flex-start" style={{width: '100%'}}>
                                <Text weight={600} size={0.0286*height*factor/12}>{returnRecipient.city}, {returnRecipient.state} {returnRecipient.zipcode}</Text>
                            </Container>
                        </Column>
                    </Container>
                    <Container padding={0.5}>
                        <Column key={recipient.name} padding style={{width: '100%'}} >
                            <Container style={{width: '100%'}}>
                                <Text weight={600} size={0.036*height*factor/12}>{recipient.name}</Text>
                            </Container>
                            <Container style={{width: '100%'}}>
                                <Text weight={600} size={0.036*height*factor/12}>{recipient.addressLineOne}{recipient.addressLineTwo ? `, ${recipient.addressLineTwo}` : ''}</Text>
                            </Container>
                            <Container style={{width: '100%'}}>
                                <Text weight={600} size={0.036*height*factor/12}>{recipient.city}, {recipient.state} {recipient.zipcode}</Text>
                            </Container>
                        </Column>
                    </Container>
            </div>
        </Container>
    )
}

export default PostcardBack