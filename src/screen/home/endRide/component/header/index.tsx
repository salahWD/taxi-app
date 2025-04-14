import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'

export function Header() {
    const navigation = useNavigation();
    const {viewRtlStyle}=useValues()
    const gotoBack = () => {
        navigation.goBack();

    }
    return (
        <View style={[styles.header,{flexDirection:viewRtlStyle}]}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backView} onPress={gotoBack}>
                <Icons.Back />
            </TouchableOpacity>
            <Text style={styles.activeRide}>Complete Ride</Text>
            <View style={styles.downloadView}>
                <Icons.Download />
            </View>
        </View>
    )
}