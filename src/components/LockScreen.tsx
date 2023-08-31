import React, { useState } from 'react';
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

    const handleInput = (
        number: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => {
        // limit to 6 digits
        if (studentId.length >= 6) return;
        if (number === BsBackspace) {
            setStudentId((prevValue) => prevValue.slice(0, -1));
        } else if (number === AiOutlineEnter) {
            handleSubmit();
        } else {
            setStudentId(
                (prevValue) => prevValue + (number as number).toString()
            );
        }
    };

    const handleSubmit = async () => {
        console.log(studentId);

        const parsedStudentId = parseInt(studentId);

        if (!isNaN(parsedStudentId)) {
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ studentId: parsedStudentId })
            // });
            await signIn('credentials', {
                studentId: parsedStudentId,
                callbackUrl: '/index2'
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
        </div>
    );
};

export default LockScreen;
