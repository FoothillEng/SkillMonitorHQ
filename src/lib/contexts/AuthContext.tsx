import { useState, createContext } from 'react';

interface IAuthContext {
    runningSession: boolean; // for sidenav and apprentice
    forceStopSession: boolean; // for ALT
    setRunningSession: (runningSession: boolean) => void;
    setForceStopSession: (forceStopSession: boolean) => void;
}

export const AuthContext = createContext<IAuthContext>({
    runningSession: false,
    forceStopSession: false,
    setRunningSession: () => {},
    setForceStopSession: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [runningSession, setRunningSession] = useState(false);
    const [forceStopSession, setForceStopSession] = useState(false);

    return (
        <AuthContext.Provider
            value={{
                runningSession,
                forceStopSession,
                setRunningSession,
                setForceStopSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
