import Link from 'next/link';
import { FormEvent } from 'react';
import { signIn } from 'next-auth/react';

// TOD

export default function Register(props) {
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        let rawStudentId = form.get('studentId');
        if (!rawStudentId) return;
        const studentId = parseInt(rawStudentId as string);
        console.log(studentId);
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId
            })
        });
        const data = await res.json();
        if (!data.user) return null;
        await signIn('credentials', {
            studentId: studentId,
            callbackUrl: '/index2'
        });
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <label htmlFor="studentId">studentId:</label>
                <input type="text" id="studentId" name="studentId" required />
                <button type="submit">Submit</button>
            </form>
            <p>
                Already registered? <Link href="/login">Login here</Link>
            </p>
        </div>
    );
}
