import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const session = await getServerSession(req, res, authOptions); // dont need this anymore since middleware is used

                if (session) {
                    if (session.user.admin) {
                        const students = await prisma.user.findMany();
                        res.status(200).json({
                            students
                        });
                    } else {
                        res.status(401).json({
                            message: 'Unauthorized'
                        });
                    }
                } else {
                    res.status(401).json({
                        message: 'No session found'
                    });
                }

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
