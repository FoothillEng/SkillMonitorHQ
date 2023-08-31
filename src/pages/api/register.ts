import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

// TOD

export default async function registerUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { studentId } = req.body;
    const user = await prisma.user.findUnique({
        where: { studentId },
    });

    if (user !== null) {
        return res.send({ user: null, message: 'User already exists' });
    }


    const newUser = await prisma.user.create({
        data: {
            studentId
        },
    });

    return res.send({ user: newUser, message: 'User created successfully' });
}
