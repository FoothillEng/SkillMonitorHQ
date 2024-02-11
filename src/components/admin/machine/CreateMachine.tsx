import { useState } from 'react';
import { useRouter } from 'next/router';

interface CreateMachineProps {
    setReload: (reload: boolean) => void;
}

const CreateMachine = ({ setReload }: CreateMachineProps) => {
    const [machineName, setMachineName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleFieldValueChange = (value: string) => {
        setMachineName(value);
    };

    const checkIfFormIsFilled = () => {
        if (machineName) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!checkIfFormIsFilled()) return;

        await fetch('/api/admin/machine/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ machineName })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status.toString());
                }
            })
            .then(() => {
                setReload(true);
                setMachineName('');
            })
            .catch((error) => {
                if (error.message === '403') {
                    setErrorMessage('Machine already exists with that name');
                } else {
                    setErrorMessage('Please fill out all fields correctly');
                }
            });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mt-[5rem]">
                <div className="mb-[3rem] text-center text-6xl">
                    Register New Machine For the System
                </div>
                <div className="flex justify-center">
                    <input
                        className="h-[6rem] w-[50rem] rounded-full border-4 border-secondary text-center text-6xl text-primary"
                        type="text"
                        onChange={(e) => handleFieldValueChange(e.target.value)}
                        placeholder="Machine Name"
                    />
                </div>
                <button
                    className="mx-auto mb-2 mt-[3rem] flex items-center p-2"
                    onClick={handleSubmit}
                >
                    <div className="p-4 text-center text-5xl outline outline-4 active:bg-slate-400">
                        Submit
                    </div>
                </button>
            </div>
            {errorMessage && (
                <div className="mt-[5rem] text-3xl text-red-500">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default CreateMachine;
