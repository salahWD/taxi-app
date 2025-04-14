import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import gifs from '../../../../../utils/gifs/gifs'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant';

export function LineAnimation() {
    return (
        <View style={[styles.container,]}>
            <Image source={gifs.lineAnimation} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: windowHeight(2),
        width: windowWidth(6),
    },
    image: {
        width: windowWidth(30),
        height: windowHeight(12),
        transform: [{ rotate: '-90deg' }],
        resizeMode: 'contain',
    },
});

