import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import BaseScreen from '@/components/BaseScreen';
import { useAuth } from '@/providers/AuthProvider';


const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const { setSession } = useAuth()
    async function signInWithEmail() {
        setLoading(true)
        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            Alert.alert(error.message)
        }
        setLoading(false)

    }
    return (
        <BaseScreen ellipse={false} marginBottom={0}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Sign in', headerShown: false }} />

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

                <Button onPress={signInWithEmail} disabled={loading} text={loading ? 'Signing in...' : 'Sign in'} />
                <Link href="/sign-up" style={styles.textButton}>
                    Create an account
                </Link>
            </View>
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
});

export default SignInScreen;