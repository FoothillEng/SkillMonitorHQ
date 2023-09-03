import type { NextApiRequest, NextApiResponse } from 'next';

import { encryptData } from '@/lib/crypto';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { machineId } = req.body;
                res.status(200).json({
                    encryptedMachineId: encryptData(machineId)
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
