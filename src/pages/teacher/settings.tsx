import { useState } from 'react';

import type { Machine } from '@prisma/client';

import Title from '@/components/Title';
import ListMachines from '@/components/admin/machine/ListMachines';

const TeacherSettingsIndex = (props) => {
    const [error1, setError1] = useState('');
    const [successMessage1, setSuccessMessage1] = useState(''); // make this a toast

    const [selectedMachine, setSelectedMachine] = useState<Machine>();
    const [error2, setError2] = useState('');
    const [successMessage2, setSuccessMessage2] = useState(''); // make this a toast

    const handleFileUpload = (
        e,
        link: string,
        setSuccess: (string) => void,
        setError: (string) => void
    ) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (selectedMachine) {
            formData.append('machineId', selectedMachine.id.toString());
        }

        fetch(link, {
            method: 'POST',
            body: formData
        })
            .then((res) => {
                if (res.status === 200) {
                    setSuccess('File uploaded successfully');
                } else {
                    setError('Error uploading file');
                }
            })
            .catch((error) => console.error(error));
    };

    const handleChooseMachine = (machine: Machine) => {
        setSelectedMachine(machine);
    };

    return (
        <div className="flex w-screen flex-col items-center text-center font-oxygen text-white">
            <Title title="Teacher Settings" />
            <div className="flex flex-col">
                <div className="flex flex-col items-center">
                    <div className="mt-[3rem] text-6xl text-secondary">
                        Change Student Body Population
                    </div>
                    <div className="mt-[3rem] w-[90rem] text-5xl text-primary">
                        Upload CSV File for this year{`'`}s students. Include
                        the header column. The columns should be in the
                        following order: studentId, firstName, lastName.
                    </div>
                    <div>
                        <div className="ml-[15rem] mt-[5rem] text-3xl">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) =>
                                    handleFileUpload(
                                        e,
                                        '/api/teacher/updateStudentBody',
                                        setSuccessMessage1,
                                        setError1
                                    )
                                }
                            />
                        </div>
                    </div>
                    {successMessage1 && (
                        <div className="text-4xl text-green">
                            {successMessage1}
                        </div>
                    )}
                    {error1 && (
                        <div className="text-4xl text-red-500">{error1}</div>
                    )}
                </div>
                <div className="flex w-[200rem] flex-col items-center">
                    <div className=" mt-[10rem] text-6xl text-secondary">
                        Change Test Questions for
                        <span
                            className={
                                selectedMachine ? 'text-secondary-400' : ''
                            }
                        >
                            {selectedMachine
                                ? ` ${selectedMachine.name}`
                                : ' A Machine'}
                        </span>
                    </div>
                    {!selectedMachine ? (
                        <div>
                            <div className="my-[3rem] text-5xl text-primary">
                                Choose the machine you want to update the
                                questions for:
                            </div>
                            <ListMachines
                                reload={false}
                                setReload={() => {}}
                                highlight={false}
                                handleOnClick={handleChooseMachine}
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="mt-[3rem] w-[90rem] text-5xl text-primary">
                                Upload CSV File for {selectedMachine.name}
                                {`'`}s test questions. Include the header
                                column. The columns should be in the following
                                order: id, text, choice1, choice2, choice3,
                                choice4, correctChoice,
                            </div>
                            <div>
                                <div className="ml-[15rem] mt-[5rem] text-3xl">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) =>
                                            handleFileUpload(
                                                e,
                                                '/api/teacher/updateTestQuestions',
                                                setSuccessMessage2,
                                                setError2
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage2 && (
                        <div className="text-4xl text-green">
                            {successMessage2}
                        </div>
                    )}
                    {error2 && (
                        <div className="text-4xl text-red-500">{error2}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherSettingsIndex;
