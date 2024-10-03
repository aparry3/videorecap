import React, { FC } from 'react';
import styles from './ImageDetail.module.scss';
import Container from '../utils/Container/Container';
import Column from '../utils/Container/Column';
import Image from 'next/image';
import Text from '@/components/utils/Text'
import {THEMES} from '@/lib/styles'
import { Link } from '../utils/Link';


interface ImageDetailProps {
    left?: boolean
    image: string
    alt: string
    title: string
    caption: string
    cta: string
    position?: string
}

const imageBaseUrl = process.env.ASSET_BASE_URL || 'http://localhost:3000/'

const containerStyles = {
    primary: {
        container: {
            background: THEMES.default.primary,
            color: THEMES.default.primary_text
        },
        button: {
            background: THEMES.default.primary_button,
            color: THEMES.default.primary_button_text,
        }
    },
    accent: {
        container: {
            background: THEMES.default.primary_accent,
            color: THEMES.default.primary_accent_text
        },
        button: {
            background: THEMES.default.primary_accent_button,
            color: THEMES.default.primary_accent_button_text,
        }
    }

}


const ImageDetail: FC<ImageDetailProps> = ({left, alt, image, title, caption, cta, position}) => {
    const imageUrl = `${imageBaseUrl}/${image}`
    const style = left ? containerStyles.primary : containerStyles.accent
    return (
        <Container wrapContainer className={styles.imageDetail} style={{flexDirection: left ? 'row-reverse' : 'row'}}>
            <Container className={styles.detailImage}>
                <Image style={{objectFit: "cover", objectPosition: position}} src={imageUrl} alt={alt} fill/>
            </Container>
            <Container className={styles.detailTextContainer} style={style.container}>
                <Column className={styles.detailText}>
                    <Container padding><Text className={styles.title}>{title}</Text></Container>
                    <Container padding className={styles.caption}><Text weight={400}>{caption}</Text></Container>
                    <Container padding style={{width: '100%'}} justify={left ? 'flex-end' : 'flex-start'}>
                        <Link link="/build?type=postcard">
                            <Container padding className={styles.button} style={style.button}>
                                <Text weight={600}>{cta}</Text>
                            </Container>
                        </Link>
                    </Container>
                </Column>
            </Container>
        </Container>

        )
};

export default ImageDetail;
