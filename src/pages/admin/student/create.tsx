import { useState } from 'react';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';

import { CldUploadWidget } from 'next-cloudinary';

interface AlphanumericInputProps {
    title: string;
    _title: string;
    parentValue: string;
    setParentValue: (value: string) => void;
    type: 'text' | 'number' | 'file';
    style?: string;
    readOnly?: boolean;
    onChange: (title: string, value: string) => void;
}
export const AlphanumericInput = ({
    title,
    _title,
    parentValue,
    setParentValue,
    type,
    style,
    readOnly,
    onChange
}: AlphanumericInputProps) => {
    const [input, setInput] = useState('');

    const handleFieldValueChange = (value: string) => {
        if (type === 'number') {
            if (value.length > 6) return;
        }

        setParentValue(value);

        onChange(_title, value);
    };
    return (
        <div className="flex flex-col items-center justify-center">
            <input
                className={`h-[6rem] rounded-full border-4 border-green text-center text-6xl ${style}`}
                type={type}
                onChange={(e) => handleFieldValueChange(e.target.value)}
                placeholder={`Enter ${title} here`}
                value={parentValue}
                readOnly={readOnly}
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
    const [studentExists, setStudentExists] = useState(false);
    const router = useRouter();

    const handleFieldValueChange = (title: string, value: string) => {
        if (title === 'studentId') {
            setStudentExists(false);
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [title]: value
        }));
    };

    const fetchStudent = async (studentId: number) => {
        const res = await fetch('/api/admin/student/getId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId })
        });
        const data = await res.json();

        if (data.firstName) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                firstName: data.firstName,
                lastName: data.lastName
            }));
            console.log(formData);
            setErrorMessage('');
            setStudentExists(true);
        } else {
            setErrorMessage('Student does not exist with given ID');
        }
    };

    const checkIfFormIsFilled = async () => {
        if (!formData.studentId) {
            setErrorMessage('Please enter student ID');
            return false;
        } else {
            if (studentExists) {
                if (formData.avatar) {
                    return true;
                } else {
                    setErrorMessage('Please upload student avatar');
                    return false;
                }
            } else {
                if (formData.studentId.toString().length < 5) {
                    setErrorMessage(
                        'Student ID has to be greater than 4 digits'
                    );
                    return false;
                } else {
                    await fetchStudent(formData.studentId);
                    return false;
                }
            }
        }
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!(await checkIfFormIsFilled())) return;
        console.log('running');

        await fetch('/api/admin/student/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status.toString());
                }
            })
            .then(() => router.push('/admin/student/'))
            .catch((error) => {
                if (error.message === '403') {
                    setErrorMessage('Student already exists with that ID');
                } else {
                    setErrorMessage('Please fill out all fields correctly');
                }
            });
    }

    return (
        <div className="flex w-screen flex-col items-center text-green">
            <form onSubmit={handleSubmit} className="mt-[5rem]">
                <h1 className="mb-[10rem] text-center text-9xl">
                    Register New Student for this System
                </h1>
                <div className="flex flex-col space-y-[3rem]">
                    <AlphanumericInput
                        _title="studentId"
                        title="Student ID"
                        parentValue={formData.studentId.toString()}
                        setParentValue={(value) =>
                            handleFieldValueChange('studentId', value)
                        }
                        type="number"
                        style="w-[50rem]"
                        onChange={handleFieldValueChange}
                    />
                    <AlphanumericInput
                        _title="firstName"
                        title="First Name"
                        parentValue={formData.firstName}
                        setParentValue={(value) =>
                            handleFieldValueChange('firstName', value)
                        }
                        type="text"
                        style="w-[50rem]"
                        readOnly={true}
                        onChange={handleFieldValueChange}
                    />
                    <AlphanumericInput
                        _title="lastName"
                        title="Last Name"
                        parentValue={formData.lastName}
                        setParentValue={(value) =>
                            handleFieldValueChange('lastName', value)
                        }
                        type="text"
                        style="w-[50rem]"
                        readOnly={true}
                        onChange={handleFieldValueChange}
                    />
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
                                if (
                                    result.info &&
                                    typeof result.info === 'object'
                                ) {
                                    handleFieldValueChange(
                                        'avatar',
                                        (result.info as { secure_url: string })
                                            .secure_url
                                    );
                                }
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
                                            className="h-[6rem] w-[50rem] rounded-full border-4 border-green bg-white text-center text-6xl"
                                            onClick={handleOnClick}
                                        >
                                            {formData.avatar
                                                ? 'Avatar uploaded'
                                                : 'Upload Student Avatar'}
                                        </button>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                    </div>
                </div>
                <button
                    className="mx-auto mb-2 mt-64 flex cursor-pointer items-center p-2"
                    type="submit"
                >
                    <div className="hollow-text-3 text-center text-9xl active:bg-slate-400">
                        {formData.studentId
                            ? studentExists
                                ? formData.avatar
                                    ? 'Submit'
                                    : 'Click Upload Student Avatar'
                                : 'Get Student'
                            : 'Enter Student ID'}
                    </div>
                </button>
            </form>
            {errorMessage && (
                <div className="mt-[5rem] text-3xl text-red-500">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default CreateUser;
