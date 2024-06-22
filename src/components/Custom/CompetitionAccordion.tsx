import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Tables } from '@/types';
import SVG_arrow_sideways from '@assets/images/arrow_sideways.svg';
import SVG_arrow_down from '@assets/images/arrow_down.svg';

const CompetitionAccordion = ({ sections, multipleSelectEnabled = false, collapsed = true }: { sections: Tables<'competitions'>[], multipleSelectEnabled: boolean, collapsed: boolean }) => {
    const [activeSections, setActiveSections] = useState([]);
    const [multipleSelect, setMultipleSelect] = useState(multipleSelectEnabled);
    //console.log("Sections:", sections);

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming('#0C0C0C', {
                duration: 400
            }),
        };
    });



    const setSections = (sections) => {
        setActiveSections(sections.includes(undefined) ? [] : sections);
    };

    const renderHeader = (competition: Tables<'competitions'>, _, isActive: boolean) => {

        return (
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.headerText}>{competition.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!isActive && <SVG_arrow_sideways style={{ marginRight: 20 }} />}
                        {isActive && <SVG_arrow_down style={{ paddingRight: 30, marginRight: 20 }} />}
                    </View>
                </View>
            </Animated.View>
        );
    };

    const renderContent = (competition: Tables<'competitions'>, _, isActive: boolean) => {
        return (
            <View style={[styles.content, isActive ? styles.active : styles.inactive]}>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Spielmodus</Text>
                    <Text style={styles.value}>
                        {competition.playmode}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>QTTR</Text>
                    <Text style={styles.value}>
                        {competition.fedRankFrom !== null && competition.fedRankTo !== null
                            ? `${competition.fedRankFrom} bis ${competition.fedRankTo}`
                            : 'unbegrenzt'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Ranglistenrelevant</Text>
                    <Text style={styles.value}>
                        {competition.fedRankValuation
                            ? `Ja`
                            : 'Nein'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Registrierung</Text>
                    <Text style={styles.value}>
                        {competition?.registrationEndDatetime
                            ? `bis ${new Date(competition.registrationEndDatetime).toLocaleDateString('de-DE')} | ${new Date(competition.registrationEndDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
                            : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Turnierbeginn</Text>
                    <Text style={styles.value}>
                        {competition?.startDatetime
                            ? `${new Date(competition.startDatetime).toLocaleDateString('de-DE')} | ${new Date(competition.startDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
                            : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Spielerkapazität</Text>
                    <Text style={styles.value}>
                        {competition.playerCapacityTotal !== null
                            ? `${competition.playerCapacityTotal}`
                            : 'keine Angabe'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Freie Plätze</Text>
                    <Text style={styles.value}>
                        {competition.playerCapacityRemaining !== null
                            ? `${competition.playerCapacityRemaining}`
                            : 'keine Angabe'}
                    </Text>
                </View>

            </View>
        );
    };

    return (
        <View >
            <Collapsible collapsed={collapsed}>
                <Accordion
                    activeSections={activeSections}
                    sections={sections}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={multipleSelect}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    duration={400}
                    onChange={setSections}
                    renderAsFlatList={false}
                    underlayColor='#0C0C0C'
                />
            </Collapsible>
        </View>
    );
};

export default CompetitionAccordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    column: {
        flexDirection: 'column',
        paddingBottom: 5
    },
    title_value: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 16,
        letterSpacing: 1,

        paddingTop: 5
    },
    value: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_medium',
        fontSize: 16,
        lineHeight: 19,
    },
    title: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 32,
        paddingTop: 5,
        paddingBottom: 15,
    },
    header: {
        backgroundColor: '#0C0C0C',
        padding: 10,
        paddingLeft: 25,

    },
    headerActive: {
        borderBottomWidth: 2,
        borderBottomColor: 'red'
    },
    headerText: {
        lineHeight: 40,
        fontSize: 16,
        fontFamily: 'sfpro_medium',
        color: Colors.text.base,
    },
    content: {
        paddingLeft: 25,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: Colors.text.base,

    },
    active: {
        backgroundColor: '#0C0C0C'
    },
    inactive: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});
