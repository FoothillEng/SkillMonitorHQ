import { useState } from 'react';
import { useRouter } from 'next/router';

import { AlphanumericInput } from '@/pages/admin/student/create';

interface CreateMachineProps {
    setReload: (reload: boolean) => void;
}

const CreateMachine = ({ setReload }: CreateMachineProps) => {
    const [machineName, setMachineName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleFieldValueChange = (title: string, value: string) => {
        setMachineName(value);
    };

    const checkIfFormIsFilled = () => {
        if (machineName) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = async (e) => {
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
                router.push('/admin/machine');
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
        <div className="flex flex-col items-center justify-center text-green">
            <form onSubmit={handleSubmit} className="mt-[5rem]">
                <h1 className="text-center text-6xl mb-[3rem]">
                    Register New Machine
                </h1>
                <div className="flex justify-center">
                    <AlphanumericInput
                        _title="machineName"
                        title="Machine Name"
                        type="text"
                        style="w-[20rem]"
                        onChange={handleFieldValueChange}
                    />
                </div>
                <button
                    className="flex items-center mt-[3rem] mx-auto mb-2 p-2"
                    type="submit"
                >
                    <div className="text-5xl outline outline-4 p-4 text-center active:bg-slate-400">
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

export default CreateMachine;
