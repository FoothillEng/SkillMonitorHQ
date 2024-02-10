import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/router';

import { CldUploadWidget } from 'next-cloudinary';

import { FaCheck, FaTimes } from 'react-icons/fa';

import Title from '@/components/Title';
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

    return <LockScreen placeholder="Type ID Below" handleSubmit={submit} />;
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
    const [confirmStudent, setConfirmStudent] = useState(false);
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
            setErrorMessage('Student already exists in system with ID');
        } else {
            setErrorMessage('Student does not exist with given ID');
        }
    };

    const handleSubmit = useCallback(async () => {
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
        if (formData.studentId && formData.firstName && formData.avatar) {
            handleSubmit();
        }
    }, [formData.studentId, formData.firstName, formData.avatar, handleSubmit]);

    const handleConfirmStudent = (value: boolean) => {
        setConfirmStudent(value);
        if (!value) {
            setStudentExists(false);
            setFormData({
                // reset because student was not confirmed
                studentId: 0,
                firstName: '',
                lastName: '',
                avatar: ''
            });
        }
    };

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-secondary">
            <div className="mb-[2rem]">
                <Title title="Register a new student to SMHQ" />
                <div className="flex flex-col items-center space-y-[5rem]">
                    {!studentExists ? (
                        <div>
                            <div className="mb-[8rem] border-4 border-primary p-[1rem] text-center text-5xl text-primary">
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
                            {!confirmStudent ? (
                                <div>
                                    <div className="mb-[8rem] border-4 border-primary p-[1rem] text-center text-5xl text-primary">
                                        Step #2: Confirm Student Name
                                    </div>
                                    <div
                                        id="studentInfo"
                                        className="mb-[4rem] text-center text-8xl text-primary"
                                    >
                                        {formData.firstName} {formData.lastName}
                                        <div className="mt-[15rem] flex flex-row justify-around">
                                            <div className="border-[1rem] border-green p-[3rem] ">
                                                <FaCheck
                                                    size={'7rem'}
                                                    className="text-center text-green"
                                                    onClick={() =>
                                                        handleConfirmStudent(
                                                            true
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="border-[1rem] border-red p-[3rem] ">
                                                <FaTimes
                                                    size={'7rem'}
                                                    className="text-red"
                                                    onClick={() =>
                                                        handleConfirmStudent(
                                                            false
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div id="uploadAvatar">
                                    <div className="mb-[8rem] border-4 border-primary p-[1rem] text-center text-5xl text-primary">
                                        Step #3: Upload Student Avatar
                                    </div>
                                    <div className="mb-[4rem] text-center text-8xl text-primary">
                                        {formData.firstName} {formData.lastName}
                                    </div>
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
                                            } else {
                                                setErrorMessage(
                                                    'Error uploading avatar'
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
                                                        className="h-[8rem] w-[50rem] rounded-full border-4 border-primary text-center text-6xl"
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
                            )}
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
