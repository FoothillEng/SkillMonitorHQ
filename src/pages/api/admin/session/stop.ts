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
                }).catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Unable to end session.' });
                });

                const sumMachineHoursSession = await prisma.session.aggregate(
                    {
                        where: {
                            userId: session?.userId,
                            userMachineId: session?.userMachineId,
                        },
                        _sum: {
                            duration: true
                        },
                    }
                ).catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'An error occurred.' });
                });

                await prisma.userMachine.update({
                    where: {
                        id: session?.userMachineId
                    },
                    data: {
                        duration: sumMachineHoursSession && sumMachineHoursSession._sum?.duration !== null ? sumMachineHoursSession._sum.duration : undefined
                    }
                }).then((userMachine) => {
                    res.status(200).json({ session, userMachineDuration: userMachine.duration });
                })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: 'An error occurred.' });
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
