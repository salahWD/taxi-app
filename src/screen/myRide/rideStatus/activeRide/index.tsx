import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer';
import appColors from '../../../../theme/appColors';
import { useValues } from '../../../../utils/context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/main/types';
import { useNavigation } from '@react-navigation/native';

type PendingProp = NativeStackNavigationProp<RootStackParamList>;

export function ActiveRide() {
  const { navigate } = useNavigation<PendingProp>();
  const { t } = useValues();
  return (
    <View>
      <RideContainer
        status={'started'}
        onPress={() => navigate('PendingDetails')}
        color={appColors.activeColor} />
    </View>
  );
};
