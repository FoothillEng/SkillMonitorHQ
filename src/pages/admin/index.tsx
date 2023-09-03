import { useState } from 'react';
import Link from 'next/link';

import AdminUsers from '@/components/admin/users';

const AdminIndex = (props) => {
    return (
        <div className="flex flex-col items-center font-oxygen text-purple-400">
            <div className="outline outline-4 active:bg-purple-300 mb-[5rem] p-[2rem] text-4xl ">
                <Link href={'/admin/create'}>New +</Link>
            </div>
            <div className="outline outline-4 active:bg-purple-300 mb-[5rem] p-[2rem] text-4xl ">
                <Link href={'/admin/machine'}>Edit Settings</Link>
            </div>
            <AdminUsers />
        </div>
    );
};

export default AdminIndex;
