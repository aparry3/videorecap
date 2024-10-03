import Column from "@/components/utils/Container/Column"
import Text from "@/components/utils/Text"
import { StageProps } from "../BaseStage"
import { FC, useCallback, useEffect, useState } from "react"
import styles from './VideoUpload.module.scss'
import VideoUploadContainer from "./VideoUploadContainer"
import Container from "@/components/utils/Container/Container"


interface VideoUploadProps {
    onSubmit: (videoFile?: File) => void
    video?: File
}

const VideoUpload: FC<VideoUploadProps> = ({onSubmit, video}) => {

    const handleChange = (_videoFile?: File) => {
        onSubmit(_videoFile)
    }

    return (
        <Column className={styles.videoUpload}>
            <VideoUploadContainer videoFile={video} onChange={handleChange} />            
        </Column>
    )
}

export default VideoUpload