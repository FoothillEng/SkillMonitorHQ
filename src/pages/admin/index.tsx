import { useState } from 'react';
import Link from 'next/link';

import AdminUsers from '@/components/admin/users';

const AdminIndex = (props) => {
    return (
        <div className="flex flex-col items-center font-oxygen text-purple-400">
            <div className="outline outline-4 hover:bg-purple-300 mb-[5rem] p-[2rem] text-8xl ">
                <Link href={'/admin/create'}>New +</Link>
            </div>
            <AdminUsers />
        </div>
    );
};

export default AdminIndex;
