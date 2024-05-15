import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { createSimilarUserMachine } from '@/pages/api/admin/machine/addStudent';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { studentId, machineUUID, generalSafetyTest } = req.body;

                if (studentId === undefined || machineUUID === undefined || generalSafetyTest === undefined) {
                    res.status(400).json({ message: 'Missing query parameters' });
                    return;
                }

                const student = await prisma.user.findFirst({
                    where: {
                        studentId: parseInt(studentId.toString())
                    }
                })

                if (!student) {
                    res.status(404).json({
                        message: 'Student or machine not found'
                    });
                    return;
                }

                if (generalSafetyTest) {
                    await prisma.user.update({
                        where: {
                            id: student.id
                        },
                        data: {
                            generalSafetyTest: true
                        }
                    })
                    res.status(200).json({
                        message: 'Congrats! You have passed the general safety test!!'
                    });
                    return;
                }

                const machine = await prisma.machine.findFirst({
                    where: {
                        uuid: machineUUID.toString()
                    }
                })

                if (!machine) {
                    res.status(404).json({
                        message: 'Student or machine not found'
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
                    },
                })

                if (userMachine) {
                    if (userMachine.apprentice) {
                        res.status(409).json({
                            message: "You are already an apprentice on this machine"
                        });
                    } else {
                        res.status(401).json({
                            message: 'You are already an expert on this machine',
                        });
                    }
                } else {
                    await createSimilarUserMachine(student.id, machine, { passedTest: true });

                    res.status(200).json({ message: 'Congrats! You have passed the test and are now an apprentice on this machine!!' });
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
