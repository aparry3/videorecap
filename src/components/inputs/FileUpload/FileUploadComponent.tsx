import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './FileUploadComponent.module.scss';
import { ChangeEventHandler, FC, useRef } from "react";


interface FileUploadComponentProps {
    onChange: ChangeEventHandler<HTMLInputElement>
    fileType?: 'video' | 'image'
    value?: File
    inverse?: boolean
}

const FileUploadComponent: FC<FileUploadComponentProps> = ({onChange, fileType = 'video', value, inverse}) => {
    const ref = useRef<HTMLInputElement>(null)

    return (
        <Container className={`${styles.uploadArea}`} onClick={() => ref.current?.click()} >
                <Column>
                    <Container padding className={styles.uploadIcon}>
                        <FontAwesomeIcon icon={faUpload} />
                    </Container>
                    <Container padding>
                        Drop your file here or <Container padding={[0, 0.3]} className={styles.browse}>Browse</Container>
                    </Container>
                    <input ref={ref} className={styles.input} type='file' accept={`${fileType}/*`} onChange={onChange}/>
                </Column>
        </Container>

    )
}

export default FileUploadComponent

{/* <video controls className={styles.video} src={objUrl} /> */}
