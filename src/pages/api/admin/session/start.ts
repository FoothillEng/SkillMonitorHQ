import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { userMachineId, userId, apprenticeUserMachines } = req.body;

                if (!userMachineId || !userId || !apprenticeUserMachines) {
                    res.status(400).json({
                        message: 'A value was not provided'
                    });
                    return;
                }

                const data: any = {
                    userMachineId,
                    userId,
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

                await prisma.session.create({
                    data
                })
                    .then((session) => {
                        res.status(200).json({ session });
                    }).catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: 'Unable to create session.' });
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
