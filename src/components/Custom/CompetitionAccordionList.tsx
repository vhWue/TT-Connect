import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CompetitionObjectArray, Tables } from '@/types';
import CompetitionAccordion from './CompetitionAccordion';


const filterCompetitionsByAgeGroup = (competitions: Tables<'competitions'>[]): CompetitionObjectArray[] => {


    const ageGroups = [...new Set(competitions.map(comp => comp.ageGroup))];
    return ageGroups.map(ageGroup => ({
        title: ageGroup,
        competition: competitions.filter(comp => comp.ageGroup === ageGroup)
    }));
};



const CompetitionAccordionList = ({ sections, multipleSelectEnabled = false, collapsed = true }: { sections: Tables<'competitions'>[], multipleSelectEnabled: boolean, collapsed: boolean }) => {


    const [activeSections, setActiveSections] = useState([]);
    const filteredCompetitions = filterCompetitionsByAgeGroup(sections)
    const [multipleSelect, setMultipleSelect] = useState(multipleSelectEnabled);
    //console.log("Sections:", sections);

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming('rgba(0, 0, 0, 0.3)', {
                duration: 400
            }),
        };
    });



    const setSections = (sections) => {
        setActiveSections(sections.includes(undefined) ? [] : sections);
    };

    const renderHeader = (filteredCompetitions: CompetitionObjectArray, _, isActive: boolean) => {
        //backgroundColor.value = isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)';
        return (
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <Text style={styles.headerText}>{filteredCompetitions.title}</Text>
            </Animated.View>
        );
    };

    const renderContent = (filteredCompetitions: CompetitionObjectArray, _, isActive: boolean) => {
        return (
            <CompetitionAccordion multipleSelectEnabled={false} collapsed={collapsed} sections={filteredCompetitions.competition} />
        );
    };

    return (
        <View style={styles.container}>
            <Collapsible collapsed={collapsed}>
                <Accordion
                    activeSections={activeSections}
                    sections={filteredCompetitions}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={multipleSelect}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    duration={400}
                    onChange={setSections}
                    renderAsFlatList={false}
                />
            </Collapsible>
        </View>
    );
};

export default CompetitionAccordionList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',


    },
    title: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 32,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    header: {
        backgroundColor: 'transparent',
        padding: 10,
        paddingLeft: 32,

    },
    headerText: {
        textAlign: 'left',
        fontSize: 16,
        color: Colors.text.base,
    },
    content: {
        paddingLeft: 32,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    active: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    inactive: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});
