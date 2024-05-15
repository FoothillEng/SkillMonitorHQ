import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export const findSimilarUserMachines = async (userMachineId: number) => {
    const currUserMachine = await prisma.userMachine.findFirst({
        where: {
            id: userMachineId
        },
        select: {
            userId: true,
            machine: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!currUserMachine) {
        return [];
    }

    const similarMachinesRaw = await prisma.userMachine.findMany({
        where: {
            machine: {
                name: {
                    startsWith: currUserMachine.machine.name.split('-')[0].trim()
                }
            }
        },
        select: {
            id: true
        }
    })

    // return flattened array of userMachine ids
    return {
        similarUserMachineIds: similarMachinesRaw.map((userMachine) => userMachine.id),
        userId: currUserMachine.userId
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { userMachineId, apprentice } = req.body;

                if (userMachineId === undefined || apprentice === undefined) {
                    res.status(400).json({
                        message: 'Missing userMachineId or apprentice'
                    });
                    return;
                }

                const { similarUserMachineIds } = await findSimilarUserMachines(userMachineId) as { similarUserMachineIds: number[]; userId: string; };


                await prisma.userMachine.updateMany({
                    where: {
                        id: {
                            in: similarUserMachineIds
                        }
                    },
                    data: {
                        apprentice: apprentice
                    }
                })

                res.status(200).json({
                    apprentice: apprentice
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
