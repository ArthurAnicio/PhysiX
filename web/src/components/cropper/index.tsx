import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import styles from './Cropper.module.css';

interface CropperProps {
    image: File | null;
    setImage: (croppedBlob: Blob) => void;
    cancelFunction: () => void;
}

const AvatarCropper: React.FC<CropperProps> = ({ image, setImage, cancelFunction }) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);
    const [imagePreview, setImagePreview] = useState<string|null>(null);
    
    useEffect(() =>{
        if (image) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(image);
        }
    }, [image])

    useEffect(() => {
        if (imagePreview && imageRef.current) {
          cropperRef.current = new Cropper(imageRef.current, {
            aspectRatio: 1, 
            viewMode: 2,
            autoCropArea: 1,
            responsive: true,
          });
    
          return () => {
            cropperRef.current?.destroy();
            cropperRef.current = null;
          };
        }
      }, [imagePreview]);

      const handleCrop = () => {
        if (cropperRef.current) {
          const croppedCanvas = cropperRef.current.getCroppedCanvas();
          croppedCanvas.toBlob((blob) => {
            if (blob) {
              setImage(blob);
            }
          }, 'image/jpeg');
        }
      };


      if (!imagePreview) {
        return null;
      }
    

      return (
        <div id={styles.fullwindow}>
            <div id={styles.cropperwindow}>
                <img ref={imageRef} src={imagePreview} className={styles.imagepreview}/>
                
            </div>
            <div id={styles.cropperbuttoncontainer}>
                <button onClick={cancelFunction} id={styles.cropperbutton}>Cancelar</button>
                <button onClick={handleCrop} id={styles.cropperbutton}>Cortar</button>
            </div>
        </div>
      );
}
export default AvatarCropper;
