import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icons from "../../../../utils/icons/icons";
import styles from "./styles";
import { rideIcons } from "../../homeScreen/data";
import { useTheme, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../../utils/context";
import { textRtlStyle } from "../../../../style/rtlStyles";
import { windowHeight } from "../../../../theme/appConstant";

interface RenderRideItemProps {
  item: any;
  colors: any;
}
type navigation = NativeStackNavigationProp<RootStackParamList>;

export function RenderRideItem({ item, colors }: RenderRideItemProps) {
  const iconIndex = parseInt(item.id) - 1;
  const { viewRtlStyle, textRtlStyle } = useValues();
  const icon = rideIcons[iconIndex];
  const navigation = useNavigation<navigation>();

  const gotoDetail = (item) => {
    const navigateToScreen = (screen, isValue = 1) => {
      navigation.navigate(screen, { isValue });
    };

    const titleToValueMap = {
      "Total Earning": 1,
      "Pending Rides": 1,
      "Completed Rides": 2,
      "Cancelled Rides": 3,
    };

    const isValue = titleToValueMap[item.title] ?? 1;
    navigateToScreen(item.screen, isValue);
  };

  return (
    <TouchableOpacity
      onPress={() => gotoDetail(item)}
      style={styles.main}
      activeOpacity={0.8}
    >
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.card,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <View style={[styles.cardTop, { flexDirection: viewRtlStyle }]}>
            <View>
              <Text style={styles.data}>{item.dashBoardData}</Text>
            </View>
            <View
              style={[
                styles.iconContain,
                { backgroundColor: colors.background },
              ]}
            >
              {icon}
            </View>
          </View>
          <View style={[styles.cardBottom, { flexDirection: viewRtlStyle }]}>
            <View>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                  { textAlign: textRtlStyle },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <View style={styles.iconSpace}>
              <Icons.Arrow />
            </View>
          </View>
          <View style={styles.bottomBorder} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
