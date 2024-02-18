import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { sessionId, startTime, apprenticeUserMachines } = req.body;

                let data: any = {
                    endTime: new Date(),
                    duration: Math.floor(new Date().getTime() - new Date(startTime).getTime())
                };

                if (apprenticeUserMachines[0]) {
                    data.apprentice1UMID = apprenticeUserMachines[0].userMachineId;
                }

                if (apprenticeUserMachines[1]) {
                    data.apprentice2UMID = apprenticeUserMachines[1].userMachineId;
                }

                if (apprenticeUserMachines[2]) {
                    data.apprentice3UMID = apprenticeUserMachines[2].userMachineId;
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
                    const userMachine = await prisma.userMachine.update({
                        where: {
                            id: userMachineId
                        },
                        data: {
                            duration: {
                                increment: duration
                            },
                            usageCount: {
                                increment: 1
                            }
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

                    })

                    const user = await prisma.user.update({
                        where: {
                            id: userMachine?.userId
                        },
                        data: {
                            lifetimeDuration: {
                                increment: duration
                            }
                        },
                        select: {
                            lifetimeDuration: true,
                            _count: {
                                select: {
                                    sessions: true
                                }
                            },
                        }
                    })


                    return { userMachine, user };
                }

                const updateUsers = [session.userMachineId, session.apprentice1UMID, session.apprentice2UMID, session.apprentice3UMID]
                    .filter(Boolean) // remove null apprenticeUMIDs
                    .map(async (userMachineId) => {
                        const { userMachine, user } = await updateHours(userMachineId as number, session?.duration as number);
                        return { userMachineDuration: userMachine?.duration, userMachineSessions: userMachine?._count.sessions, userLifetimeDuration: user?.lifetimeDuration, userLifetimeSessions: user?._count.sessions };
                    });

                const results = await Promise.all(updateUsers);

                res.status(200).json({
                    session, userMachineDuration: results[0].userMachineDuration,
                    userMachineSessions: results[0].userMachineSessions,
                    userLifetimeDuration: results[0].userLifetimeDuration,
                    userLifetimeSessions: results[0].userLifetimeSessions
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
