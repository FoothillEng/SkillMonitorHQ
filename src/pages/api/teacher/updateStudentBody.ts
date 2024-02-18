import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import { parse } from 'fast-csv';
import { IncomingForm } from 'formidable';


import { prisma } from '@/lib/prisma';

interface User {
    studentId: number;
    firstName: string;
    lastName: string;
}

interface RawUser {
    'ID': string;
    'First Name': string;
    'Last Name': string;
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true, // takes a bit to parse, idk
    },
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                const form = new IncomingForm();

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        console.error('Error parsing form:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    const { file } = files;

                    if (!file) {
                        return res.status(400).json({ message: 'No file uploaded' });
                    }

                    // Read and process the CSV file
                    const studentData: User[] = [];
                    const parserStream = fs.createReadStream(file[0].filepath)
                        .pipe(parse({ headers: true }))
                        .on('data', (row: RawUser) => {
                            studentData.push({
                                studentId: parseInt(row['ID']),
                                firstName: row['First Name'],
                                lastName: row['Last Name'],
                            });
                        })
                        .on('end', async () => {

                            await prisma.studentBody.deleteMany({});

                            await prisma.studentBody.createMany({
                                data: studentData,
                                skipDuplicates: true,
                            });

                            fs.unlinkSync(file[0].filepath);

                            return res.status(200).json({ message: 'CSV data imported successfully' });
                        });

                    parserStream.on('error', (error) => {
                        throw error;
                    });
                });
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