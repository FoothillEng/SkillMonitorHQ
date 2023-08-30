import { StateCreator } from 'zustand';

export interface IStudentState {
    id: number;
    avatar: Buffer;
}

export interface StudentSlice {
    student: IStudentState;
    setStudent: (studentId: number, avatar: Buffer) => void;
}

export const createStudentSlice: StateCreator<StudentSlice> = (set) => ({
    student: {
        id: 0,
        avatar: Buffer.from('')
    },
    setStudent: (studentId: number) => {
        set((state) => ({
            ...state,
            student: {
                id: studentId,
                avatar: Buffer.from('')
            }
        }));
    }
});
