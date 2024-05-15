import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            const { userId = 0, machineUUID = '', isFirstLogin = false }: { userId?: number; machineUUID?: string; isFirstLogin?: boolean } = req.query;

            if (!userId || !machineUUID || !isFirstLogin) {
                res.status(400).json({ error: 'Missing parameters.' });
                return;
            }

            const isLoginSession = ((isFirstLogin + '').toLowerCase() === 'true')

            try {
                // Check if the user is allowed to use the machine
                await prisma.userMachine.findFirst({
                    where: {
                        userId: userId.toString(),
                        machineUUID: machineUUID.toString(),
                    },
                    select: {
                        id: true,
                        machineId: true,
                        apprentice: true,
                        duration: true,
                        averageRating: true,
                        _count: {
                            select: {
                                sessions: true
                            }
                        },
                    },
                }).then(async (userMachine) => {
                    if (userMachine && !userMachine.apprentice) {
                        const lastUserLogin = await prisma.userLogin.findFirst({
                            where: {
                                machineId: userMachine.machineId,
                                isLoginSession: true,
                                rated: false,
                                NOT: {
                                    userId: userId.toString()
                                }
                            },
                            orderBy: {
                                loginTime: 'desc'
                            }
                        })
                        console.log('lastLogin', lastUserLogin)

                        await prisma.userLogin.create({
                            data: {
                                userId: userId.toString(),
                                machineId: userMachine.machineId,
                                isLoginSession,
                            }
                        });

                        const user = await prisma.user.findUnique({
                            where: {
                                id: userId.toString()
                            },
                            select: {
                                lifetimeDuration: true,
                                _count: {
                                    select: {
                                        sessions: true
                                    }
                                },
                            }
                        });;

                        type respType = {
                            allowed: boolean,
                            userMachineId: number,
                            userMachineDuration: number,
                            userMachineSessions: number,
                            userLifetimeDuration?: number,
                            userLifetimeSessions: number,
                            averageRating: number,
                            lastUserLoginId?: number,
                        }
                        let resp: respType = {
                            allowed: true, userMachineId: userMachine.id, userMachineDuration: userMachine.duration, userLifetimeDuration: user?.lifetimeDuration, averageRating: userMachine.averageRating, userMachineSessions: userMachine._count.sessions, userLifetimeSessions: user!._count.sessions
                        }

                        if (lastUserLogin) {
                            resp = { ...resp, lastUserLoginId: lastUserLogin.id }
                            res.status(200).json(resp);
                        } else {
                            res.status(200).json(resp);
                        }
                    } else {

                        const allowedMachines = await prisma.userMachine.findMany({
                            where: {
                                userId: userId.toString()
                            },
                            select: {
                                machine: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        });
                        res.status(200).json({ allowed: false, apprentice: userMachine?.apprentice, allowedMachines: allowedMachines });
                    }
                }
                );
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Unable to check user machine access.' });
            }
            break;
        default: //Method Not Allowed
            res.status(405).end();
            break;
    }
}
