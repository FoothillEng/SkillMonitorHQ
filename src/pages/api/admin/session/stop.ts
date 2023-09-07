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
                await prisma.session.update({
                    where: { id: sessionId },
                    data: {
                        endTime: new Date(),
                        duration: new Date().getTime() - new Date(startTime).getTime()
                    }
                })
                    .then((session) => {
                        res.status(200).json({ session });
                    }).catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: 'Unable to end session.' });
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
