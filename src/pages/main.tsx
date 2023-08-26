import { useState } from 'react';
import Student from '@/components/Student';
import CreateProject from '@/components/CreateProject';

const Main = () => {
    const [machineAvailable, setMachineAvailable] = useState<boolean>(false);

    const studentData: IStudent[] = [{
        name: 'John Doe',
        profilePath: 'hi',
        hours: 8,
        level: 2,
        lifetimeHours: 100,
        projectCount: 10,
    }]
    return (
        <div>
        { machineAvailable ?
       <Student studentData={studentData[0]} />
        :
        <CreateProject />}
        
        </div>
    );
}

export default Main;
