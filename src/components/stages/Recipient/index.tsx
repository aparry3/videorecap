"use client";
import Button from "@/components/utils/Button"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import Text from "@/components/utils/Text"
import styles from './Recipient.module.scss'
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NewRecipient, Recipient as Contact } from "@/lib/@types/Recipient"
import Dash from "@/components/utils/Dash";
import RecipientForm from "@/components/RecipientForm";
// import * as XLSX from 'xlsx'
import { parseAddressBook } from "@/app/helpers/recipients";
import Loading from "@/components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/utils/Modal";
import { useUser } from "@/contexts/user";
import { fetchUserAddressBook } from "@/app/helpers/user";


interface RecipientProps {
    recipientText?: string
    onSubmit: (recipients: NewRecipient[], partialRecipients?: Partial<NewRecipient>[]) => void
    recipients?: NewRecipient[]
    partialRecipients?: Partial<NewRecipient>[]
}

export const ADDRESS_BOOK_LOADING_TEXT = 'Reading Address Book...'
const SAVING_LOADING_TEXT = 'Saving Recipients...'

const Recipient: FC<RecipientProps> = ({onSubmit, recipientText = "recipient name", recipients, partialRecipients}) => {
    const xlsxRef = useRef<HTMLInputElement>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const [isPartial, setIsPartial] = useState<boolean>(false)
    const {user, loading: userLoading} = useUser()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingText, setLoadingText] = useState<string>(ADDRESS_BOOK_LOADING_TEXT)
    const [tempRecipients, setTempRecipients] = useState<Partial<Contact>[] | (NewRecipient | Contact)[]>(recipients || [])
    const [recipient, setRecipient] = useState<Partial<Contact> | undefined>()
    const [addressBook, setAddressBook] = useState<File | undefined>()
    const [roladex, setRoladex] = useState<Contact[] | undefined>([])
    const [addressBookOpen, setAddressBookOpen] = useState(false)

    const canSubmit = useMemo(() => {
        return recipients && recipients.length && !partialRecipients?.length 
    },[recipients, partialRecipients])

    const ids: number[] = useMemo(() => recipients?.filter(r => r.id).map(r => r.id!) || [], [recipients])
    const roladexIds: number[] = useMemo(() => roladex?.map(r => r.id) || [], [roladex])

    const fillRoladex = async (id: number) => {
        const _roladex = await fetchUserAddressBook(id)
        setRoladex(_roladex)
    }

    useEffect(() => {
        if (user) {
            fillRoladex(user.id)
        }
    }, [user, userLoading])

    const handleConfirm = useCallback((recipient: NewRecipient | Contact) => {
        if (!recipient.id || !roladexIds.includes(recipient.id)) {
            if (isPartial) {
                onSubmit([...(recipients || []), recipient], [...tempRecipients])
                setIsPartial(false)
            } else {
                onSubmit([...(tempRecipients as (NewRecipient | Contact)[] || []), recipient], partialRecipients)
            }    
        } else if (recipient.id && roladexIds.includes(recipient.id)) {
            const _recipient = {...recipient}
            delete _recipient.id
            onSubmit([...(tempRecipients as (NewRecipient | Contact)[] || []), _recipient], partialRecipients)
        }
        setEditing(false)
        setAddressBookOpen(false)
        setRecipient(undefined)

    }, [tempRecipients, isPartial])

    const handleConfirmContacts = (contacts: Contact[]) => {
        const _recipients = recipients?.filter(r => r.id === undefined) ?? []
        _recipients.push(...contacts)
        onSubmit(_recipients)
        setEditing(false)
        setAddressBookOpen(false)
    }

    const cancelEditing = useCallback(() => {

        setIsPartial(false)
        setEditing(false)
        setRecipient(undefined)

    }, [])

    const handleDelete = useCallback(() => {
        if (isPartial) {
            onSubmit(recipients || [], [...tempRecipients])
            setIsPartial(false)
        } else {
            onSubmit(tempRecipients as NewRecipient[] || [], partialRecipients)
        }
        setEditing(false)
        setRecipient(undefined)

    }, [tempRecipients, isPartial])


    useEffect(() => {
        if (recipients && recipients.length) {
            setEditing(false)
        } 
        setTempRecipients(recipients || [])
    }, [recipients])

    const editRecipient = (index: number) => {
        if (recipients) {
            const _recipients = [...recipients]

            const recipient = _recipients.splice(index, 1)[0]
            setTempRecipients([..._recipients])
            setRecipient(recipient)
            setEditing(true)
        }
    }
    const editErrorRecipient = (index: number) => {
        if (partialRecipients) {
            const _partialRecipients = [...partialRecipients]
            const recipient = _partialRecipients.splice(index, 1)[0]
            setTempRecipients([..._partialRecipients])
            setRecipient(recipient)
            setEditing(true)
            setIsPartial(true)
        }
    }

    const addNewRecipient = () => {
        setRecipient(undefined)
        setEditing(true)
    }

    const handleChangeAddressBook = (e: ChangeEvent<HTMLInputElement>) => {
        const _files = e.target.files
        console.log(e.target.files)
        if (_files && _files.length) {
            setAddressBook(_files[0])
        }
    }

    const readFile = async (_addressBook: File) => {
        const buffer = await _addressBook.arrayBuffer()
        const {read, utils} = await import('xlsx').then(m => m.default || m)
        const workbook = read(buffer, {type: 'buffer'});

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]


        const csv = utils.sheet_to_csv(sheet)

        const rows = csv.split('\n')

        console.log(rows)
        const addressBookRecipients = await parseAddressBook(rows)
        console.log(recipients)
        const [_recipients, errors] = sortRecipients(addressBookRecipients)
        onSubmit([...(recipients || []), ..._recipients], [...(partialRecipients || []), ...errors])
        setLoading(false)
    }

    const sortRecipients = (recipientList: Partial<NewRecipient>[]): [NewRecipient[], Partial<NewRecipient>[]] => {
        const validRecipients: NewRecipient[] = []
        const errors: Partial<NewRecipient>[] = []

        recipientList.forEach(r => {
            if (r.name && r.addressLineOne && r.city && r.state && r.zipcode) {
                validRecipients.push(r as NewRecipient)
            } else {
                errors.push(r)
            }
        })

        validRecipients.sort((a, b) => a.name <= b.name ? -1 : 1)
        errors.sort((a, b) => (a?.name || 0) <= (b?.name || 0) ? -1 : 1)
        return [validRecipients, errors]
    }

    useEffect(() => {
        if (addressBook) {
            setLoading(true)
            setLoadingText(ADDRESS_BOOK_LOADING_TEXT)
            readFile(addressBook)
        }
    }, [addressBook])
    
    return (
        <Column style={{width: '100%', height: '100%'}}>
            {loading && (<Loading text={loadingText} />)}
                <>
                    <Container style={{width: '100%', height: '6rem'}}>
                    <Container className={styles.input}>
                        <Button padding inverted onClick={addNewRecipient}>
                            <Text className={styles.buttonText}>+ Add Recipient</Text>
                        </Button>
                    </Container>
                    {user && (
                        <Container className={styles.input}>
                            <Button padding inverted onClick={() => setAddressBookOpen(true)}>
                                <Text className={styles.buttonText}>Choose from Roladex</Text>
                            </Button>
                        </Container>
                    )}
                    </Container>
                    <Column style={{width: '100%', flexGrow: 1, overflow: 'auto'}}>
                        <Column style={{width: '100%'}}>
                            {partialRecipients?.map((e, i) => (
                                <Container style={{width:'100%'}} padding={0.5}>
                                    <Column key={e.name} padding style={{width: '100%'}} className={`${styles.addressChip} ${styles.error}`} onClick={() => editErrorRecipient(i)}>
                                        <Container justify="flex-start" style={{width: '100%'}}>
                                            <Text weight={600}>{e.name}</Text>
                                        </Container>
                                        <Container justify="flex-start" style={{width: '100%'}}>
                                            <Text >{e.addressLineOne}</Text>
                                        </Container>
                                        {e.addressLineTwo && (
                                        <Container justify="flex-start" style={{width: '100%'}}>
                                            <Text >{e.addressLineTwo}</Text>
                                        </Container>
                                        )}
                                        <Container justify="flex-start" style={{width: '100%'}}>
                                            <Text >{e.city}, {e.state}, {e.zipcode}</Text>
                                        </Container>
                                    </Column>
                                </Container>    
                            ))}
                            {recipients?.map((r, i) => (
                                <Container style={{width:'100%'}} padding={0.5}>
                                <Column key={r.name} padding style={{width: '100%'}} className={styles.addressChip} onClick={() => editRecipient(i)}>
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
                                </Container>
                            ))}
                        </Column>
                    <Container style={{width:'100%'}}>
                        <Dash />
                        <Container><Text>OR</Text></Container>
                        <Dash />
                    </Container>
                    <Column padding style={{width: '100%'}}>
                        <Container className={styles.uploadArea} padding onClick={() => xlsxRef.current?.click() }> 
                            <input ref={xlsxRef} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className={styles.fileInput} onChange={handleChangeAddressBook}/>
                            <Text weight={500}>{`Upload Address Book (.csv, .xlsx, .xls)`}</Text>
                        </Container>
                    </Column>
                </Column>
                {/* <Container justify="space-between" style={{width: '100%'}}>
                    <Container>
                        <Text weight={600}>Recipients: {recipients?.length || 0}</Text>
                    </Container>
                </Container> */}
                <Modal open={editing} onClose={() => setEditing(false)}>
                    <Container justify="flex-start" style={{width:'100%'}}>
                        <Container padding style={{cursor: 'pointer'}} onClick={cancelEditing}>
                            <FontAwesomeIcon icon={faChevronLeft} /><Container padding={[0, 0.3]}>back</Container>
                        </Container>
                    </Container>
                    <Column justify='center' style={{flexGrow: 1, width: '100%'}}>
                        <Container padding={0.5} style={{width: '100%'}}>
                            <Text weight={600} >{`${recipient ? 'Edit' : 'Add'} Recipient`}</Text>
                        </Container>
                        <RecipientForm recipientText={recipientText} recipient={recipient} onSubmit={handleConfirm} onDelete={handleDelete}/>
                    </Column>
                </Modal>
                <RoladexSelect open={addressBookOpen} roladex={roladex} selectedIds={ids} onClose={() => setAddressBookOpen(false)} onConfirm={handleConfirmContacts}/>
                </>
        </Column>
    )
}

