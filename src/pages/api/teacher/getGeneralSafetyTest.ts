import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                await prisma.machine.findFirst({
                    where: {
                        nonUserMachine: true,
                    },
                    select: {
                        id: true,
                        name: true,
                        uuid: true,
                        _count: {
                            select: {
                                testQuestions: true
                            }
                        }
                    }
                }).then(async (machine) => {
                    if (!machine) {
                        const machine = await prisma.machine.create({
                            data: {
                                name: 'General Safety',
                                nonUserMachine: true
                            },
                            select: {
                                id: true,
                                name: true,
                                uuid: true,
                                _count: {
                                    select: {
                                        testQuestions: true
                                    }
                                }
                            }
                        });
                        return res.status(422).json({
                            machine: machine,
                        });
                    } else {
                        return res.status(200).json({
                            machine: machine,
                        });
                    }
                });
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
