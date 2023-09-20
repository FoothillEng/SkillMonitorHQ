import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

export default function MassCreate(props) {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a CSV file to import.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/admin/student/massCreate', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                router.push('/admin/student');
            } else {
                setErrorMessage('A value was invalid. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('A value was invalid. Please try again.');
        }
    };

    return (
        <div className="flex w-screen flex-col items-center justify-center text-green">
            <form onSubmit={handleSubmit} className="mt-[5rem]">
                <h1 className="mb-[10rem] text-center text-9xl">
                    Upload CSV File to Create Students
                </h1>
                <div className="flex flex-row items-center justify-center">
                    <div className="text-4xl">Select CSV file:</div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
                <button
                    className="mx-auto mb-2 mt-64 flex cursor-pointer items-center p-2"
                    type="submit"
                >
                    <div className="hollow-text-3 text-center text-9xl active:bg-slate-400">
                        Submit
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
}
