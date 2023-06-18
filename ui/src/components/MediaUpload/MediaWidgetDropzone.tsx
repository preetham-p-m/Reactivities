import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface MediaWidgetDropzoneProps {
    setFiles: (files: any) => void;
}

const MediaWidgetDropzone = ({ setFiles }: MediaWidgetDropzoneProps) => {
    const dzStyle = {
        border: "dashed 3px #eee",
        borderColor: "#eee",
        borderRadius: "5px",
        padding: "30px",
        textAlign: "center" as "center",
        heignt: 200
    }

    const dzActive = {
        borderColor: "green"
    }

    const onDrop = useCallback((acceptedFiles: any) => {
        setFiles(acceptedFiles.map((file: any) =>
            Object.assign(
                file,
                {
                    preview: URL.createObjectURL(file)
                }
            )));
    }, [setFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}
            style={isDragActive
                ? { ...dzStyle, ...dzActive }
                : { ...dzStyle }}
        >
            <input {...getInputProps()} />
            <Icon name="upload" size="huge" />
            <Header content="Drop image here"/>
        </div>
    )
}

export default MediaWidgetDropzone;