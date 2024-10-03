"use client"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "../inputs/Input";
import Container from "../utils/Container/Container";
import styles from './RecipientForm.module.scss'
import { NewRecipient } from "@/lib/@types/Recipient";
import { AutocompletePrediction, getAddressFromPrediction, useGoogleSearch } from "@/app/helpers/google";
import Column from "../utils/Container/Column";
import Button from "../utils/Button";
import DatePicker from "../inputs/DatePicker";
import Text from '@/components/utils/Text'

interface RecipientFormProps {
    includeDate?: boolean
    recipientText: string
    recipient?: Partial<NewRecipient>
    onDelete?: () => void
    onSubmit: (recipient: NewRecipient) => void
}

const RecipientForm: FC<RecipientFormProps> = ({includeDate = false, recipientText, recipient, onDelete, onSubmit}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [name, setName] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [addressLineOne, setAddressLineOne] = useState<string>('')
    const [addressLineTwo, setAddressLineTwo] = useState<string | undefined>('')
    const [city, setCity] = useState<string>('')
    const [state, setState] = useState<string>('')
    const [country, setCountry] = useState<string>('')
    const [zipcode, setZipcode] = useState<string>('')
    const [birthday, setBirthday] = useState<Date | undefined>()

    const {results} = useGoogleSearch(search || '')

    const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false)

    const canSubmit = useMemo(() => addressLineOne && city && state && country && zipcode,
    [addressLineOne, city, state, country, zipcode])

    const handleConfirm = useCallback(() => {
        if (canSubmit) {
            console.log(addressLineOne)
            onSubmit({
                id: recipient?.id,
                name,
                addressLineOne: addressLineOne,
                addressLineTwo: addressLineTwo,
                city,
                state,
                country,
                zipcode,
                birthday
            })
        }
    }, [canSubmit, name, addressLineOne, addressLineTwo, city, state, country, zipcode, birthday])

    const getAddress = async (prediction: AutocompletePrediction) => {
        const address = await getAddressFromPrediction(prediction)
        setAddressLineOne(address?.addressLineOne || '')
        setAddressLineTwo('')
        setCity(address?.city || '')
        setState(address?.state || '')
        setCountry(address?.country || '')
        setZipcode(address?.zipcode || '')
        setAutocompleteOpen(false)
        setSearch('')
     }
     
     useEffect(() => {
        if (results.length) {
            setAutocompleteOpen(true)
        }
    }, [results])

     const checkClick = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
             setAutocompleteOpen(false)
         }
     }
       
     useEffect(() => {
         document.addEventListener('click', checkClick);
     
         // Clean up the event listener when the component unmounts
         return () => {
         document.removeEventListener('click', checkClick);
         };
     }, []);
 
     useEffect(() => {
        if (recipient) {
            setName(recipient.name || '')
            setAddressLineOne(recipient.addressLineOne || '')
            setAddressLineTwo(recipient.addressLineTwo || '')
            setCity(recipient.city || '')
            setState(recipient.state || '')
            setCountry(recipient.country || '')
            setZipcode(recipient.zipcode || '')
            setBirthday(recipient.birthday)
        }
    }, [recipient])

    

    return (
        <Column id="recipient-form" style={{width: '100%'}}>
            <Container justify="flex-start" padding={[0,1]} style={{width: '100%'}}>
                <Text weight={600} size={0.9}>Name</Text>
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setName(value || '')} value={name} placeholder={recipientText} />
            </Container>
            <Container justify="flex-start" padding={[0,1]} style={{width: '100%'}}>
                <Text weight={600} size={0.9}>Address</Text>
            </Container>
            <Container padding={0.25} className={styles.input} style={{position: 'relative'}}>
                <Input onChange={(value) => {setAddressLineOne(value || ''); setSearch(value || '');}} value={addressLineOne} placeholder="address line 1" />
                { (results && autocompleteOpen) && (
                <Container style={{ 
                    position: 'absolute',
                    top: '100%',
                    zIndex: 10,
                    width: '100%'
                }} padding={[0,0.75]}>
                    <Column containerRef={dropdownRef} className={styles.addressAutocomplete}>
                        {results.map(r => (
                            <Container key={r.description} padding justify='flex-start' className={styles.autocompleteResult} onClick={() => getAddress(r)}>
                                {r.description}
                            </Container>
                        ))}
                    </Column>
                </Container>
                )}
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setAddressLineTwo(value)} value={addressLineTwo || ''} placeholder="address line 2" />
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setCity(value || '')} value={city} placeholder="city" />
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setState(value || '')} value={state} placeholder="state" />
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setCountry(value || '')} value={country} placeholder="country" />
            </Container>
            <Container padding={0.25} className={styles.input}>
                <Input onChange={(value) => setZipcode(value || '')} value={zipcode} placeholder="zipcode" />
            </Container>
            {includeDate && (
            <>
            <Container justify="flex-start" padding={[0,1]} style={{width: '100%'}}>
                <Text weight={600} size={0.9}>Birthday</Text>
            </Container>            
            <Container padding={0.25} className={styles.input}>
                <DatePicker value={birthday} onChange={(date) => setBirthday(date)}/>
            </Container>
            </>
            )}
            <Container padding={0.25} justify='flex-end' className={styles.input}>
                {(recipient && onDelete) && (
                <Container className={styles.button}>
                    <Button onClick={onDelete}>
                        delete
                    </Button>
                </Container>
                )}
                <Container className={styles.button}>
                    <Button disabled={!canSubmit} onClick={handleConfirm}>
                        confirm
                    </Button>
                </Container>
            </Container>
        </Column>

    )
}

export default RecipientForm