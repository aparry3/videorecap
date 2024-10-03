import Button from "@/components/utils/Button"
import FileUploadComponent from "@/components/inputs/FileUpload/FileUploadComponent"
import Column from "@/components/utils/Container/Column"
import Container from "@/components/utils/Container/Container"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import styles from './ImageUpload.module.scss'
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { rotateImage } from "@/app/helpers/images"


export const RATIOS = {
    '4x6': [4, 6, 4, 6],
    '425x6': [4.50, 6.25, 4.5, 6.25],
    '5x7': [5, 7, 5, 7]
}

interface ImageUploadProps {
    onImageChange: (imageFile?: File) => void,
    onCropChange: (resizedImage: string) => void
    
    image?: File
    // croppedImageSrc?: string,
    size?: keyof typeof RATIOS
}

enum Orientation {
    PORTRAIT = 0,
    LANDSCAPE = 1
}


const ImageUpload: FC<ImageUploadProps> = ({onImageChange, onCropChange, size = '4x6', image}) => {
    const [imageUrl, setImageUrl] = useState<string>()
    const [orientation, setOrientation] = useState<Orientation>(Orientation.LANDSCAPE)
    const [aspectRatio, setAspectRatio] = useState<number>(RATIOS[size][2]/RATIOS[size][3])
    const [crop, setCrop] = useState<Crop>()

    const imgRef = useRef<HTMLImageElement>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const _imageFile = e.target.files && e.target.files.length ? e.target.files[0] : undefined
        if (_imageFile && _imageFile?.type.startsWith('image/')) {
            onImageChange(_imageFile)
        } else {
            onImageChange(undefined)
        }
    }
    
    useEffect(() => {
        if (image) {
            setImageUrl(URL.createObjectURL(image))
        } else {
            setImageUrl(undefined)
        }
    }, [image])
    
    useEffect(() => {
        setAspectRatio(orientation === Orientation.PORTRAIT ? RATIOS[size][2]/RATIOS[size][3] : RATIOS[size][3]/RATIOS[size][2])
    }, [size])

    const handleLoad = () => {
        const _crop = createCenterCrop()
        cropImageNow(_crop)
    }
    const createCenterCrop = (): Crop | undefined => {
        if (imgRef.current) {
            const _crop = centerCrop(
                makeAspectCrop(
                    {
                        // You don't need to pass a complete crop into
                        // makeAspectCrop or centerCrop.
                        unit: '%',
                        width: 100,
                    },
                    aspectRatio,
                    imgRef.current.naturalWidth,
                    imgRef.current.naturalHeight,
                ),
                imgRef.current.width,
                imgRef.current.height
                )
            setCrop(_crop)
            return _crop
        }

    }
    
    useEffect(() => {
        if (imgRef.current) {
            console.log("CROP")
            const _crop = createCenterCrop()
            cropImageNow(_crop)
        }
    }, [aspectRatio])

    const cropImageNow = async (newCrop?: Crop) => {
        const _crop = newCrop ?? crop
        console.log(_crop)
        const canvas = document.createElement('canvas');
        if (imgRef.current && _crop && canvas) {
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

            const dpi = 300
            const dim1 = RATIOS[size][0]
            const dim2 = RATIOS[size][1]
            const cropDim1 = RATIOS[size][2]
            const cropDim2 = RATIOS[size][3]
            var cropWidth
            var cropHeight
            if (aspectRatio < 1) {
                canvas.width = dpi * dim1;
                canvas.height = dpi * dim2;
                cropWidth = dpi * cropDim1;
                cropHeight = dpi * cropDim2;    
            } else {
                canvas.height = dpi * dim1;
                canvas.width = dpi * dim2;
                cropHeight = dpi * cropDim1;
                cropWidth = dpi * cropDim2;    
            
            }        

            const ctx = canvas.getContext('2d');
    
            const sx = _crop.unit === 'px' ? _crop.x * scaleX : _crop.x / 100 * imgRef.current.naturalWidth
            const sy = _crop.unit === 'px' ? _crop.y * scaleY : _crop.y / 100 * imgRef.current.naturalHeight
            const sw = _crop.unit === 'px' ? _crop.width * scaleX : _crop.width / 100 * imgRef.current.naturalWidth
            const sh = _crop.unit === 'px' ? _crop.height * scaleY : _crop.height / 100 * imgRef.current.naturalHeight

            if (ctx) {
                // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                ctx.imageSmoothingQuality = 'high';
        
                console.log(sx, sy, sw, sh)
                console.log(canvas.width, canvas.height)
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(
                    imgRef.current,
                    sx,
                    sy,
                    sw,
                    sh,
                    0 + (canvas.width - cropWidth) / 3,
                    0,
                    cropWidth,
                    cropHeight,
                );
                        // Converting to base64
                let base64Image = canvas.toDataURL('image/jpeg');
                if (orientation === Orientation.PORTRAIT) {
                    const _base64Image = await rotateImage(base64Image)
                    base64Image = _base64Image
                }
                onCropChange(base64Image)
            }  
        }
    };

    const toggleOrientation = () => {
        setAspectRatio(1/aspectRatio)
        setOrientation((orientation + 1) % 2)
    }

    return (
        <Column className={styles.imageUploadContainer}>
            {/* <Container padding>
                <Text size={1.1} weight={400}>
                    The recipient will be able to watch the video by scanning the <Text weight={600}>QR Code</Text> on the back of the card
                </Text>
            </Container> */}
            <Container padding>
                <FontAwesomeIcon icon={faCircleInfo} />
                <Column padding={[0, 0.5]}>
                    The edges may be clipped while printing. For best results, leave 0.25" between you text and the edge.
                </Column>
            </Container>
            {imageUrl ? (
                <>
                <Container style={{width: '100%'}}>
                    <Button inverted onClick={toggleOrientation}>
                        Rotate
                    </Button>
                </Container>
                <Container className={styles.imageContainer}>
                    <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={() => cropImageNow()} aspect={aspectRatio} style={{maxHeight: '50vh', maxWidth: '100%'}}>
                        <img ref={imgRef} src={imageUrl} className={styles.image} onLoad={handleLoad}/>
                    </ReactCrop>
                </Container>
                <Container padding={[0.5, 0]}  className={styles.actions} style={{width: '100%'}}>
                    <Button inverted onClick={() => {onImageChange(undefined)}}>
                        upload a different image
                    </Button>
                </Container>
                </>
            ) : (
                <Container padding style={{width: '100%', flexGrow: 1}}>
                    <FileUploadComponent fileType="image" value={image} onChange={handleChange}/>
                </Container>
            )}
        </Column>
    )
}

export default ImageUpload