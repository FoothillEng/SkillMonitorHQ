import type { NextApiRequest, NextApiResponse } from 'next';

import { getImage } from "@/lib/formidable";
import { uploadImage } from "@/lib/cloudinary";
import { prisma } from '@/lib/prisma';


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const imageUploaded = await getImage(req);


    const imageData = await uploadImage(imageUploaded.path);
    // console.log(imageData);

    // const result = await prisma.avatar.create({
    //     data: {
    //         publicId: imageData.public_id,
    //         format: imageData.format,
    //         version: imageData.version.toString(),
    //         userId: req.body.userId,
    //     },
    // });

    res.json(result);
}
