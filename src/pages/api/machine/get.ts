import type { NextApiRequest, NextApiResponse } from 'next';


import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const { UUID } = req.query;
                if (UUID) {
                    await prisma.machine.findUnique({
                        where: {
                            uuid: UUID.toString()
                        }
                    }).then((machine) => {
                        if (!machine) {
                            res.status(404).json({
                                message: 'Machine not found'
                            });
                        }
                        res.status(200).json({
                            machine
                        });
                    })
                } else {
                    res.status(404).json({
                        message: 'Machine not found'
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
