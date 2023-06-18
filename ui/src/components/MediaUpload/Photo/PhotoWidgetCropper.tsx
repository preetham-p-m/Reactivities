import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css"

interface PhotoWidgetCropperProps {
    imagePreview: string,
    setCropper: (cropper: Cropper) => void;
}

const PhotoWidgetCropper = ({ imagePreview, setCropper }: PhotoWidgetCropperProps) => {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview={".img-preview"}
            guides={false}
            viewMode={2}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    );
}

export default PhotoWidgetCropper;