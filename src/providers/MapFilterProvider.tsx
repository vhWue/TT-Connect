import { UserLocation } from '@/app/(user)/map';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';


export type FilterData = {
    filterByDateUpcoming: boolean,
    setFilterByDateUpcoming: any,
    filterByAgeGroup: boolean
    setFilterByAgeGroup: any
    filterByTournamentType: string[]
    setFilterByTournamentType: any
    maxDistance: number;
    setMaxDistance: any;
    targetLocation: UserLocation
    setTargetLocation: any
    targetLocationName: string
    setTargetLocationName: any
    targetCoords: targetCoords
    setTargetCoords: any
}
const defaultTarget = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
}

export type targetCoords = {
    latitude: number,
    longitude: number,
}

export const FilterContext = createContext<FilterData>({
    filterByDateUpcoming: true,
    setFilterByDateUpcoming: null,
    filterByAgeGroup: false,
    setFilterByAgeGroup: null,
    filterByTournamentType: [],
    setFilterByTournamentType: null,
    maxDistance: 0,
    setMaxDistance: null,
    targetLocation: defaultTarget,
    setTargetLocation: null,
    targetLocationName: '',
    setTargetLocationName: null,
    targetCoords: {
        latitude: 0,
        longitude: 0,
    },
    setTargetCoords: null
});

export default function FilterProvider({ children }: PropsWithChildren) {
    const [filterByDateUpcoming, setFilterByDateUpcoming] = useState(true);
    const [filterByAgeGroup, setFilterByAgeGroup] = useState(false)
    const [filterByTournamentType, setFilterByTournamentType] = useState([])
    const [maxDistance, setMaxDistance] = useState(50)
    const [targetLocation, setTargetLocation] = useState(defaultTarget)
    const [targetLocationName, setTargetLocationName] = useState('Würzburg')
    const [targetCoords, setTargetCoords] = useState({
        latitude: 0,
        longitude: 0
    })
    return (
        <FilterContext.Provider value={
            {
                filterByDateUpcoming, setFilterByDateUpcoming,
                filterByAgeGroup, setFilterByAgeGroup,
                filterByTournamentType, setFilterByTournamentType,
                maxDistance, setMaxDistance,
                targetLocation, setTargetLocation,
                targetLocationName, setTargetLocationName,
                targetCoords, setTargetCoords

            }}>
            {children}
        </FilterContext.Provider>
    );
};


export const useFilter = () => useContext(FilterContext)