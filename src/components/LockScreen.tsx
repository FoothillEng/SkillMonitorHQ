import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { BsBackspace } from 'react-icons/bs';
import { AiOutlineEnter } from 'react-icons/ai';

import { signIn } from 'next-auth/react';

interface NumberBoxProps {
    value: number | typeof BsBackspace | typeof AiOutlineEnter;
    onNumberClick: (
        value: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => void;
}

const NumberBox = ({ value, onNumberClick }: NumberBoxProps) => {
    return (
        <div
            className="flex items-center justify-center w-[12rem] h-[8rem] border-4 border-green active:bg-green-400 rounded text-center text-6xl" // Added flex classes
            onClick={() => onNumberClick(value)}
        >
            {typeof value === 'number' ? (
                value
            ) : value === BsBackspace ? (
                <BsBackspace />
            ) : (
                <AiOutlineEnter />
            )}
        </div>
    );
};

const LockScreen = () => {
    const [studentId, setStudentId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleInput = (
        number: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => {
        if (number === BsBackspace) {
            setStudentId((prevValue) => prevValue.slice(0, -1));
        } else if (number === AiOutlineEnter) {
            handleSubmit();
        } else {
            if (studentId.length >= 6) return;
            setStudentId(
                (prevValue) => prevValue + (number as number).toString()
            );
        }
    };

    const handleSubmit = async () => {
        setError('');
        console.log(studentId);

        const parsedStudentId = parseInt(studentId);

        if (!isNaN(parsedStudentId)) {
            await signIn('credentials', {
                studentId: parsedStudentId,
                redirect: false
            }).then((res) => {
                if (res && res.error) {
                    setError('Error signing in, please try again');
                    setStudentId('');
                } else {
                    router.replace('/');
                }
            });
        }
    };

    return (
        <div className="text-center font-oxygen">
            <div className="text-blue-300">
                {studentId === '' ? (
                    <h1 className="text-center text-6xl">
                        Enter your student ID
                    </h1>
                ) : (
                    <h1 className="text-6xl">{studentId}</h1>
                )}
            </div>
            <form
                className="flex items-center justify-center mt-[10rem] text-green"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-3 gap-[3rem]">
                    {Array.from([
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        0,
                        BsBackspace,
                        AiOutlineEnter
                    ]).map((number) => (
                        <NumberBox
                            key={String(number)}
                            value={number}
                            onNumberClick={handleInput}
                        />
                    ))}
                </div>
            </form>
            {error && (
                <div className="mt-[5rem] text-red-500 text-3xl">{error}</div>
            )}
        </div>
    );
};

export default LockScreen;
