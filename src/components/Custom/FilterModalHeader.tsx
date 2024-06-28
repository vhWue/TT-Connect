import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

const FilterModalHeader = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.text}>Turnier Filter</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 5
    },
    text: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 24,
        letterSpacing: 1
    }
})

export default FilterModalHeader