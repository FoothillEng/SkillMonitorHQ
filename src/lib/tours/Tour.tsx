import JoyRide, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useContext, useEffect } from 'react';

import { TourContext } from '@/lib/contexts/TourContext';

type TourType = 'Machine Settings' | 'Register Student';

const steps: { [key in TourType]: Step[] } = {
    'Machine Settings': [
        {
            title: 'Machine Settings',
            content: 'Each tablet controls one and only one machine',
            target: '#title'
        },
        {
            title: 'Current Machine',
            content:
                'The current machine is highlighted in red. Tap it to change!',
            spotlightPadding: 20,
            target: '#listMachines'
        },
        {
            title: 'New Machine',
            content: 'To register a new machine, type its name and tap Submit!',
            target: '#createMachines'
        }
    ],
    'Register Student': [
        {
            title: 'Registering a new Student',
            content:
                'Once a student has been registered to SMHQ, they can be added to any machine!',
            target: '#title'
        },
        {
            title: 'Enter Student ID',
            content:
                "Enter the new student's ID and click the submit button in the bottom right corner!",
            target: '#NumPad'
        },
        {
            title: 'Confirm Student Information',
            content: 'Confirm the student information!',
            target: '#studentInfo'
        },
        {
            title: 'Upload Avatar',
            content: "Upload the student's avatar!",
            target: '#uploadAvatar'
        }
    ]
};

interface TourProps {
    TourType: TourType;
}

const Tour = ({ TourType }: TourProps) => {
    const { tour, setTour } = useContext(TourContext);

    // useEffect(() => {
    //     console.log('Tour:', tour);
    // }, [tour]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setTour(false);
        }
    };

    return (
        <JoyRide
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={tour}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps[TourType]}
            styles={{
                options: {
                    zIndex: 10000
                }
            }}
        />
    );
};

export default Tour;
