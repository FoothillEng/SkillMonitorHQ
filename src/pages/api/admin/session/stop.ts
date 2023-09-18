import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { sessionId, startTime } = req.body;
                const session = await prisma.session.update({
                    where: { id: sessionId },
                    data: {
                        endTime: new Date(),
                        duration: new Date().getTime() - new Date(startTime).getTime()
                    }
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
                        }
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
                    })


                    return { userMachine, user };
                }

                const updateUsers = [session.userMachineId, session.apprentice1UMID, session.apprentice2UMID, session.apprentice3UMID]
                    .filter(Boolean) // remove nulls spprenticeUMIDs
                    .map(async (userMachineId) => {
                        const { userMachine, user } = await updateHours(userMachineId as number, session?.duration as number);
                        return { userMachineDuration: userMachine?.duration, userLifetimeDuration: user?.lifetimeDuration };
                    });

                const results = await Promise.all(updateUsers);

                res.status(200).json({ session, userMachineDuration: results[0].userMachineDuration, userLifetimeDuration: results[0].userLifetimeDuration });
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
