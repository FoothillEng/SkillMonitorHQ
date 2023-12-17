// check if the ID provided is a valid admin ID through prisma
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const { adminId }: { adminId: number } = req.body;
                const student = await prisma.user.findUnique({
                    where: {
                        studentId: adminId
                    }
                });

                if (student && (student.role === 'ADMIN' || student.role === 'TEACHER')) {
                    res.status(200).json({
                        message: 'Admin found'
                    });
                } else {
                    res.status(401).json({
                        message: 'Admin not found'
                    });
                }

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
