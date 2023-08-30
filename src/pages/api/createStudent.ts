import { readFileSync } from 'fs';

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { studentId } = req.body;

                const pathToAvatar = `./public/ai-photo-pfp.jpeg`;
                const avatar = readFileSync(pathToAvatar).toString('base64');

                await prisma.activeStudent.create({
                    data: {
                        studentId,
                        avatar
                    }
                });
                res.status(200).json({
                    message: 'Student created successfully'
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
