import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { User } from '@prisma/client';

import Student from '@/components/Student';

import { AiFillDashboard, AiFillHome } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { FaUserCog } from 'react-icons/fa';
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
                <div className="fixed left-[3rem] top-[20rem] z-40 h-screen w-[33rem] font-oxygen text-white">
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
                                        href="/admin/machine/machineStudents"
                                        icon={FaUserCog}
                                        label="Machine Students"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/machine/addStudent"
                                        icon={FaUserCog}
                                        label="Add Student to Machine"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/student"
                                        icon={FaUsers}
                                        label="All SMHQ Students"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="/admin/student/create"
                                        icon={FaUserEdit}
                                        label="Create Student"
                                        subItem={true}
                                    />
                                    <NavItem
                                        href="admin/student/safetyTest"
                                        icon={FaUserEdit}
                                        label="Create Student"
                                        subItem={true}
                                    />
                                    {session.user?.role === 'TEACHER' && (
                                        <div>
                                            <NavItem
                                                href="/teacher/"
                                                icon={AiFillHome}
                                                label="Teacher Home"
                                            />
                                            <NavItem
                                                href="/admin/machine" // should this be teacher or admin?
                                                icon={FiSettings}
                                                label="Machine Settings"
                                                subItem={true}
                                            />
                                            <NavItem
                                                href="/admin/teacher"
                                                icon={FaUserEdit}
                                                label="New Students"
                                                subItem={true}
                                            />
                                            <NavItem
                                                href="/teacher/settings"
                                                icon={FaUserEdit}
                                                label="SMHQ Settings"
                                                subItem={true}
                                            />
                                        </div>
                                    )}
                                    <div className="mb-[2rem] mt-[1rem] border-t-2 border-blue-300" />
                                </div>
                            )}
                        {user && (
                            <div className="mb-[3rem] ml-[2rem] mt-[2rem]">
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
