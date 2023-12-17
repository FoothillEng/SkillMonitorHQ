import type { NextApiRequest, NextApiResponse } from 'next';

import { getToken, JWT } from "next-auth/jwt"

interface JWTDate extends JWT {
    iat: number
    exp: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'GET':
            try {
                const rawToken = await getToken({ req });
                if (!rawToken) {
                    res.status(401).json({
                        message: 'Unauthorized'
                    });
                    return;
                } else {
                    const token: JWTDate = rawToken as JWTDate;
                    const timeRemaining = token.exp - Math.floor(Date.now() / 1000);
                    res.status(200).json({ timeRemaining: timeRemaining * 1000 }); // give in ms
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
