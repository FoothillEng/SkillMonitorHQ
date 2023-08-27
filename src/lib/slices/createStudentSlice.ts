import { StateCreator } from "zustand";

export interface IStudentState {
    id: number;
}

export interface StudentSlice {
    student: IStudentState;
    setStudent: (studentId: number) => void;
}

export const createStudentSlice: StateCreator<StudentSlice> = (set) => ({
    student: {
        id: 0,
    },
    setStudent: (studentId: number) => {
        set((state) => ({
            ...state,
            student: {
                id: studentId,
            },
        }));
    },
})