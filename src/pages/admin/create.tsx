import { useState } from 'react';
import { FormEvent } from 'react';

// import { signIn } from 'next-auth/react';

import { CldUploadWidget } from 'next-cloudinary';

// TOD

interface AlphanumericInputProps {
    title: string;
    _title: string;
    type: 'text' | 'number';
    onChange: (title: string, value: string) => void;
}
const AlphanumericInput = ({
    title,
    _title,
    type,
    onChange
}: AlphanumericInputProps) => {
    const [value, setInput] = useState('');

    const handleFieldValueChange = (value: string) => {
        setInput(value);
        onChange(_title, value);
    };
    return (
        <div className="flex flex-col">
            <label className="text-center text-3xl" htmlFor={_title}>
                {title}
            </label>
            <input
                className="w-full h-full border-4 border-green rounded text-center text-6xl"
                name={_title}
                type={type}
                onChange={(e) => handleFieldValueChange(e.target.value)}
                value={value}
            />
        </div>
    );
};

interface ImageInputProps {
    title: string;
    _title: string;
    onChange: (title: string, value: string) => void;
}
const ImageInput = ({ title, _title, onChange }: ImageInputProps) => {
    const [imageUploaded, setImageUploaded] = useState();

    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
        onChange(_title, event.target.files[0]);
    };

    return (
        <div className="flex flex-col">
            <label className="text-center text-3xl" htmlFor={_title}>
                {title}
            </label>
            <input
                onChange={handleChange}
                accept=".jpg, .png, .gif, .jpeg"
                type="file"
                // value={imageUploaded}
            />
        </div>
    );
};

const CreateUser = (props) => {
    const [formData, setFormData] = useState({
        studentId: 0,
        firstName: '',
        lastName: '',
        avatar: ''
    });
    const [onError, setOnError] = useState(false);
    const [rs, setResults] = useState('');

    const handleFieldValueChange = (title: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [title]: value
        }));
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        // change studentId to number
        let formDataCopy = { ...formData };
        formDataCopy.studentId = parseInt(
            formData.studentId as unknown as string
        );

        const res = await fetch('/api/admin/createStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataCopy)
        });
        const data = await res.json();
        console.log(data); //handle error
    }

    return (
        <div className="flex items-center justify-center text-pink-500">
            <form onSubmit={handleSubmit} className="mt-[5rem]">
                <h1 className="text-center text-9xl mb-[5rem]">
                    Register New Student
                </h1>
                <div className="grid gap-4 grid-cols-2 ">
                    <AlphanumericInput
                        _title="studentId"
                        title="Student ID"
                        type="number"
                        onChange={handleFieldValueChange}
                    />
                    <AlphanumericInput
                        _title="firstName"
                        title="First Name"
                        type="text"
                        onChange={handleFieldValueChange}
                    />
                    <AlphanumericInput
                        _title="lastName"
                        title="Last Name"
                        type="text"
                        onChange={handleFieldValueChange}
                    />
                    {/* <ImageInput
                        _title="avatar"
                        title="Avatar"
                        onChange={handleFieldValueChange}
                    /> */}
                    <CldUploadWidget
                        signatureEndpoint="/api/admin/sign"
                        uploadPreset="ml_default"
                        options={{
                            maxFileSize: 5000000,
                            croppingAspectRatio: 1,
                            singleUploadAutoClose: true,
                            showPoweredBy: false,
                            showUploadMoreButton: false
                        }}
                        onSuccess={(result) => {
                            handleFieldValueChange(
                                'avatar',
                                result.info.secure_url
                            );
                            setResults(result.info.secure_url);
                        }}
                    >
                        {({ open }) => {
                            function handleOnClick(e) {
                                e.preventDefault();
                                open();
                            }

                            return (
                                <div>
                                    <button
                                        className="button"
                                        onClick={handleOnClick}
                                    >
                                        Upload an Image
                                    </button>
                                </div>
                            );
                        }}
                    </CldUploadWidget>
                </div>
                <div className="text-center text-3xl mt-5">{rs}</div>
                <button
                    className="flex items-center mt-64 mx-auto cursor-pointer mb-2 p-2"
                    type="submit"
                >
                    <div className="text-9xl hollow-text-3 text-center hover:bg-slate-400">
                        Submit
                    </div>
                </button>
            </form>
        </div>
    );
};

export default CreateUser;
