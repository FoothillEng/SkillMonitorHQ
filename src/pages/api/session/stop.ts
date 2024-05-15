import type { NextApiRequest, NextApiResponse } from 'next';

import type { User, StudentLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';

import { findSimilarUserMachines } from '@/pages/api/admin/student/update';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { sessionId, startTime, apprentices } = req.body;

                let data: any = {
                    endTime: new Date(),
                    duration: Math.floor(new Date().getTime() - new Date(startTime).getTime())
                };

                if (apprentices[0]) {
                    data.apprentice1UMID = apprentices[0].apprenticeMachineId;
                }

                if (apprentices[1]) {
                    data.apprentice2UMID = apprentices[1].apprenticeMachineId;
                }

                if (apprentices[2]) {
                    data.apprentice3UMID = apprentices[2].apprenticeMachineId;
                }
                const session = await prisma.session.update({
                    where: { id: sessionId },
                    data: data
                })

                if (!session || session.duration === null) {
                    res.status(500).json({ error: 'Unable to end session.' });
                    return;
                }

                const updateHours = async (userMachineId: number, duration: number) => {
                    const { similarUserMachineIds, userId } = await findSimilarUserMachines(userMachineId) as { similarUserMachineIds: number[]; userId: string };

                    await prisma.userMachine.updateMany({
                        where: {
                            id: {
                                in: similarUserMachineIds
                            }
                        },
                        data: {
                            duration: {
                                increment: duration
                            },
                            usageCount: {
                                increment: 1
                            }
                        },
                    })

                    const userMachine = await prisma.userMachine.findFirst({
                        where: {
                            id: userMachineId
                        },
                        select: {
                            userId: true,
                            duration: true,
                            _count: {
                                select: {
                                    sessions: true
                                }
                            },
                        },
                    });

                    const user = await prisma.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            lifetimeDuration: {
                                increment: duration
                            }
                        },
                        include: {
                            _count: {
                                select: {
                                    sessions: true
                                }
                            },
                        }
                    })


                    return { userMachine, user };
                }


                // check if user has 10 lifetime hours. count how many userMachine relations they have
                const updateLevel = async (user: User) => {
                    if (user.level === 'ADVANCED') return
                    const userMachines = await prisma.userMachine.findMany({
                        where: {
                            userId: user.id,
                            apprentice: {
                                not: {
                                    equals: true
                                }
                            }
                        }
                    });

                    const userMachineCount = userMachines.length;
                    let level: StudentLevel;

                    if ((user.lifetimeDuration >= 108000000) && (userMachineCount >= 10)) {
                        level = 'ADVANCED';
                    } else if ((user.lifetimeDuration >= 36000000) && (userMachineCount >= 3)) { // 3dp + laser cutter + 1 wood machine
                        level = 'INTERMEDIATE';
                    } else {
                        level = 'BEGINNER';
                    }

                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            level: level
                        }
                    });
                }

                const updateUsers = [session.userMachineId, session.apprentice1UMID, session.apprentice2UMID, session.apprentice3UMID]
                    .filter(Boolean) // remove null apprenticeUMIDs
                    .map(async (userMachineId) => {
                        const { userMachine, user } = await updateHours(userMachineId as number, session?.duration as number);
                        await updateLevel(user);
                        return {
                            userMachineDuration: userMachine?.duration,
                            userMachineSessions: userMachine?._count.sessions,
                            userLifetimeDuration: user?.lifetimeDuration,
                            userLifetimeSessions: user?._count.sessions
                        };
                    });

                const results = await Promise.all(updateUsers);
                const curUser = results[0];

                res.status(200).json({
                    session, userMachineDuration: curUser.userMachineDuration,
                    userMachineSessions: curUser.userMachineSessions,
                    userLifetimeDuration: curUser.userLifetimeDuration,
                    userLifetimeSessions: curUser.userLifetimeSessions
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    message: 'A value was provided incorrectly'
                });
            }
            break;
        default: //Method Not Allowed
            res.status(405).end();
            break;
    }
}
