import { useState } from 'react';

const AdminStudentsIndex = (props) => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // make this a toast

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch('/api/admin/teacher/updateStudentBody', {
            method: 'POST',
            body: formData
        })
            .then((res) => {
                if (res.status === 200) {
                    setSuccessMessage('File uploaded successfully');
                } else {
                    setError('Error uploading file');
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="flex w-screen flex-col items-center text-center font-oxygen text-green">
            <div className="text-7xl">Teacher Dashboard</div>
            <div className="mb-[2rem]">
                <div className="flex flex-col items-center">
                    <div className="mt-[3rem] w-[90rem] text-5xl">
                        Upload CSV File of this years students. Include the
                        header column. The columns should be in the following
                        order: id, first_name, last_name.
                    </div>
                    <div>
                        <div className="ml-[15rem] mt-[5rem] text-3xl">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => handleFileUpload(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {successMessage && (
                <div className="text-4xl text-green">{successMessage}</div>
            )}
            {error && <div className="text-4xl text-red-500">{error}</div>}
        </div>
    );
};

export default AdminStudentsIndex;
