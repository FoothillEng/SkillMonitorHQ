import type { NextApiRequest, NextApiResponse } from 'next';


import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { studentId, machineUUID } = req.body;
                if (!studentId || !machineUUID) {
                    res.status(400).json({ message: 'Missing query parameters' });
                    return;
                }

                const student = await prisma.user.findFirst({
                    where: {
                        studentId: parseInt(studentId.toString())
                    }
                })

                const machine = await prisma.machine.findFirst({
                    where: {
                        uuid: machineUUID.toString()
                    }
                })

                if (!student || !machine) {
                    res.status(404).json({
                        message: 'Student not found'
                    });
                    return;
                }


                const userMachine = await prisma.userMachine.findUnique({
                    where: {
                        userId_machineId: {
                            userId: student?.id,
                            machineId: machine?.id
                        },
                    },
                    include: {
                        user: true,
                    }
                })

                if (userMachine) {
                    if (userMachine.apprentice) {
                        res.status(200).json({
                            apprentice: userMachine.user
                        });
                    } else {
                        res.status(401).json({
                            message: 'Student is already an expert',
                        });
                    }
                } else {
                    const userMachine = await prisma.userMachine.create({
                        data: {
                            user: {
                                connect: {
                                    id: student.id
                                },
                            },
                            machine: {
                                connect: {
                                    id: machine.id
                                }
                            },
                            apprentice: true
                        },
                        include: {
                            user: true,
                        }
                    })
                    res.status(200).json({
                        apprentice: userMachine.user
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
