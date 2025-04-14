import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from '../renderVehicleList/styles';
import appColors from '../../../../../../theme/appColors';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { serviceDataGet } from '../../../../../../api/store/action/serviceAction';
import { useValues } from '../../../../../../utils/context';

interface RenderItemsProps {
    selectedItemIndex: number;
    handleItemPress: (index: number, name: string, id: number, slug: string) => void;
}

export function RenderServiceList({ selectedItemIndex, handleItemPress }: RenderItemsProps) {
    const { serviceData } = useSelector(state => state.service);
    const dispatch = useDispatch();
    const { viewRtlStyle, isDark } = useValues()

    useEffect(() => {
        getService();
    }, []);

    const getService = () => {
        dispatch(serviceDataGet());
    };

    const { colors } = useTheme();

    return (
        <>
            {serviceData?.data?.map((item, index) => (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={index}
                    style={[
                        styles.listView,
                        {
                            borderColor: isDark
                                ? colors.border
                                : selectedItemIndex === index
                                    ? appColors.subPrimary
                                    : appColors.white,

                            backgroundColor: isDark
                                ? selectedItemIndex === index
                                    ? appColors.primary
                                    : colors.card
                                : selectedItemIndex === index
                                    ? appColors.subPrimary
                                    : appColors.white,



                        },
                    ]}
                    onPress={() => handleItemPress(index, item.name, item.id, item.slug)}
                >
                    <View style={[styles.iconAndTextContainer, { flexDirection: viewRtlStyle }]}>
                        <SvgUri
                            width={34}
                            height={34}
                            uri={item.service_icon.original_url}
                            stroke="blue"
                            fill="none"
                        />
                    </View>
                    <Text
                        style={[
                            styles.serviceTitle,
                            {
                                color: selectedItemIndex === index ? appColors.black : colors.text,
                            },
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </>
    );
}
