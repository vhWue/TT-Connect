import React, { useState } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { useFilter } from '@/providers/MapFilterProvider';

const MultiSelectComponent = ({ items, setselectedTypes }: { items: {}[], setselectedTypes: any }) => {
    const filter = useFilter()

    const [selectedItems, setSelectedItems] = useState(filter.filterByTournamentType);

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
        setselectedTypes(selectedItems)
    };



    return (
        <View>
            <SectionedMultiSelect
                items={items}
                IconRenderer={MaterialIcons}
                uniqueKey="name"
                subKey="children"
                selectText="Turnierarten"
                showDropDowns={true}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectedText=""
                hideSearch={true}
                modalWithSafeAreaView={true}
                modalWithTouchable={true}
                hideConfirm={true}
                itemFontFamily={{ fontFamily: 'Staatliches' }}
                styles={
                    {
                        container: { backgroundColor: Colors.dark.background, maxHeight: 220, bottom: 40, borderRadius: 20 },
                        modalWrapper: { justifyContent: 'center' },
                        scrollView: { justifyContent: 'center', paddingTop: 10 },
                        selectToggleText: {
                            color: Colors.text.base,
                            fontFamily: 'Staatliches',
                            fontSize: 20,
                            letterSpacing: 1,
                        },
                        selectToggle: { left: 0, paddingVertical: 15 },
                        item: { marginVertical: 15, alignSelf: 'center', borderTopWidth: 0, backgroundColor: 'transparent' },
                        selectedSubItemText: { borderWidth: 1, borderColor: 'green' }
                    }
                }
                colors={{ itemBackground: 'transparent' }}
            />
        </View>
    );
};

export default MultiSelectComponent;
