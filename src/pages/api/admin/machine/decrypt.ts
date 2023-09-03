import type { NextApiRequest, NextApiResponse } from 'next';

import { decryptData } from '@/lib/crypto';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { encryptedMachineId } = req.body;
                console.log("encryptedMachineId", encryptedMachineId);
                res.status(200).json({
                    decryptedMachineId: decryptData(encryptedMachineId)
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
