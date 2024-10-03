import React from 'react';
import Container from '../Container/Container';
import styles from './ProgressBar.module.scss';
import { THEMES } from '@/lib/styles';
interface ProgressBarProps {
    // Add any props here
    progress: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
    return (
        <Container style={{position: 'relative', width: '100%'}} padding>
            <Container className={styles.progressBarBackground}/>
            <Container style={{ width: `${progress ?? 2}%`}} className={styles.progressBarFill} />
        </Container>
    );
};

export default ProgressBar;
