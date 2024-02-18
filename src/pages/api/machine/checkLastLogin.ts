import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const machineUUID = req.query.machineUUID as string;
                let length = parseInt(req.query.length as string);

                const machine = await prisma.machine.findUnique({
                    where: {
                        uuid: machineUUID,
                    },
                });

                if (!machine) {
                    res.status(401).json({ message: 'machine does not exist' });
                    return;
                }

                if (length < 1 || length > 10) {
                    length = 10;
                }

                // get the last 3 logins for this machine
                const logins = await prisma.userLogin.findMany({
                    where: {
                        machineId: machine.id,
                    },
                    orderBy: {
                        loginTime: 'desc',
                    },
                    take: length,
                    distinct: ['userId'],
                    select: {
                        user: true
                    },
                });

                const transformedLogins = logins.map((login) => ({
                    id: login.user.id,
                    studentId: login.user.studentId,
                    firstName: login.user.firstName,
                    lastName: login.user.lastName,
                    avatar: login.user.avatar,
                    level: login.user.level,
                    lifetimeDuration: login.user.lifetimeDuration,
                    role: login.user.role,
                }))

                res.status(200).json({ students: transformedLogins })


            } catch (error) {
                res.status(400).json({ message: 'error finding last few logins' });
            }
            break;
        default:
            res.status(405).end();
            break;
    }
}