const RoladexSelect: FC<{roladex?: Contact[], onClose: () => void, open: boolean, selectedIds: number[], onConfirm: (recipients: Contact[]) => void}> = ({roladex, onClose, open, selectedIds, onConfirm}) => {
    const [selected, setSelected] = useState<number[]>(selectedIds ?? [])
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>()

    useEffect(() => {
        setSelected(selectedIds)
    }, [selectedIds])

    useEffect(() => {
        setSelectedContacts(roladex?.filter(r => selected.includes(r.id)) ?? [])
    }, [roladex, selected])

    const toggleSelected = useCallback((id: number) => {
        const _selected = [...selected]
        const index = _selected.indexOf(id)
        if (index > -1) {
            _selected.splice(index, 1)
            setSelected(_selected)
        } else {
            _selected.push(id)
            setSelected(_selected)
        }
    }, [selected])

    const confirm = () => {
        return onConfirm(selectedContacts ?? [])
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Column style={{width: '100%', height: '100%'}}>
                <Column justify="flex-start" style={{width:'100%', overflow: 'auto', flexShrink: 1}}>
                {roladex?.map(r => (
                    <Container style={{width:'100%'}} padding={0.5}>
                        <Column key={r.name} padding style={{width: '100%'}} className={`${styles.addressBookChip} ${selected.includes(r.id) ? styles.addressChip : ''}`} onClick={() => toggleSelected(r.id)}>
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
                    </Container>
                ))}
                </Column>
                <Container style={{width: '100%'}} >
                    <Container padding style={{flexGrow: 1}}>
                        <Button onClick={onClose} inverted>
                            Close
                        </Button>
                    </Container>
                    {(selected && !!selected.length) && (
                        <Container padding={0.5} style={{flexGrow: 1}}>
                            <Button onClick={confirm} inverted>
                                Confirm
                            </Button>
                        </Container>
                    )}
                </Container>
            </Column>
        </Modal>

    )
}
export default Recipient
