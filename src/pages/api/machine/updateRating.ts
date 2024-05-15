import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

import { findSimilarUserMachines } from '@/pages/api/admin/student/update';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'PUT': // insecure if ppl guess the id
            const { userLoginId, rating }: { userLoginId: number; rating: number } = req.body;

            if (!userLoginId || !rating) {
                res.status(400).json({ error: 'Missing parameters.' });
                return;
            }

            if (rating < 0 || rating > 5) {
                res.status(400).json({ error: 'Rating must be between 0 and 5.' });
                return;
            }

            try {
                const userLogin = await prisma.userLogin.findFirstOrThrow({
                    where: {
                        id: userLoginId,
                    },
                })

                // EDGE CASE: permute excess ratings for users who used machine 2+ times (not just the current one)
                // THIS IS NOT WORKING
                await prisma.userLogin.updateMany({
                    where: {
                        machineId: userLogin.machineId,
                        userId: userLogin.userId,
                        isLoginSession: true,
                        rated: false,
                    },
                    data: {
                        rated: true,
                    }
                })


                await prisma.userMachine.findFirst({
                    where: {
                        userId: userLogin.userId,
                        machineId: userLogin.machineId,
                    },
                }).then(async (userMachine) => {
                    if (!userMachine) {
                        res.status(400).json({ error: 'User machine not found.' });
                        return;
                    }

                    const newRating = (userMachine.cumulativeRatingSum + rating) / (1.0 * (userMachine.cumulativeRatingCount + 1));

                    const { similarUserMachineIds } = await findSimilarUserMachines(userMachine.id) as { similarUserMachineIds: number[]; userId: string };

                    await prisma.userMachine.updateMany({
                        where: {
                            id: {
                                in: similarUserMachineIds
                            }
                        },
                        data: {
                            cumulativeRatingSum: {
                                increment: rating,
                            },
                            cumulativeRatingCount: {
                                increment: 1,
                            },
                            averageRating: newRating,
                        }
                    })

                    res.status(200).json({ success: true });

                })

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Unable to check update rating.' });
            }
            break;
        default: //Method Not Allowed
            res.status(405).end();
            break;
    }
}
