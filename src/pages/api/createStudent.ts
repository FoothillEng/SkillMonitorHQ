// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  switch (req.method) {
    case 'POST':
        try {
        const {studentId } = req.body;
        await prisma.activeStudent.create({
            data: {
                studentId
            }
        });
        res.status(200).json({"message": "Student created successfully"});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'A value was provided incorrectly' });
        }
        break;
    default:
        res.status(405).end(); //Method Not Allowed
        break;
    }
}
