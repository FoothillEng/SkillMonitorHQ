import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { machineName } = req.body;

                if (!machineName) {
                    return res.status(400).send({ message: 'Machine name is required' });
                }

                const machine = await prisma.machine.findUnique({
                    where: {
                        name: machineName
                    }
                });

                if (machine !== null) {
                    return res.status(403).send({ message: 'Machine already exists' });
                }

                // add common test questions here
                const questions = await prisma.testQuestion.findMany({
                    where: {
                        machine: {
                            every: {
                                name: {
                                    startsWith: machineName.split('-')[0].trim()
                                }
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                })

                await prisma.machine.create({
                    data: {
                        name: machineName,
                        testQuestions: {
                            connect: questions
                        }
                    }
                });

                res.status(200).json({
                    message: 'Machine created successfully'
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
