import { useState } from 'react';
import { motion } from 'framer-motion';


const LockScreen = () => {
    const [studentId, setStudentId] = useState<string>("");

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentId(e.target.value);
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(studentId);

        const parsedStudentId = parseInt(studentId);

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({studentId: parsedStudentId}),
            });


        if (response.ok) {
            console.log("student real!");
        } else {
            console.log("student not real!");
        }
    
    }


    return (
        <div className="text-center font-oxygen text-green">
            <form className="mt-[2rem]" onSubmit={handleSubmit}>
                <input
                    type="number"
                    className="w-[40rem] h-[5rem] rounded-lg text-center text-4xl"
                    placeholder="Enter Student Id"
                    onChange={handleInput}
                    value={studentId}
                    />
            </form>
        </div>
    )
}

export default LockScreen;