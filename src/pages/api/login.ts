// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  switch (req.method) {
    case 'POST':
        try {
        const { studentId } = req.body;
        console.log(studentId);
        // check if studentId exists in ActiveStudents
        const student = await prisma.activeStudent.findUnique({
            where: {
                studentId
            }
        });
        if (student) {
            res.status(200).json({message: "student exists"});
            return;
        } else {
            res.status(401).json({message: "student does not exist"});
            return;
        }
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'error logging in' });
        }
        break;
    default:
        res.status(417).end(); //Method Not Allowed
        break;
    }
}
