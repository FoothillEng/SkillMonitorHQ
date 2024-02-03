import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import { CldUploadWidget } from 'next-cloudinary';

import LockScreen from '@/components/LockScreen';

interface StudentIdInputProps {
    handleSubmit: (value: string) => void;
}

export const StudentIdInput = ({ handleSubmit }: StudentIdInputProps) => {
    const submit = async (studentId: string) => {
        const parsedStudentId = parseInt(studentId);

        if (isNaN(parsedStudentId)) handleSubmit('0');
        else handleSubmit(parsedStudentId.toString());
    };

    return <LockScreen placeholder="12345" handleSubmit={submit} />;
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
            setErrorMessage('');
            setStudentExists(true);
        } else if (res.status === 409) {
            setErrorMessage('Student in system with that ID');
        } else {
            setErrorMessage('Student does not exist with given ID');
        }
    };

    const handleSubmit = useCallback(async () => {
        const checkIfFormIsFilled = async () => {
            console.log(formData);
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

        if (!(await checkIfFormIsFilled())) return;
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
    }, [formData, router, studentExists]);

    useEffect(() => {
        if (formData.studentId && !formData.firstName) {
            handleSubmit();
        }
    }, [formData.studentId, formData.firstName, handleSubmit]);

    return (
        <div className="flex w-screen flex-col items-center text-secondary">
            <div className="mt-[2rem]">
                <h1 className="mb-[3rem] text-center text-8xl">
                    Register New Student to SMHQ
                </h1>
                <div className="flex flex-col items-center space-y-[3rem]">
                    {!studentExists ? (
                        <div>
                            <div className="mb-[3rem] text-center text-5xl text-primary">
                                Step #1: Enter Student ID
                            </div>
                            <StudentIdInput
                                handleSubmit={(value) => {
                                    handleFieldValueChange('studentId', value);
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="mb-[3rem] text-center text-5xl text-primary">
                                Step #2: Confirm Student Information and Upload
                                Avatar
                            </div>
                            <div className="mb-[4rem] text-center text-5xl text-primary">
                                {formData.firstName} {formData.lastName}
                            </div>
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
                                                (
                                                    result.info as {
                                                        secure_url: string;
                                                    }
                                                ).secure_url
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
                                                    className="h-[6rem] w-[50rem] rounded-full border-4 border-primary bg-white text-center text-6xl"
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
                    )}
                </div>
            </div>
            {errorMessage && (
                <div className="mt-[5rem] text-3xl text-red-500">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default CreateUser;
