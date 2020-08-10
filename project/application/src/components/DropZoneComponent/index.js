import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function MyDropzone({ fileHandler, loadedImage, imageUrl, placeholder }) {
    const onDrop = useCallback(acceptedFiles => {
        fileHandler(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="drog-ang-drop">
            <input {...getInputProps()} />
            {!loadedImage && imageUrl === null && <span>{placeholder}</span>}
            {imageUrl === '' && !loadedImage && <span>{placeholder}</span>}
        </div>
    );
}
