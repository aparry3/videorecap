import React, { FC } from 'react';
import styles from './Hero.module.scss';
import Container from '../utils/Container/Container';
import Column from '../utils/Container/Column';
import Text from '@/components/utils/Text'
import Image from 'next/image';
import {THEMES} from '@/lib/styles'
import { Link } from '../utils/Link';


interface HeroProps {
    left?: boolean
    image: string
    alt: string
    title: string
    caption: string
    cta: string
}

const imageBaseUrl = process.env.ASSET_BASE_URL || 'http://localhost:3000/'

const containerStyles = {
    default: {
        container: {
            background: THEMES.default.secondary,
            color: THEMES.default.secondary_text
        },
        button: {
            background: THEMES.default.secondary_button,
            color: THEMES.default.secondary_button_text,
        }
    }
}


const Hero: FC<HeroProps> = ({left, alt, image, title, caption, cta}) => {
    const imageUrl = `${imageBaseUrl}/${image}`
    const style = containerStyles.default
    return (
        <Container className={styles.hero}>
            <Container className={styles.detailImage}>
                <Image style={{objectFit: "cover", objectPosition: '30%'}} src={imageUrl} alt={alt} fill/>
            </Container>
            <Container className={styles.heroText} style={style.container} padding>
                <Column className={styles.detailText}>
                    <Container padding><Text className={styles.title}>{title}</Text></Container>
                    <Container padding className={styles.caption}><Text weight={400}>{caption}</Text></Container>
                    <Container padding >
                        <Link link="/build">
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

export default Hero;
