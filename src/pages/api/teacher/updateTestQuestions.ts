import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import { parse } from 'fast-csv';
import { IncomingForm } from 'formidable';


import { prisma } from '@/lib/prisma';

interface Question {
    id: number
    text: string
    choice1: string
    choice2: string
    choice3: string
    choice4: string
    choice5: string
    choice6: string
    correctChoice: number
}

interface RawQuestion {
    id: string
    text: string
    choice1: string
    choice2: string
    choice3: string
    choice4: string
    choice5: string
    choice6: string
    correctChoice: string
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
                const { generalSafetyTestRaw } = req.query;
                let generalSafetyTest = false;

                if (generalSafetyTestRaw === 'true') {
                    generalSafetyTest = true;
                }

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        console.error('Error parsing form:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    const { file } = files;
                    const { machineId } = fields

                    if (!file) {
                        return res.status(400).json({ message: 'No file uploaded' });
                    }

                    if (!machineId) {
                        return res.status(400).json({ message: 'No machine id provided' });
                    }

                    // Read and process the CSV file
                    const uniquePrefix = generalSafetyTest ? "1337" : Math.floor(Math.random() * 1000000).toString();

                    const questionData: Question[] = [];
                    const parserStream = fs.createReadStream(file[0].filepath)
                        .pipe(parse({ headers: true }))
                        .on('data', (row: RawQuestion) => {
                            if (row.id === '' || row.text === '' || row.choice1 === '' || row.choice2 === '' || row.correctChoice === '') { // do not need choice3-6
                                console.log('skipping row', row.id, row.text, row.choice1, row.choice2, row.choice3, row.choice4, row.choice5, row.choice6, row.correctChoice)
                            } else {
                                questionData.push({
                                    id: parseInt(uniquePrefix + row.id),
                                    text: row.text,
                                    choice1: row.choice1,
                                    choice2: row.choice2,
                                    choice3: row.choice3,
                                    choice4: row.choice4,
                                    choice5: row.choice5,
                                    choice6: row.choice6,
                                    correctChoice: parseInt(row.correctChoice),
                                });
                            }
                        })
                        .on('end', async () => {
                            const oldQuestions = await prisma.testQuestion.findMany({
                                where: {
                                    machine: {
                                        some: {
                                            id: parseInt(machineId[0])
                                        }
                                    }
                                },
                                select: {
                                    id: true,
                                    machine: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            })

                            await prisma.testQuestion.deleteMany({
                                where: {
                                    id: {
                                        in: oldQuestions.map((question) => question.id)
                                    }
                                }
                            });

                            const newQuestions = await prisma.testQuestion.createManyAndReturn({
                                data: questionData,
                                select: {
                                    id: true
                                }
                            });

                            // flatten oldQUestions to get machine ids
                            const machineIds: number[] = [parseInt(machineId[0])];
                            for (const item of oldQuestions) {
                                machineIds.push(...item.machine.map((machine) => machine.id));
                            }
                            const oldMachineIds = [...new Set(machineIds)]

                            // add new questions to similar machine
                            for (let i = 0; i < oldMachineIds.length; i++) {
                                await prisma.machine.update({
                                    where: {
                                        id: oldMachineIds[i]
                                    },
                                    data: {
                                        testQuestions: {
                                            connect: newQuestions
                                        }
                                    }
                                })
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