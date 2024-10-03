"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../utils/Container/Column";
import Container from "../utils/Container/Container";
import List from "../utils/List";
import Text from "../utils/Text";
import styles from './Document.module.scss'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";


const PrivacyPolicy = () => {
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
                    <Text size={3.5} weight={600}>Better Letter Card Co. Privacy Policy</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.8} weight={400}>Last Updated: [07-17-2024]</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        Welcome to Better Letter Card Co.! We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard the data you provide when using our on-demand greeting card service.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}> 1. Information We Collect</Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        We collect the following types of personal information when you use our service:
                    </Text>
                </Container>
                <List>
                    <Text size={0.9}>Personal Information: Your name, phone number, mailing address, email address, and birthday, as well as potential recipients' name, mailing address, email address, phone number, and birthday.</Text>
                    <Text size={0.9}>Content Data: Images uploaded for the front of the card, videos associated with the physical card, optional messages you provide.</Text>
                    <Text size={0.9}>Technical Information: Your IP address, browser type, and device information for improving user experience and preventing fraudulent activity.</Text>
                </List>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                        2. How We Use Information
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        We use the collected information for the following purposes:
                    </Text>
                </Container>
                <List>
                    <Text size={0.9}>To create and deliver custom greeting cards to the specified recipient.</Text>
                    <Text size={0.9}>To communicate with you regarding your orders, inquiries, and account-related matters.</Text>
                    <Text size={0.9}>To improve our services and user experience.</Text>
                    <Text size={0.9}>To prevent and detect fraud and malicious activity.</Text>
                    <Text size={0.9}>To comply with legal obligations and protect our rights.</Text>
                </List>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    3. Data Sharing
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                        We may share your personal information with the following parties:
                    </Text>
                </Container>
                <List>
                    <Text size={0.9}>Stripe: Payment processing is outsourced to Stripe. Your payment information is securely handled by Stripe, and we do not store your payment card details.</Text>
                    <Text size={0.9}>Service Providers: We may engage third-party service providers to assist with various aspects of our business, such as hosting, data analysis, and customer support. These service providers may have access to your personal information but are contractually obligated to protect it.</Text>
                </List>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    4. Future Data Collection
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    In the future, we may collect information from other sources to enhance our services, and any additional data collection will be governed by updated privacy policies.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    5. Data Security
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    We implement robust security measures to protect your personal information from unauthorized access and data breaches including encypted data stores. However, please be aware that no data transmission over the internet is completely secure, and we cannot guarantee the security of your data.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    6. Data Retention
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable laws.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    7. Cookies and Tracking Technologies
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    While we do not currently use cookies, we may use cookies and similar tracking technologies in the future for analytics, marketing, and user experience. By continuing to use our website, you consent to the use of cookies as described in this Privacy Policy.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    8. Opting Out of Cookies
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    You can typically manage or disable cookies through your browser settings. However, disabling cookies may affect certain features and functionality of our website.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    9. Contact Us and Updates
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    If you have questions, concerns, or requests regarding your personal information or this Privacy Policy, please contact us at <a href="mailto:support@betterlettercard.com">support@betterlettercard.com</a>. We may update this Privacy Policy from time to time, so please review it periodically to stay informed about any changes. We do not currently automatically notify users of policy updates.
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={1.1} weight={600}>
                    10. Not Intended for Children
                    </Text>
                </Container>
                <Container className={styles.section} justify="flex-start">
                    <Text size={0.9} weight={500}>
                    Better Letter Card Co. is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are under 13 years of age, please do not use or provide any information on this website. If we discover that we have inadvertently collected personal information from a child under 13, we will take steps to promptly delete such information. By using Better Letter Card Co.'s services, you affirm that you are 13 years of age or older.
                    </Text>
                </Container>
            </Column>
        </Column>
    )
}

export default PrivacyPolicy