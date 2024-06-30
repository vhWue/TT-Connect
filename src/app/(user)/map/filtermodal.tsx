import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useFilter } from '@/providers/MapFilterProvider';
import MultiSelectComponent from '@/components/Custom/MultiSelectComponent';
import Slider from '@react-native-community/slider';

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
    const [kilometer, setKilometer] = useState(filter.maxDistance);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const router = useRouter()
    const handleConfirm = (isEnabled: boolean) => {
        filter.setFilterByDateUpcoming(isEnabled)
        filter.setFilterByTournamentType(selectedTypes)
        filter.setMaxDistance(kilometer)
        filter.setTargetLocation({
            latitude: 50.1109, // Frankfurt am Main
            longitude: 8.6821,
            latitudeDelta: 0.222,
            longitudeDelta: 0.0421,
        })
        router.back()
    }

    const handleInputChange = (input: string) => {
        const value = parseInt(input, 10);
        if (!isNaN(value) && value >= 0 && value <= 500) {
            setKilometer(value);
        } else if (input === '') {
            setKilometer(0);
        }
    };
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
                <View>
                    <View style={styles.content_row}>
                        <Text style={styles.text}>Distanz</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(kilometer)}
                            onChangeText={handleInputChange}
                        />
                        <Text style={styles.text}>km</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={500}
                        step={1}
                        value={kilometer}
                        onValueChange={(value) => setKilometer(value)}
                        minimumTrackTintColor="#1EB1FC"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1EB1FC"
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
    },
    slider: {
        width: '100%',
        height: 40,
    },
    input: {
        height: 40,
        backgroundColor: '#212121',
        borderRadius: 12,
        borderColor: '#2F2F2F',
        borderWidth: 1,
        marginRight: 5,
        width: 70,
        textAlign: 'center',
        fontSize: 20,
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        letterSpacing: 1,
    },
})

export default FilterModalScreen