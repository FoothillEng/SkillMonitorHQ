import { useState } from 'react';
import Link from 'next/link';

import AdminUsers from '@/components/admin/users';

const AdminIndex = (props) => {
    const [clicked, setClicked] = useState<boolean>(false);

    return (
        <div className="w-screen flex flex-col items-center justify-center font-oxygen text-purple-400">
            <Link
                href={'/admin/create'}
                className="text-8xl hover:bg-slate-400"
            >
                create new student +
            </Link>
            <AdminUsers />
        </div>
    );
};

export default AdminIndex;
