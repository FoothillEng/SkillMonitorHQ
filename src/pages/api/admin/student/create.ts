import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                let { studentId, firstName, lastName, avatar } = req.body;

                if (avatar === '') {
                    return res.status(401).json({ message: 'Avatar cannot be empty' });
                }

                studentId = parseInt(studentId);

                const user = await prisma.user.findUnique({
                    where: { studentId },
                });

                if (user !== null) {
                    return res.status(403).send({ message: 'Student already exists' });
                }


                await prisma.user.create({
                    data: {
                        studentId,
                        firstName,
                        lastName,
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
