import { ChangeEvent, FC, useEffect, useState } from "react";
import Container from "../utils/Container/Container";
import Button from "../utils/Button";
import FileUploadComponent from "../inputs/FileUpload/FileUploadComponent";
import Dash from "../utils/Dash";
import Text from '../utils/Text';
import styles from './VideoUploadContainer.module.scss';


interface VideoUploadContainerProps {
    videoFile?: File
    onChange: (video?: File) => void
    onSubmit: () => void
    optional?: boolean
}
const VideoUploadContainer: FC<VideoUploadContainerProps> = ({videoFile: propsVideoFile, onChange, onSubmit, optional = true}) => {
    const [videoFile, setVideoFile] = useState<File | undefined>(propsVideoFile)
    const [videoUrl, setVideoUrl] = useState<string | undefined>(propsVideoFile ? URL.createObjectURL(propsVideoFile) : undefined)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const _videoFile = e.target.files && e.target.files.length ? e.target.files[0] : undefined
        if (_videoFile && _videoFile?.type.startsWith('video/')) {
            onChange(_videoFile)
        }
    }

    useEffect(() => {
        if (propsVideoFile) {
            setVideoFile(propsVideoFile)
            setVideoUrl(URL.createObjectURL(propsVideoFile))
        } else {
            setVideoFile(undefined)
            setVideoUrl(undefined)
        }
    }, [propsVideoFile])
    
    return (
        <>
        {videoUrl ? (
            <>
            <Container className={styles.videoContainer}>
                <video controls src={videoUrl} className={styles.video} />
            </Container>
            <Container padding={[0.5, 0]}  className={styles.actions} style={{width: '100%'}}>
                <Button inverted onClick={() => onChange()}>
                    upload a different video
                </Button>
                <Button onClick={onSubmit}>
                    submit
                </Button>
            </Container>
            </>
        ) : (
            <>
                <Container padding style={{width: '100%', flexGrow: 1}}>
                    <FileUploadComponent fileType="video" value={videoFile} onChange={handleChange}/>
                </Container>
                { optional && (
                <>
                    <Container style={{width: '100%'}}>
                        <Dash />
                        <Text>OR</Text>
                        <Dash />
                    </Container>
                    <Container padding={[0.5, 0]}  className={styles.actions} style={{width: '100%'}}>
                        <Button inverted onClick={onSubmit}>
                            upload later
                        </Button>
                    </Container>
                </>)}
            </>
        )}
        </>
    )
}

export default VideoUploadContainer