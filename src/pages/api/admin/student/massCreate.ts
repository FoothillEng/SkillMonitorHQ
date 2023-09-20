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
                    const csvData: RawUser[] = [];
                    const parserStream = fs.createReadStream(file[0].filepath)
                        .pipe(parse({ headers: true }))
                        .on('data', (row: RawUser) => {
                            // Process each row as needed
                            if (row['ID'] && row['First Name'] && row['Last Name']) {
                                csvData.push(row);
                            }
                        })
                        .on('end', async () => {
                            // console.log(csvData)

                            let studentData: User[] = csvData.map((row) => ({
                                studentId: parseInt(row['ID']),
                                firstName: row['First Name'],
                                lastName: row['Last Name'],
                            }));

                            // cut studentData to top 50 rows
                            const bachSize = 50;
                            const batchCount = Math.ceil(studentData.length / bachSize);

                            const runBatch = async (batch: number) => {
                                const start = batch * bachSize;
                                const end = Math.min((batch + 1) * bachSize, studentData.length);
                                // const end = (batch + 1) * bachSize;
                                // console.log("END", end, batch + 1)
                                // console.log(Math.min((batch + 1) * bachSize, studentData.length))
                                const curStudentData = studentData.slice(start, end);
                                const startTime = new Date().getTime()
                                await prisma.user.createMany({
                                    data: curStudentData,
                                    skipDuplicates: true,
                                });
                                console.log("time taken", (new Date().getTime() - startTime) / 1000, "seconds")
                            }

                            console.log(studentData.length)
                            for (let batch = 0; batch < batchCount; batch++) {
                                console.log("running batch", batch, "of", batchCount, new Date().toLocaleString('en-US'))
                                await runBatch(batch);
                            }



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
