import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const { machineUUID } = req.query;

                if (machineUUID) {

                    const machineUsers = await prisma.machine.findUnique({
                        where: {
                            uuid: machineUUID as string
                        },
                        include: {
                            users: { // this is UserMachine[]
                                include: {
                                    user: true,
                                },
                            },
                        }
                    });

                    if (!machineUsers) {
                        res.status(404).json({
                            message: 'Machine not found'
                        });
                        return;
                    }

                    const students = machineUsers?.users.map((user) => ({
                        id: user.user.id,
                        studentId: user.user.studentId,
                        firstName: user.user.firstName,
                        lastName: user.user.lastName,
                        avatar: user.user.avatar,
                        level: user.user.level,
                        lifetimeDuration: user.user.lifetimeDuration,
                        admin: user.user.admin,
                        apprentice: user.apprentice,
                        userMachineId: user.id,
                        duration: user.duration,
                        usageCount: user.usageCount,
                        averageRating: user.averageRating,
                    }));

                    res.status(200).json({
                        students
                    });
                } else {
                    const students = await prisma.user.findMany({
                        select: {
                            id: true,
                            studentId: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            level: true,
                            lifetimeDuration: true,
                            admin: true
                        }
                    });

                    // rename lifetimeDuration to duration
                    students.forEach((student) => {
                        // @ts-ignore adding a new property
                        student.duration = student.lifetimeDuration;
                        if (student.hasOwnProperty('lifetimeDuration')) {
                            delete student['lifetimeDuration' as keyof typeof student];
                        }
                    });

                    res.status(200).json({
                        students
                    });
                }



            } catch (error) {
                console.log(error);
                res.status(400).json({
                    message: 'An error occurred'
                });
            }
            break;
        default: //Method Not Allowed
            res.status(405).end();
            break;
    }
}
