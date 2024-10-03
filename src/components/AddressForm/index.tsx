"use client"
import { FC, useEffect, useRef, useState } from "react";
import Input from "../inputs/Input/NewInput";
import Container from "../utils/Container/Container";
import styles from './RecipientForm.module.scss'
import { AutocompletePrediction, getAddressFromPrediction, useGoogleSearch } from "@/app/helpers/google";
import Column from "../utils/Container/Column";
import { NewAddress } from "@/lib/@types/Address";

const AddressForm: FC<{address?: NewAddress, onChange: (address: NewAddress) => void}> = ({address, onChange}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [search, setSearch] = useState<string>('')
    
    const {results} = useGoogleSearch(search || '')

    const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false)


    const getAddress = async (prediction: AutocompletePrediction) => {
        const address = await getAddressFromPrediction(prediction)
        onChange(address ?? {})
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
 
    const onChangeAddress = (key: string, value: string) => {
        onChange({...address, [key]: value})
    }

    console.log(address)
    return (
        <>
        <Container padding={0.25} className={styles.input} style={{position: 'relative'}}>
            <Input label="Address Line One" onChange={(value) => {onChangeAddress('addressLineOne', value || ''); setSearch(value || '');}} value={address?.addressLineOne} placeholder="address line 1" />
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
            <Input label="Address Line Two" onChange={(value) => onChangeAddress('addressLineTwo', value || '')} value={address?.addressLineTwo || ''} placeholder="address line 2" />
        </Container>
        <Container padding={0.25} className={styles.input}>
            <Input label="City" onChange={(value) => onChangeAddress('city', value || '')} value={address?.city} placeholder="city" />
        </Container>
        <Container padding={0.25} className={styles.input}>
            <Input label="State" onChange={(value) => onChangeAddress('state', value || '')} value={address?.state} placeholder="state" />
        </Container>
        <Container padding={0.25} className={styles.input}>
            <Input label="Country" onChange={(value) => onChangeAddress('country', value || '')} value={address?.country} placeholder="country" />
        </Container>
        <Container padding={0.25} className={styles.input}>
            <Input label="Zipcode" onChange={(value) => onChangeAddress('zipcode', value || '')} value={address?.zipcode} placeholder="zipcode" />
        </Container>
        </>

    )
}

export default AddressForm