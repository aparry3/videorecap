"use client";
import Column from '@/components/utils/Container/Column';
import Text from '@/components/utils/Text';
import Container from '@/components/utils/Container/Container';
import { FC, useState } from 'react';
import styles from './ChooseMailMethod.module.scss'
import { MAIL_METHOD_MAP, MailMethod } from '@/lib/@types/Card';
import Button from '@/components/utils/Button';

  
interface TouchPoint {
    x: number | null;
    y: number | null;
  }
  

interface MailMethodProps {
    onMailMethodChange: (mailMethod: MailMethod) => void
    onHoverMailMethod: (mailMethod?: MailMethod) => void
    mailMethod?: MailMethod
}



const ChooseMailMethod: FC<MailMethodProps> = ({onHoverMailMethod, onMailMethodChange, mailMethod = MailMethod.NO_ENVELOPE}) => {
    const [touchStart, setTouchStart] = useState<TouchPoint>({ x: null, y: null });

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    };
  
    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>, mailMethod: MailMethod) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
  
      // Check if the touch point is within a certain range
      if (touchStart.x !== null && touchStart.y !== null &&
          Math.abs(touchStart.x - touchEndX) < 10 &&
          Math.abs(touchStart.y - touchEndY) < 10) {
        changeMailMethod(mailMethod);
      }
    };
  
    const changeMailMethod = (newMailMethod: MailMethod) => {
        onMailMethodChange(newMailMethod)
    }

    return (
            <Column style={{width: '100%'}} padding={[1, 0]} wrapContainer>
                {/* {isMobile && (
                    <Column padding>
                        <Container>
                            <Text size={1.4} weight={600}>Choose your card type</Text>
                        </Container>
                        <Container>
                            <Text size={1.1} weight={400}>(You may change this later)</Text>
                        </Container>  
                        <Container  padding>
                            <Container>
                                <Container onClick={() => setPricingOpen(true)} style={{cursor: 'pointer'}} padding={[0, 0.5]}>
                                <FontAwesomeIcon icon={faCircleInfo} /><Container padding={[0, 0.3, 0, 0.5]}><Text>Pricing</Text></Container>               
                                </Container>
                            </Container>
                        </Container>
                    </Column>                  
                )} */}
                {/* <Container className={styles.option}>
                    <Button onTouchStart={handleTouchStart} onMouseOver={() => onHoverMailMethod(MailMethod.ENVELOPE)} onMouseLeave={() => onHoverMailMethod(undefined)} onTouchEnd={(e) => handleTouchEnd(e, MailMethod.ENVELOPE)} onClick={() => changeMailMethod(MailMethod.ENVELOPE)} inverted={mailMethod !== MailMethod.ENVELOPE} hover={mailMethod !== MailMethod.ENVELOPE}>
                        <Container padding>
                            <Text weight={600}>{`${MAIL_METHOD_MAP[MailMethod.ENVELOPE]}`}</Text>
                        </Container>
                    </Button>
                </Container> */}
                <Container className={styles.option}>
                    <Button onTouchStart={handleTouchStart} onMouseOver={() => onHoverMailMethod(MailMethod.NO_ENVELOPE)} onMouseLeave={() => onHoverMailMethod(undefined)} onTouchEnd={(e) => handleTouchEnd(e, MailMethod.NO_ENVELOPE)} onClick={() => changeMailMethod(MailMethod.NO_ENVELOPE)}  inverted={mailMethod !== MailMethod.NO_ENVELOPE} hover={mailMethod !== MailMethod.NO_ENVELOPE}>
                        <Container padding>
                        <Text weight={600}>{`${MAIL_METHOD_MAP[MailMethod.NO_ENVELOPE]}`}</Text> 
                        </Container>
                    </Button>
                </Container>
                <Container className={styles.option}>
                    <Button onTouchStart={handleTouchStart} onMouseOver={() => onHoverMailMethod(MailMethod.AT_HOME)} onMouseLeave={() => onHoverMailMethod(undefined)} onTouchEnd={(e) => handleTouchEnd(e, MailMethod.AT_HOME)} onClick={() => changeMailMethod(MailMethod.AT_HOME)}  inverted={mailMethod !== MailMethod.AT_HOME} hover={mailMethod !== MailMethod.AT_HOME}>
                        <Container padding>
                            <Text weight={600}>{`${MAIL_METHOD_MAP[MailMethod.AT_HOME]}`}</Text>
                        </Container>
                    </Button>
                </Container>
                {/* <Container className={styles.option}>
                    <Button onTouchStart={handleTouchStart} onMouseOver={() => onHoverMailMethod(MailMethod.SET)} onMouseLeave={() => onHoverMailMethod(undefined)} onTouchEnd={(e) => handleTouchEnd(e, MailMethod.SET)} onClick={() => changeMailMethod(MailMethod.SET)}  inverted={mailMethod !== MailMethod.SET} hover={mailMethod !== MailMethod.SET}>
                        <Container padding>
                            <Text weight={600}>{`${MAIL_METHOD_MAP[MailMethod.SET]}`}</Text>
                        </Container>
                    </Button>
                </Container> */}
            </Column>
    )
}

export default ChooseMailMethod
