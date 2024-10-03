"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../utils/Container/Column";
import Container from "../utils/Container/Container";
import Text from "../utils/Text";
import styles from './Document.module.scss'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TermsAndConditions = () => {
    const router = useRouter()
    return (
        <Column className={styles.documentContainer}>
            <Container justify='flex-start' padding style={{width: '100%', boxSizing: 'border-box'}}>
                <Container className={styles.back} onClick={() => router.back()}>
                    <FontAwesomeIcon icon={faChevronLeft} /><Container padding={[0, 0.3]}>Back</Container>
                </Container>
            </Container>
            <Column padding justify="flex-start" className={styles.document}>
                <Container className={styles.section} justify="flex-start">
                    <Text size={3.5} weight={600}>Terms and Conditions of Better Letter Card Co.</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.8} weight={400}>Last Updated: [07-17-2024]</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Introduction</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        Welcome to Better Letter Card Co. ("we", "us", "our"). We offer a greeting card creation service that allows users ("you", "your") to create personalized cards by uploading a photo for the front and a video linked via a QR code on the back. You can also add an optional message and provide recipient details for card delivery. Our service is accessible through <Link href="https://betterlettercards.com">https://betterlettercards.com</Link>.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>User Information</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        As of now, we only require your email for using our services. In the future, we may introduce account registration to enhance the user experience. Your continued use of our services after such changes will constitute your acceptance of the new terms.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Content and Use of Service</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        You may upload any content for your greeting cards, subject to legal restrictions. You are solely responsible for ensuring that your content complies with applicable laws and does not infringe upon the rights of others. We do not claim ownership of your content and disclaim any liability for the content you choose to upload. You may not distribute any digital content received, including the video linked to by the card, without the original author's consent.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Payment and Billing</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        Our service's pricing varies based on the options you select during the card creation process. All payments are processed via Stripe. Please note that all sales are final, and we do not offer refunds. You may request a one-time resend of an undelivered card per order. As a convenience, you can also download a PDF of your card for self-distribution.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Subscription Service</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        Users can create a subscribed account which enables certain additional functionality. The subscription service is billed at $9.99 per month. Subscribed users will have access to premium features and enhanced functionalities not available to free-tier users. The specific benefits of the subscription service will be detailed on our website. All subscription payments are processed via Stripe, and subscriptions are billed monthly. Users can cancel their subscription at any time, but no refunds will be provided for partial months.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Privacy</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        We collect and store your email and IP address to enhance user experience and for fraud prevention. You may also create an account with personal information such as name, phone number, birthday, and address. Additionally, you can create an address book where you may enter other people's names, addresses, phone numbers, emails, and birthdays. We are committed to protecting your privacy and handling your data responsibly.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Intellectual Property Rights</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        You retain all rights to the content you upload. We are granted a license to use your content solely for the purpose of creating and delivering your cards, unless explicitly stated otherwise.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>User Conduct</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        You are required to use our services lawfully. Any illegal use of our services will result in immediate termination of your access, and we will cooperate with law enforcement as necessary.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Delivery Policy</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        Greeting cards are delivered in one of three ways: (1) automatically via third-party services, (2) automatically by Better Letter Card Co. members, or (3) manually by you. Delivery methods depend on the option you choose.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Liability</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        You agree to indemnify and hold harmless Better Letter Card Co. from any claims arising out of your use of our services. We are not liable for any actions you take in relation to the service.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Changes to Terms</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        We reserve the right to modify these terms at any time. It is your responsibility to review these terms regularly. Continued use of our service after changes implies acceptance of the new terms.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>Contact Information</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    For any questions or concerns, please contact us at <a href="mailto:support@betterlettercards.com">support@betterlettercards.com</a>.
                    </Text>
                </Container>
            </Column>
        </Column>
    )
}

export default TermsAndConditions