"use client"
import Container from '@/components/utils/Container/Container';
import { FC } from 'react';
import styles from './Header.module.scss'
import { Link } from '@/components/utils/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@/lib/styles';
import { User } from '@/lib/@types/Account';

const Header: FC<{theme?: Theme, user?: User, onMenuClick: () => void}> = ({theme, user, onMenuClick}) => {

    return (
        <Container justify='space-between' className={styles.header} style={{background: theme?.primary, color: theme?.primary_text}}>
            <Container padding className={styles.menuContainer} onClick={onMenuClick}>
                <FontAwesomeIcon icon={faBars} />
            </Container>
            <Link link="/">
                <Container padding className={styles.menuContainer} >
                    <img src='/logos/lettersSecondary.png' className={styles.logo}/>
                </Container>
            </Link>
        </Container>
    )
}

export default Header