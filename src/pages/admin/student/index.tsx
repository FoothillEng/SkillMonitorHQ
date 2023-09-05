import Link from 'next/link';

import ListStudents from '@/components/admin/students';

const AdminStudentsIndex = (props) => {
    return (
        <div className="flex flex-col items-center w-screen font-oxygen text-green">
            <div className="outline outline-4 active:bg-purple-300 mb-[5rem] p-[2rem] text-4xl ">
                <Link href={'/admin/create'}>New Student</Link>
            </div>
            <ListStudents />
        </div>
    );
};

export default AdminStudentsIndex;
