import Button from "@/components/utils/Button"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import { StageProps } from "../BaseStage"
import { FC, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from './Preview.module.scss'
import Text from '@/components/utils/Text'
import { NewRecipient } from "@/lib/@types/Recipient"
import { UploadFileType, useUploadFile } from "@/app/helpers/upload"
import { base64ToFile, rotateImage } from "@/app/helpers/images"
import Loading from "@/components/loading"
import { Proof, getProof, submitCard } from "@/app/helpers/cards"
import PostcardBack, { FACTOR, TEMPLATE_CONFIG } from "@/components/templates/PostcardBack"

import { convertToImage } from "@/app/helpers/html"
import { AspectRatio, Card, MailMethod, RECIPIENT_TYPES } from "@/lib/@types/Card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp, faDownload } from "@fortawesome/free-solid-svg-icons"
import { calculateTotal, getUnitPrice, promoApplies } from "@/lib/payments/cardPricing"
import Dash from "@/components/utils/Dash"
import { Promo } from "@/lib/@types/Promo"
import { exportRecipients } from "@/app/helpers/recipients"

interface PreviewProps extends StageProps {
    id: string
    email: string
    mailMethod: MailMethod
    quantity: number
    imageSrc?: string

    videoFile?: File

    qrCode?: string

    recipients?: NewRecipient[]
    returnRecipient?: NewRecipient

    message?: string
    sender?: string
    size: AspectRatio
    promo?: Promo
    price: number

    onSubmit: (newCard: Card) => void
}

const Preview: FC<PreviewProps> = ({onNext, quantity, sender, promo, price, size, id, mailMethod, email, imageSrc, videoFile, qrCode, recipients, returnRecipient, message, onSubmit}) => {
    const {uploadFiles, progress, loading: uploadLoading} = useUploadFile()

    const previewRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const [loading, setLoading] = useState<boolean>(true)
    const [loadingText, setLoadingText] = useState<string>("Uploading Files")

    const [factor, setFactor] = useState<number>(FACTOR)

    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape')
    const [backImageSrc, setBackImageSrc] = useState<string>('')
    
    const [recipientsOpen, setRecipientsOpen] = useState<boolean>(false)

    const [cardWidth, setCardWidth] = useState<number>(TEMPLATE_CONFIG[size].aspect[0])

    const recipientsOkay = useMemo(() => !RECIPIENT_TYPES.includes(mailMethod) ||  (recipients && recipients.length && returnRecipient), [recipients, returnRecipient, mailMethod])
    
    const handleSubmit = async () => {
        if (id && email && recipientsOkay && qrCode && imageSrc && backImageSrc && quantity) {
            setLoading(true)
            const qrFile = base64ToFile(qrCode, 'qrCode.png')
            const imageFile = base64ToFile(orientation === 'portrait' ? await rotateImage(imageSrc) : imageSrc, 'image.jpeg')
            const backFile = base64ToFile(backImageSrc, 'back.jpeg')
            
            const files: UploadFileType[] = [
                [qrFile, 'qrcode', id],
                [imageFile, 'image', id],
                [backFile, 'back', id]
            ]

            if (videoFile) {
                files.push([videoFile, 'video', id])
            }

            const links = await uploadFiles(files)

                        
            const _qrLink = links[0].mediaLink
            const _imageLink = links[1].mediaLink
            const _backImageLink = links[2].mediaLink

            const _videoLink = links.length === 4 ? links[3].mediaLink : undefined


            let proof: Proof | undefined;
            if (mailMethod === MailMethod.NO_ENVELOPE && recipients && returnRecipient) {
                setLoadingText("Generating Proof")

                try {
                    proof = await getProof(id, _imageLink, _backImageLink, recipients[0], returnRecipient)
                } catch (e: any) {
                    console.error(e.message)
                }
            }

            setLoadingText("Saving Order")

            
            const newCard = await submitCard(
                id,
                email,
                mailMethod,
                _imageLink,
                _qrLink,
                _backImageLink,
                quantity,
                returnRecipient,
                message,
                _videoLink,
                proof?.front,
                proof?.back,
            )

            setLoading(false)
            onSubmit(newCard)
            onNext()
        }
    }

    const updateFactor = () => {
    if (previewRef.current) {
        if (previewRef.current.offsetWidth < FACTOR * cardWidth) {
            setFactor(previewRef.current.offsetWidth / cardWidth - 5)
        }
    }
    };
    
      // Use the useEffect hook to monitor changes to the parent div width
    useEffect(() => {
        // Initial measurement
        updateFactor();

        // Attach a resize event listener to the window
        window.addEventListener('resize', updateFactor);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', updateFactor);
        };
    }, []);

    const checkOrientation = useCallback(() => {
        if (imageRef.current) {
            setOrientation(imageRef.current.naturalHeight > imageRef.current.naturalWidth ? 'portrait' : 'landscape')
        }
        setLoading(false)
    }, [imageRef])

    
    const setHtml = async (element: HTMLElement) => {
        if (element) {
            const image = await convertToImage(element)
            setBackImageSrc(image)

        } else {
            console.error("no element")
        }
    }

    useEffect(() => {
        if (uploadLoading) {
            setLoadingText(`Uploading Files: ${Math.floor(progress)}%`)
        }
    }, [progress, uploadLoading])
    
    const _promoApplies = useMemo(() => promoApplies(promo, recipients?.length ), [recipients, promo])

    const unitPrice = useMemo(() => getUnitPrice(mailMethod, quantity), [recipients, mailMethod, quantity])

    const downloadAddressBook = useCallback((e: MouseEvent) => {
        if (recipients) {
            e.preventDefault()
            e.stopPropagation()
            exportRecipients(recipients)
        }
    }, [recipients])
    return (
        <Column style={{height: '100%', width: '100%'}}>
            {loading && <Loading text={loadingText}/>}
            {MailMethod.SET === mailMethod && (
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <Container className={styles.recipients} style={{width: '100%'}} padding>
                    <Container>
                        <Text size={1.1} weight={600}>Quantity:</Text>
                    </Container>
                    <Container style={{flexGrow: 1}} justify="flex-end">
                        <Text size={1.1} weight={600}>{quantity}</Text>
                    </Container>
                </Container>
            </Column>
            )}
            { RECIPIENT_TYPES.includes(mailMethod) && (
            <>
            {(recipients && recipients.length) && (
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <Container className={styles.recipients} style={{width: '100%'}} onClick={() => setRecipientsOpen(!recipientsOpen)} padding>
                    <Container>
                        <Text size={1.1} weight={600}>Recipients:</Text>
                    </Container>
                    <Container style={{flexGrow: 1}} justify="flex-end">
                        <Text size={1.1} weight={600}>{recipients?.length || 0}</Text>
                    </Container>
                    <Container padding={0.5}><FontAwesomeIcon icon={recipientsOpen ? faChevronUp : faChevronDown} /></Container> 
                    <Container padding={0.5} onClick={downloadAddressBook} style={{cursor: 'pointer'}}><FontAwesomeIcon icon={faDownload} /></Container>   
                </Container>
                {recipientsOpen && recipients.map((r) => (
                    <Column key={r.name} padding style={{width: '100%'}} className={styles.recipients}>
                        <Container justify="flex-start" style={{width: '100%'}}>
                            <Text weight={600}>{r.name}</Text>
                        </Container>
                        <Container justify="flex-start" style={{width: '100%'}}>
                            <Text >{r.addressLineOne}</Text>
                        </Container>
                        {r.addressLineTwo && (
                        <Container justify="flex-start" style={{width: '100%'}}>
                            <Text >{r.addressLineTwo}</Text>
                        </Container>
                        )}
                        <Container justify="flex-start" style={{width: '100%'}}>
                            <Text >{r.city}, {r.state}, {r.zipcode}</Text>
                        </Container>
                    </Column>
                ))}
            </Column>
            )}
            {returnRecipient && (
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <Container justify="flex-start" className={styles.recipients} style={{width: '100%'}} padding>
                    <Container>
                        <Text size={1.1} weight={600}>{mailMethod === MailMethod.SET ? 'Ship To' : 'Return Recipient'}:</Text>
                    </Container>
                </Container>
                <Column key={returnRecipient.name} padding style={{width: '100%'}} className={styles.recipients}>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text weight={600}>{returnRecipient.name}</Text>
                    </Container>
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.addressLineOne}</Text>
                    </Container>
                    {returnRecipient.addressLineTwo && (
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.addressLineTwo}</Text>
                    </Container>
                    )}
                    <Container justify="flex-start" style={{width: '100%'}}>
                        <Text >{returnRecipient.city}, {returnRecipient.state}, {returnRecipient.zipcode}</Text>
                    </Container>
                </Column>
            </Column>
            )}
            </>
            )}
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <img src={imageSrc} onLoad={() => checkOrientation()} ref={imageRef} style={{boxShadow: '0 0 10px -4px black', height: orientation === 'portrait' ? `${factor * cardWidth}px` : 'auto', width: orientation === 'landscape' ?`${factor * cardWidth}px` : 'auto'}} />
            </Column>
            <Column containerRef={previewRef} padding style={{width: '100%', flexGrow: 1}}>
                <PostcardBack message={message} size={size} onLoad={setHtml} sender={sender} qrCode={qrCode} factor={factor} />
            </Column>
            <Column padding style={{width: '100%', flexGrow: 1}}>
                <Container padding={0.5} justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>Quantity:</Text>
                    </Container>
                    <Container>
                        <Text weight={600}>{quantity || 1}</Text>
                    </Container>
                </Container>
                <Container padding={0.5} justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>Unit Price:</Text>
                    </Container>
                    <Container>
                    {_promoApplies && (
                        <Container padding={[0, 0.5]}>
                            <Text weight={600}>${calculateTotal(unitPrice, promo, quantity)/100}</Text>
                        </Container>
                    )}
                        <Container>
                            <Text style={{textDecoration: _promoApplies ? 'line-through' : 'none'}} weight={_promoApplies ? 500 : 600}>{`$${unitPrice/100}`}</Text>
                        </Container>
                    </Container>
                </Container>
                <Container style={{width: '100%'}}>
                    <Dash />
                </Container>
                <Container padding={0.5} justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>Subtotal:</Text>
                    </Container>
                    <Container>
                        <Text weight={600}>{`$${Number(price/100).toFixed(2)}`}</Text>
                    </Container>
                </Container>
                {(promoApplies(promo, recipients?.length)) && (
                <Container padding={0.5} justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>PROMO: <Text weight={500}>{promo?.id}</Text></Text>
                    </Container>
                    <Container>
                        <Text weight={600}>{`- $${(price - calculateTotal(price, promo, quantity))/100}`}</Text>
                    </Container>
                </Container>
                )}
                <Container style={{width: '100%'}}>
                    <Dash />
                </Container>
                <Container padding={0.5} justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>Total:</Text>
                    </Container>
                    <Container>
                        <Text weight={600}>{`$${Number(calculateTotal(price, promo, quantity)/100).toFixed(2)}`}</Text>
                    </Container>
                </Container>
            </Column>

            <Container padding justify='flex-end' style={{width: '100%'}}>
                <Container className={styles.button}>
                    <Button onClick={handleSubmit}>
                        checkout
                    </Button>
                </Container>
            </Container>
        </Column>
    )
}

export default Preview