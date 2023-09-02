import cloudinary from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = JSON.parse(req.body);

    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!secret) {
        throw new Error('CLOUDINARY_API_SECRET is not defined');
    }

    const signature = await cloudinary.v2.utils.api_sign_request(
        body["paramsToSign"],
        secret
    );
    res.status(200).json({ signature });
};

export default handler;