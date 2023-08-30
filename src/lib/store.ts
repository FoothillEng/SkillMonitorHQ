import { useState, useEffect } from 'react';

import { create } from 'zustand';
import {
    createStudentSlice,
    StudentSlice
} from '@/lib/slices/createStudentSlice';
import { persist } from 'zustand/middleware';

type StoreState = StudentSlice;

export const useAppStore = create<StoreState>()(
    persist(
        (...a) => ({
            ...createStudentSlice(...a)
        }),
        {
            name: 'app-store'
        }
    )
);

export const useStore = <T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    callback: (state: T) => F
) => {
    const result = store(callback) as F;
    const [data, setData] = useState<F>();

    useEffect(() => {
        setData(result);
    }, [result]);

    return data;
};
