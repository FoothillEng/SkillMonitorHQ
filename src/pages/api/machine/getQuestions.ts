import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const { UUID, generalSafetyTest } = req.query;
                if (UUID) {
                    if (generalSafetyTest) {
                        let generalSafetyTestMachine = await prisma.machine.findFirst({
                            where: {
                                nonUserMachine: true,
                            },
                            select: {
                                testQuestions: true
                            }
                        })

                        if (!generalSafetyTestMachine) {
                            await prisma.machine.create({
                                data: {
                                    name: 'General Safety',
                                    nonUserMachine: true
                                },
                                select: {
                                    testQuestions: true
                                }
                            });
                            res.status(422).json({
                                message: 'No questions found'
                            });
                        } else {
                            if (generalSafetyTestMachine.testQuestions.length === 0) {
                                res.status(422).json({
                                    message: 'No questions found'
                                });
                            } else {
                                res.status(200).json({
                                    questions: generalSafetyTestMachine.testQuestions
                                });
                            }
                        }
                    }

                    await prisma.machine.findUnique({
                        where: {
                            uuid: UUID.toString()
                        }
                    }).then(async (machine) => {
                        if (!machine) {
                            res.status(404).json({
                                message: 'Machine not found'
                            });
                        } else {
                            const questions = await prisma.testQuestion.findMany({
                                where: {
                                    machine: {
                                        some: {
                                            id: machine.id
                                        }
                                    }
                                }
                            });
                            if (questions.length === 0) {
                                res.status(422).json({
                                    message: 'No questions found'
                                });
                            } else {
                                res.status(200).json({
                                    questions
                                });
                            }
                        }
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
