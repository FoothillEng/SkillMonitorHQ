import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { userMachineId, apprentice } = req.body;

                if (!userMachineId) {
                    res.status(400).json({
                        message: 'Missing userMachineId'
                    });
                    return;
                }

                const userMachine = await prisma.userMachine.update({
                    where: {
                        id: userMachineId
                    },
                    data: {
                        apprentice: apprentice
                    }
                })

                res.status(200).json({
                    apprentice: userMachine.apprentice
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
