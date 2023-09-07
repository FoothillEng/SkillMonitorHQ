import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            const { userId, machineUUID } = req.query;
            if (!userId || !machineUUID) {
                res.status(400).json({ error: 'Missing parameters.' });
                return;
            }
            try {
                // Check if the user is allowed to use the machine
                await prisma.userMachine.findUnique({
                    where: {
                        userId: userId.toString(),
                        machineUUID: machineUUID.toString()
                    },
                }).then(async (userMachine) => {
                    if (userMachine) {
                        await prisma.userMachine.update({
                            where: {
                                userId: userId.toString(),
                                machineUUID: machineUUID.toString()
                            },
                            data: {
                                usageCount: userMachine.usageCount + 1
                            }
                        })
                        res.status(200).json({ allowed: true, userMachineId: userMachine.id, userMachineDuration: userMachine.duration });
                    } else {
                        // return with a list of allowed machines
                        const allowedMachines = await prisma.userMachine.findMany({
                            where: {
                                userId: userId.toString()
                            },
                            select: {
                                machine: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        });
                        res.status(200).json({ allowed: false, allowedMachines: allowedMachines });
                    }
                }
                );
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Unable to check user machine access.' });
            }
            break;
        default: //Method Not Allowed
            res.status(405).end();
            break;
    }
}
