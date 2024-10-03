"use client"
import Button from "../utils/Button"
import Container from "../utils/Container/Container"
import Text from "../utils/Text"
import styles from './CookieBanner.module.scss'
import Link from "../utils/Link/Link"
import { useCookieConsent } from "./CookieConsentContext"


const CookieBanner = () => {
    const [hasConsent, giveConsent] = useCookieConsent()    

    return (
        <>
        { !hasConsent && (
        <Container padding className={styles.banner}>
            <Container justify="flex-start" style={{flexGrow: 1}}>
                <Text size={0.9} weight={600}>This website uses cookies to enhance the user experience. For more info check out our <Link inline link="/termsandconditions">terms and conditions</Link> and <Link inline link="/privacypolicy">privacy policy</Link></Text>
            </Container>
            <Container style={{flexShrink: 0}}>
                <Button inverted onClick={giveConsent}>
                    I agree
                </Button>
            </Container>
        </Container>
        )}
        </>
    )
}

export default CookieBanner