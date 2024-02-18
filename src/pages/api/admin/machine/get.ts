import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const rawMachines = await prisma.machine.findMany({
                    include: {
                        testQuestions: true
                    }
                });
                const machines = rawMachines.map((machine) => {
                    return {
                        id: machine.id,
                        name: machine.name,
                        uuid: machine.uuid,
                        testQuestions: (machine.testQuestions.length > 0) ? true : false
                    }
                });
                res.status(200).json({
                    machines
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
