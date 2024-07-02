import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CompetitionObjectArray, Tables } from '@/types';
import CompetitionAccordion from './CompetitionAccordion';
import SVG_woman from '@assets/images/persons/Single_Woman.svg'
import SVG_men from '@assets/images/persons/Single_Men.svg'
import SVG_mixed from '@assets/images/persons/Mixed.svg'
import SVG_arrow_down from '@assets/images/arrow_down.svg'
import SVG_arrow_up from '@assets/images/arrow_up.svg'
import SVG_arrow_sideways from '@assets/images/arrow_sideways.svg'
const filterCompetitionsByAgeGroup = (competitions: Tables<'competitions'>[]): CompetitionObjectArray[] => {
    const ageGroups = [...new Set(competitions.map(comp => comp.ageGroup))].sort((a, b) => b.localeCompare(a));
    return ageGroups.map(ageGroup => ({
        title: ageGroup,
        competition: competitions.filter(comp => comp.ageGroup === ageGroup)
    }));
};

const iconSelector = (ageGroup: string | null) => {
    if (ageGroup === null) {
        return
    }
    if (ageGroup.startsWith('U')) {
        return <SVG_mixed />;
    }

    switch (ageGroup) {
        case 'Damen':
            return <SVG_woman />;
        case 'Seniorinnen':
            return <SVG_woman />;
        case 'Herren':
            return <SVG_men />;
        case 'Senioren':
            return <SVG_men />;
        case 'Mixed':
            return <SVG_mixed />;
        case 'Junioren':
            return <SVG_mixed />;
        default:
            return null; // Optional: Rendern Sie einen Platzhalter oder eine Standard-Icon, wenn ageGroup nicht erkannt wird
    }
}



const CompetitionAccordionList = ({ sections, multipleSelectEnabled = false, collapsed = true, registeredTournaments }: {
    sections: Tables<'competitions'>[],
    multipleSelectEnabled: boolean, collapsed: boolean, registeredTournaments: Tables<'tournament_registration'>[] | undefined
}) => {


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

    const renderHeader = (filteredCompetition: CompetitionObjectArray, index: number, isActive: boolean) => {
        const firstHeaderstyle = index === 0 ? styles.firstHeader : styles.header;
        const lastHeaderstyle = (index === filteredCompetitions.length - 1 && !isActive) ? styles.lastHeaderInActive : null;
        const combinedHeaderStyle = index === 0 ? firstHeaderstyle : (index === filteredCompetitions.length - 1 ? lastHeaderstyle : styles.header);

        return (
            <Animated.View style={[combinedHeaderStyle, styles.header, animatedHeaderStyle]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {iconSelector(filteredCompetition.title)}
                        <Text style={styles.headerText}>{filteredCompetition.title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!isActive && <SVG_arrow_sideways />}
                        {isActive && <SVG_arrow_down style={{ paddingRight: 30 }} />}
                    </View>
                </View>
            </Animated.View>

        );
    };

    const renderContent = (filteredCompetitions: CompetitionObjectArray, _, isActive: boolean) => {
        return (
            <CompetitionAccordion multipleSelectEnabled={false} collapsed={collapsed} registeredTournaments={registeredTournaments} sections={filteredCompetitions.competition} />
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
                    underlayColor='red'
                />
            </Collapsible>
        </View>
    );
};

export default CompetitionAccordionList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingLeft: 15,
        paddingRight: 15,


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
        paddingLeft: 15,
    },
    firstHeader: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        // Weitere Stile hier
    },
    lastHeaderInActive: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    headerText: {
        fontSize: 18,
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        letterSpacing: 1,
        lineHeight: 40
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
