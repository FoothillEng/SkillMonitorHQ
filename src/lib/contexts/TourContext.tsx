import { useState, createContext } from 'react';

interface ITourContext {
    tour: boolean;
    setTour: (tour: boolean) => void;
}

export const TourContext = createContext<ITourContext>({
    tour: false,
    setTour: () => {}
});

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
    const [tour, setTour] = useState<boolean>(false);

    return (
        <TourContext.Provider
            value={{
                tour,
                setTour
            }}
        >
            {children}
        </TourContext.Provider>
    );
};
