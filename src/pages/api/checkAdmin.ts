import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import NotFoundError from '@prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const rawStudentId = req.query.studentId as string;
                console.log(rawStudentId);

                if (!rawStudentId) {
                    res.status(401).json({ message: 'student does not exist' });
                    return;
                }
                const studentId = parseInt(rawStudentId);

                const student = await prisma.activeStudent.findUniqueOrThrow({
                    where: {
                        studentId,
                    }
                });
                if (student && student.admin === true) {
                    res.status(200).json({ message: 'student is admin' });
                    return;
                } else {
                    res.status(401).json({ message: 'student is not admin' });
                    return;
                }
            } catch (error) {
                console.log(error);
                if (error === NotFoundError) {
                    res.status(401).json({ message: 'student does not exist' });
                    return;
                }
                res.status(400).json({ message: 'error logging in' });
            }
            break;
        default:
            res.status(405).end();
            break;
    }
}
