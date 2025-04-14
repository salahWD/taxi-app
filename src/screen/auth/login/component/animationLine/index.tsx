import { View, Image } from 'react-native'
import React from 'react'
import { windowHeight } from '../../../../../theme/appConstant';
import { useValues } from '../../../../../utils/context';
import styles from './styles';

export function LineAnimation() {
    const { rtl } = useValues()
    return (
        <View style={[
            styles.container,
            { alignSelf: rtl ? 'flex-end' : 'flex-start' }
        ]}>
            <Image
                style={[
                    styles.image,
                    { right: rtl ? windowHeight(2) : windowHeight(0.5) }
                ]}
                source={require('../../../../../assets/gif/line.gif')}
            />
        </View>
    )
}

