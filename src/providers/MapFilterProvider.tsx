import { UserLocation } from '@/app/(user)/map';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';


export type FilterData = {
    filterByDateUpcoming: boolean,
    setFilterByDateUpcoming: any,
    filterByTournamentType: string[]
    setFilterByTournamentType: any
    maxDistance: number;
    setMaxDistance: any;
    targetLocation: UserLocation
    setTargetLocation: any
}
const defaultTarget = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
}

export const FilterContext = createContext<FilterData>({
    filterByDateUpcoming: true,
    setFilterByDateUpcoming: null,
    filterByTournamentType: [],
    setFilterByTournamentType: null,
    maxDistance: 0,
    setMaxDistance: null,
    targetLocation: defaultTarget,
    setTargetLocation: null
});

export default function FilterProvider({ children }: PropsWithChildren) {
    const [filterByDateUpcoming, setFilterByDateUpcoming] = useState(true);
    const [filterByTournamentType, setFilterByTournamentType] = useState([])
    const [maxDistance, setMaxDistance] = useState(50)
    const [targetLocation, setTargetLocation] = useState(defaultTarget)

    return (
        <FilterContext.Provider value={
            {
                filterByDateUpcoming, setFilterByDateUpcoming,
                filterByTournamentType, setFilterByTournamentType,
                maxDistance, setMaxDistance,
                targetLocation, setTargetLocation

            }}>
            {children}
        </FilterContext.Provider>
    );
};


export const useFilter = () => useContext(FilterContext)