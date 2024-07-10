import { View, Text, TextInput, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/providers/AuthProvider';
import BaseScreen from '@/components/BaseScreen';
const SignUpScreen = () => {
    const { setSession } = useAuth()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [ageGroup, setageGroup] = useState('')
    const [qttr, setQttr] = useState(0)

    async function signUpWithEmail() {
        setLoading(true)
        const { error, data } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) {
            Alert.alert(error.message)
        }
        if (data.session) {
            const profileId = data.session.user.id;
            const { data: player_profile, error } = await supabase
                .from('player_profiles')
                .insert([
                    {
                        profile_id: profileId,
                        ageGroup: ageGroup,
                        fedRank: qttr
                    }
                ]);
            setSession(data.session)

        }
        setLoading(false)

    }
    return (
        <BaseScreen ellipse={false} marginBottom={0}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Stack.Screen options={{ title: 'Sign up', headerShown: false }} />

                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="enter Username..."
                        style={styles.input}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="jon@gmail.com"
                        style={styles.input}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder=""
                        style={styles.input}
                        secureTextEntry
                    />
                    <Text style={styles.label}>QTTR Wert</Text>
                    <TextInput
                        value={String(qttr)}
                        onChangeText={text => setQttr(Number(text))}
                        placeholder=""
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <Text style={[styles.label, { paddingTop: 20 }]}>Spielklasse</Text>
                    <Picker
                        selectedValue={ageGroup}
                        onValueChange={(itemValue, itemIndex) => setageGroup(itemValue)}
                        itemStyle={styles.picker_item}
                    >
                        <Picker.Item label="Junioren" value="Junioren" />
                        <Picker.Item label="Damen" value="Damen" />
                        <Picker.Item label="Herren" value="Herren" />
                        <Picker.Item label="Senioren" value="Senioren" />
                        <Picker.Item label="Seniorinnen" value="Seniorinnen" />
                    </Picker>
                    <Button onPress={signUpWithEmail} disabled={loading} text={loading ? 'Creating account...' : 'Create account'} />
                    <Link href="/sign-in" style={styles.textButton}>
                        Sign in
                    </Link>
                </View>
            </TouchableWithoutFeedback>
        </BaseScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
        //backgroundColor: Colors.dark.background

    },
    label: {
        color: Colors.text.lightgray,
        fontFamily: 'Staatliches',
        letterSpacing: 1,
        fontSize: 16
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderRadius: 5,
        color: Colors.text.base

    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.text.base,
        marginVertical: 10,
    },
    picker_item: {
        color: Colors.text.base
    }
});

export default SignUpScreen;