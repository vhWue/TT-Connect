import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useFilter } from '@/providers/MapFilterProvider';
import MultiSelectComponent from '@/components/Custom/MultiSelectComponent';

const TYPES = [
    {
        id: '1', name: 'open'
    },
    {
        id: '2', name: 'qualification'
    },
    {
        id: '3', name: 'circuit'
    },
]

const FilterModalScreen = () => {
    const filter = useFilter()
    const [isEnabled, setIsEnabled] = useState(filter.filterByDateUpcoming);
    const [selectedTypes, setselectedTypes] = useState([])
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const router = useRouter()
    const handleConfirm = (isEnabled: boolean) => {
        filter.setFilterByDateUpcoming(isEnabled)
        filter.setFilterByTournamentType(selectedTypes)
        router.back()
    }
    return (
        <BlurView intensity={70} style={styles.container} tint="dark">
            <ScrollView style={styles.content_container}>
                <View style={styles.content_row}>
                    <Text style={styles.text}>Nur Anstehende Turniere</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#FF2323' }}
                        thumbColor={isEnabled ? "#212121" : '#f4f3f4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <MultiSelectComponent items={TYPES} setselectedTypes={setselectedTypes} />
                <TouchableOpacity onPress={() => handleConfirm(isEnabled)} style={styles.button}>
                    <Text style={{ fontFamily: 'Staatliches', color: Colors.text.base, letterSpacing: 1, fontSize: 20, }}>Filtern</Text>
                </TouchableOpacity>
            </ScrollView>


        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content_container: {
        marginHorizontal: 25,
    },
    content_row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10
    },
    text: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingRight: 15
    },
    button: {
        marginTop: 50,
        borderRadius: 12,
        width: 250,
        height: 60,
        backgroundColor: '#0C0C0C',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text.base
    }
})

export default FilterModalScreen