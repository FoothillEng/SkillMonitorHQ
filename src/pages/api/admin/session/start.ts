import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { userMachineId, userId } = req.body;
                await prisma.session.create({
                    data: {
                        userMachineId,
                        userId,
                    }
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
