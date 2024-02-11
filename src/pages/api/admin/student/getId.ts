import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { parse } from 'fast-csv';
import { prisma } from '@/lib/prisma';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case 'POST':
            try {
                let { studentId } = req.body;

                studentId = parseInt(studentId);

                const user = await prisma.user.findUnique({
                    where: { studentId },
                });


                if (user !== null) {
                    return res.status(409).send({ message: 'Student already exists' });
                }

                const promise1 = new Promise((resolve, reject) => { // not really needed since .on('end') will fire if no data is found
                    setTimeout(resolve, 5000, false);
                });
                let found = false;
                const getStudentData = new Promise((resolve, reject) => {
                    fs.createReadStream(process.cwd() + "/src/lib/students.csv")
                        .pipe(parse())
                        .on('error', () => resolve(false))
                        .on('data', (row: any) => {
                            if (row[0] === studentId.toString()) {
                                found = true;
                                resolve({
                                    firstName: row[2], // note in docs, order is Id, last name, first name
                                    lastName: row[1]
                                })
                            }
                        })
                        .on('end', () => {
                            if (!found) {
                                resolve(false);
                            }
                        });
                })

                let data = await Promise.race([promise1, getStudentData]);

                if (data === false) {
                    return res.status(403).send({ message: 'Student ID not found' });
                } else {
                    let coolName = data as Name
                    return res.status(200).send({ firstName: coolName.firstName, lastName: coolName.lastName });
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
