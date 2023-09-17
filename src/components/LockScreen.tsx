import React, { useState } from 'react';

import { BsBackspace } from 'react-icons/bs';
import { AiOutlineEnter } from 'react-icons/ai';

import { CustomToast } from '@/components/ApprenticeView';

interface NumberBoxProps {
    value: number | typeof BsBackspace | typeof AiOutlineEnter;
    onNumberClick: (
        value: number | typeof BsBackspace | typeof AiOutlineEnter
    ) => void;
}

export const NumberBox = ({ value, onNumberClick }: NumberBoxProps) => {
    return (
        <div
            className="flex h-[8rem] w-[12rem] items-center justify-center rounded border-4 border-green text-center text-6xl active:bg-green-400" // Added flex classes
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
    handleSubmit: (studentId: string, setStudentId: any, setError: any) => void;
}

const LockScreen = ({ placeholder, handleSubmit }: LockScreenProps) => {
    const [studentId, setStudentId] = useState<string>('');
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
        <div className="text-center font-oxygen">
            <div className="text-blue-300">
                {studentId === '' ? (
                    <h1 className="text-center text-6xl">{placeholder}</h1>
                ) : (
                    <h1 className="text-6xl">{studentId}</h1>
                )}
            </div>
            <form
                className="mt-[10rem] flex items-center justify-center text-green"
                onSubmit={() => handleSubmit(studentId, setStudentId, setError)}
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
            {error && <CustomToast text={error} />}
        </div>
    );
};

export default LockScreen;
