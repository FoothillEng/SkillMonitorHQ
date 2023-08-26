interface IStudent {
    name: string;
    profilePath: string;
    hours: number;
    level: 1 | 2 | 3;
    hours: number;
    lifetimeHours: number;
    projectCount: number;
}

interface IProject {
    name: string;
    hours: number;
    assistants: IPerson[];  // default empty array
    owner: IPerson;
    startPath: Date;
    endPath: Date;
    // is_active: boolean;
    // is_completed: boolean;
    // is_cancelled: boolean;  
}
