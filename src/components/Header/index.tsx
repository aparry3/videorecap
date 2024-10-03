import Container from '@/components/utils/Container/Container';
import Text from '@/components/utils/Text';
import { FC } from 'react';
import styles from './Header.module.scss'
import { Link } from '@/components/utils/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@/lib/styles';
import { getSession } from '@auth0/nextjs-auth0';

const Header: FC<{theme?: Theme}> = async ({theme}) => {
    const session = await getSession();
    const user = session ? session.user : undefined

    return (
        <Container justify='space-between' className={styles.header} style={{background: theme?.primary, color: theme?.primary_text}}>
            <Link link="/">
                <Container padding >
                    <Text className={styles.wordmark} weight={600}>Better Letter Card Co.</Text>
                </Container>
            </Link>
            <Container padding className={styles.buttonContainer}>
                <Container padding className={styles.buildButton}>
                    <Link link="/build">
                        <Container padding={0.6} className={`${styles.interactive} ${styles.button} `}>
                            <Text size={0.8} weight={600}>Create a Postcard</Text>
                        </Container>
                    </Link>
                </Container>
                <Container padding>
                    {!user ? (
                    <Link link="/api/auth/login">
                        <Container padding={0.5} className={styles.interactive} >
                            <Text size={0.8} weight={600}>Login</Text>
                        </Container>
                    </Link> ) : (
                    <Link link="/account">
                        <Container padding={0.5} className={styles.interactive}>
                            <Text size={0.8} weight={600}>Account</Text>
                        </Container>
                    </Link> )}
                </Container>
            </Container>
        </Container>
    )
}

export default Header