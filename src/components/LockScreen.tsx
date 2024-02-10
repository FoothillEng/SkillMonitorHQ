import React, { useState } from 'react';

import { BsBackspace } from 'react-icons/bs';
import { AiOutlineEnter } from 'react-icons/ai';

interface NumberBoxProps {
    value: number | typeof BsBackspace | typeof AiOutlineEnter;
    onNumberClick: (
        value: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => void;
}

export const NumberBox = ({ value, onNumberClick }: NumberBoxProps) => {
    return (
        <div
            className="flex h-[20rem] w-[20rem] items-center justify-center rounded border-[1rem] border-primary text-center text-9xl active:bg-primary md:h-[12rem] md:w-[12rem] md:text-6xl" // Added flex classes
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

interface LockScreenProps {
    placeholder: string;
    start?: string;
    handleSubmit: (studentId: string, setStudentId: any, setError: any) => void;
}

const LockScreen = ({ placeholder, start, handleSubmit }: LockScreenProps) => {
    const [studentId, setStudentId] = useState<string>(start || '');
    const [error, setError] = useState<string>('');

    const handleInput = (
        number: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => {
        if (number === BsBackspace) {
            setStudentId((prevValue) => prevValue.slice(0, -1));
        } else if (number === AiOutlineEnter) {
            handleSubmit(studentId, setStudentId, setError);
        } else {
            if (studentId.length >= 6) return;
            setStudentId(
                (prevValue) => prevValue + (number as number).toString()
            );
        }
    };

    return (
        <div
            id="NumPad"
            className="text-center font-oxygen text-7xl md:text-7xl"
        >
            <div className="text-secondary-200">
                {studentId === '' ? (
                    <h1 className="text-center">{placeholder}</h1>
                ) : (
                    <h1>{studentId}</h1>
                )}
            </div>
            <div className="mt-[5rem] flex items-center justify-center text-primary">
                <div className="grid grid-cols-3 gap-[5rem] md:gap-[1.5rem]">
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
                        BsBackspace,
                        0,
                        AiOutlineEnter
                    ]).map((number) => (
                        <NumberBox
                            key={String(number)}
                            value={number}
                            onNumberClick={handleInput}
                        />
                    ))}
                </div>
            </div>
            {error && (
                <p className="mt-[2rem] text-5xl text-red-500">{error}</p>
            )}
        </div>
    );
};

export default LockScreen;
