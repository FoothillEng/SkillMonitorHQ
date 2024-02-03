import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { User } from '@prisma/client';

import Student from '@/components/Student';

import { AiFillDashboard, AiFillHome } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { IoIosCreate } from 'react-icons/io';
import { IconType } from 'react-icons';

interface NavItemProps {
    href: string;
    icon: IconType;
    label: string;
    subItem?: boolean;
    onClick?: () => void;
}

const NavItem = ({ href, icon, label, subItem, onClick }: NavItemProps) => {
    const Icon = icon;
    return (
        <Link
            href={href}
            className={`flex items-center rounded-lg p-[2rem] active:bg-blue-400 ${
                subItem ? 'ml-[2rem]' : ''
            }`}
            onClick={onClick}
        >
            <Icon size={'4rem'} />
            <span className="ml-[1.5rem]">{label}</span>
        </Link>
    );
};

const SideNav = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        if (status === 'authenticated') {
            setUser(session.user);
        }
    }, [session?.user, status]);

    // if session then show, else nothing
    return (
        <div>
            {session && (
                <div className="fixed left-[3rem] top-[20rem] z-40 h-screen w-[30rem] font-oxygen text-white">
                    <div className="h-full overflow-y-auto px-3 py-4 text-4xl">
                        <NavItem
                            href="/"
                            icon={AiFillDashboard}
                            label="Dashboard"
                        />
                        <div className="my-[1rem] border-t-2 border-blue-300" />
                        {(session.user?.role === 'TEACHER' ||
                            session.user?.role === 'ADMIN') &&
                            !session?.user.runningSession && (
                                <div>
                                    <NavItem
                                        href="/admin/"
                                        icon={AiFillHome}
                                        label="Admin Home"
                                    />
                                    <NavItem
                                        href="/admin/student"
                                        icon={FaUsers}
                                        label="All Students"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/student/machineStudents"
                                        icon={FaUsers}
                                        label="Machine Students"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/student/create"
                                        icon={IoIosCreate}
                                        label="Create Student"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/machine"
                                        icon={FiSettings}
                                        label="Settings"
                                        subItem={true}
                                    />
                                    <div className="mb-[2rem] mt-[1rem] border-t-2 border-blue-300" />
                                </div>
                            )}
                        {user && (
                            <div className="ml-[2rem]">
                                <Student
                                    student={user}
                                    viewId={false}
                                    col={false}
                                />
                            </div>
                        )}

                        <NavItem
                            href="#"
                            icon={BiLogOut}
                            label="Logout"
                            onClick={() => signOut()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;
