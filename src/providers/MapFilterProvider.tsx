import React, { PropsWithChildren, createContext, useContext, useState } from 'react';


export type FilterData = {
    filterByDateUpcoming: boolean,
    setFilterByDateUpcoming: any,
    filterByTournamentType: string[]
    setFilterByTournamentType: any
}

export const FilterContext = createContext<FilterData>({
    filterByDateUpcoming: true,
    setFilterByDateUpcoming: null,
    filterByTournamentType: [],
    setFilterByTournamentType: null
});

export default function FilterProvider({ children }: PropsWithChildren) {
    const [filterByDateUpcoming, setFilterByDateUpcoming] = useState(false);
    const [filterByTournamentType, setFilterByTournamentType] = useState([])

    return (
        <FilterContext.Provider value={{ filterByDateUpcoming, setFilterByDateUpcoming, filterByTournamentType, setFilterByTournamentType }}>
            {children}
        </FilterContext.Provider>
    );
};


export const useFilter = () => useContext(FilterContext)