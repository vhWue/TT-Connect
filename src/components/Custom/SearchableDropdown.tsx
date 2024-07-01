import { useDistinctRegions } from '@/api/turniere';
import Colors from '@/constants/Colors';
import { useFilter } from '@/providers/MapFilterProvider';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const SearchableDropdown = ({ setCurrentCity, targetLocationName }) => {
    const { data: regions, error, isLoading } = useDistinctRegions()
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    useEffect(() => {
        if (typeof value === 'string') {
            setCurrentCity(value);
        }
    }, [value])

    useEffect(() => {
        setValue(targetLocationName)


    }, [targetLocationName])


    return (

        <View style={{ flex: 1 }}>
            {!isLoading && regions !== undefined && (
                <DropDownPicker style={[styles.dropdown]}
                    schema={{ label: 'label', value: 'value' }}
                    open={open}
                    value={value}
                    items={regions}
                    setOpen={setOpen}
                    setValue={setValue}
                    placeholder={'Suche eine Stadt...'}
                    searchPlaceholder={'Suche...'}
                    theme='DARK'
                    searchable={true}
                    searchContainerStyle={[styles.dropdown]}
                    searchTextInputStyle={styles.searchTextInputStyle}
                    searchPlaceholderTextColor={Colors.text.lightgray}
                    dropDownContainerStyle={[styles.dropdown]}
                    listMode='MODAL'
                    modalAnimationType='slide'
                    modalContentContainerStyle={styles.dropdown}
                    categorySelectable={true}


                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#212121',
        borderColor: '#2F2F2F',
        fontSize: 20,
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        letterSpacing: 1,
    },
    dropdown: {
        backgroundColor: '#212121',
        borderColor: '#2F2F2F',
    },
    searchTextInputStyle: {
        fontSize: 14,
        fontFamily: 'Staatliches',
        letterSpacing: 1,
    }
})

export default SearchableDropdown;