import { View, ScrollView } from 'react-native'
import React from 'react'
import styles from './styles'
import {  General, RegistrationDetails, Profile, SettingHeader,AlertZone } from './component/'
import { useTheme } from '@react-navigation/native'

export function Settings() {
    const { colors } = useTheme();
    
    
    return (
        <ScrollView style={[styles.main, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            <SettingHeader />
            <View style={styles.container}>
                <Profile />
                <General />
                <RegistrationDetails />
                <AlertZone/>
            </View>
        </ScrollView>
    )
}