import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { Machine } from '@prisma/client';

export const createSimilarUserMachine = async (userId: string, machine: Machine, additionalArgs?: Object) => {
    const similarMachinesRaw = await prisma.machine.findMany({
        where: {
            name: {
                startsWith: machine.name.split('-')[0].trim()
            }
        },
        select: {
            id: true,
            uuid: true
        }
    })

    const similarMachines = similarMachinesRaw.map((machine) => {
        return {
            userId: userId,
            machineId: machine.id,
            machineUUID: machine.uuid,
            apprentice: true,
            ...additionalArgs
        }
    })

    return await prisma.userMachine.createManyAndReturn({
        data: similarMachines,
        include: {
            user: true,
        },
        skipDuplicates: true
    })
}

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
                    },
                })

                if (userMachine) {
                    res.status(401).json({
                        message: 'Student is already on the machine',
                    });
                } else {
                    await createSimilarUserMachine(student.id, machine);
                    res.status(200).json({ "message": "success" })
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
