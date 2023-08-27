import { useRef, useEffect } from 'react';
// import { motion } from 'framer-motion';

import { useAppStore, useStore } from "@/lib/store"

import LockScreen  from "@/components/LockScreen"

const Index = () => {

    const student = useStore(useAppStore, state => state.student)

    // const studentRef = useRef(useAppStore.getState().student)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    // useEffect(() => useAppStore.subscribe(
    //     (state) => (studentRef.current = state.student)
    //     // ((state) => (student.current = state.student)
    // ), [])

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            {(student && student.id === 0) ? <LockScreen /> : <div className="text-center font-oxygen text-green">
                <h1 className="text-6xl">Welcome to</h1>
                <h1 className="text-6xl">The</h1>
                <h1 className="text-6xl">Gym</h1>
            </div>}
            {student && student.id}
        </div>
    )

}

export default Index;