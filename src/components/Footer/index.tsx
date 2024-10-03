import { FC } from "react";
import Container from "../utils/Container/Container";
import { Email, Link } from "../utils/Link";
import Text from "../utils/Text";
import styles from './Footer.module.scss'
import { Theme } from "@/lib/styles";
const Footer: FC<{inverse?: boolean, theme?: Theme}> = ({inverse, theme}) => (

    <Container justify='flex-start' className={`${styles.footer} ${inverse ? styles.inverse : ''}`} style={{background: theme?.primary_accent, color: theme?.primary_accent_text}}>
    <Container padding>
        <Text weight={600} size={.8} font="Montagu Slab">better letter card co.</Text>
    </Container>
    <Container padding justify="flex-end" style={{flexGrow: 1}}>
        <Container padding={[0,0.5]}>
            <Link link="/termsandconditions">
                <Text size={0.8} weight={500}>
                    Terms and Conditions
                </Text>
            </Link>
        </Container>
        <Container padding={[0,0.5]}>
            <Link link="/privacypolicy">
                <Text size={0.8} weight={500}>
                        Privacy Policy
                </Text>
            </Link>
        </Container>
        <Container padding={[0,0.5]}>
            <Email email='support@betterlettercards.com'>
                <Text size={0.8} weight={500}>
                    Contact
                </Text>
            </Email>
        </Container>
    </Container>
</Container>

)

export default Footer