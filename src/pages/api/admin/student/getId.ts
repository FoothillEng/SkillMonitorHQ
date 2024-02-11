import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                let { studentId } = req.body;

                studentId = parseInt(studentId);

                const user = await prisma.user.findUnique({
                    where: { studentId },
                });


                if (user !== null) {
                    return res.status(409).send({ message: 'Student already exists' });
                }

                const data = await prisma.studentBody.findFirst({
                    where: { studentId },
                });

                if (data) {
                    return res.status(200).send({ firstName: data.firstName, lastName: data.lastName });
                } else {
                    return res.status(403).send({ message: 'Student ID not found' });
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
