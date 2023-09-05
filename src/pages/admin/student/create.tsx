import { useState } from 'react';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';

import { CldUploadWidget } from 'next-cloudinary';

interface AlphanumericInputProps {
    title: string;
    _title: string;
    type: 'text' | 'number';
    style?: string;
    onChange: (title: string, value: string) => void;
}
export const AlphanumericInput = ({
    title,
    _title,
    type,
    style,
    onChange
}: AlphanumericInputProps) => {
    const [input, setInput] = useState('');

    const handleFieldValueChange = (value: string) => {
        if (type === 'number') {
            if (value.length > 6) return;
        }
        setInput(value);
        onChange(_title, value);
    };
    return (
        <div className={`flex flex-col items-center justify-center ${style}`}>
            <input
                className="w-[50rem] h-[6rem] border-4 border-green rounded-full text-center text-6xl"
                type={type}
                onChange={(e) => handleFieldValueChange(e.target.value)}
                placeholder={`Enter ${title} here`}
                value={input}
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
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleFieldValueChange = (title: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [title]: value
        }));
    };

    const checkIfFormIsFilled = () => {
        if (
            formData.studentId &&
            formData.firstName &&
            formData.lastName &&
            formData.avatar
        ) {
            return true;
        } else {
            setErrorMessage('Please fill out all fields');
            return false;
        }
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!checkIfFormIsFilled()) return;

        // change studentId to number
        let formDataCopy = { ...formData };
        formDataCopy.studentId = parseInt(
            formData.studentId as unknown as string
        );

        await fetch('/api/admin/createStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataCopy)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status.toString());
                }
            })
            .then(() => router.push('/admin/students'))
            .catch((error) => {
                if (error.message === '403') {
                    setErrorMessage('Student already exists with that ID');
                } else {
                    setErrorMessage('Please fill out all fields correctly');
                }
            });
    }

    return (
        <div className="flex flex-col items-center w-screen text-green">
            <form onSubmit={handleSubmit} className="mt-[5rem]">
                <h1 className="text-center text-9xl mb-[10rem]">
                    Register New Student
                </h1>
                <div className="flex flex-col space-y-[3rem]">
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
                    <div className="">
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
                            }}
                        >
                            {({ open }) => {
                                function handleOnClick(e) {
                                    e.preventDefault();
                                    open();
                                }

                                return (
                                    <div className="flex flex-col items-center justify-center">
                                        <button
                                            className="w-[50rem] h-[6rem] border-4 border-green bg-white rounded-full text-center text-6xl"
                                            onClick={handleOnClick}
                                        >
                                            Upload Student Avatar
                                        </button>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                    </div>
                </div>
                <button
                    className="flex items-center mt-64 mx-auto cursor-pointer mb-2 p-2"
                    type="submit"
                >
                    <div className="text-9xl hollow-text-3 text-center active:bg-slate-400">
                        Submit
                    </div>
                </button>
            </form>
            {errorMessage && (
                <div className="mt-[5rem] text-red-500 text-3xl">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default CreateUser;
