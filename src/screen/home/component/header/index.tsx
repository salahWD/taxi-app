import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import SwitchToggle from "react-native-switch-toggle";
import Icons from "../../../../utils/icons/icons";
import appColors from "../../../../theme/appColors";
import styles from "./styles";
import images from "../../../../utils/images/images";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useValues } from "../../../../utils/context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main/types";

interface HeaderProps {
  isOn: boolean;
  toggleSwitch: () => void;
}

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function Header({ isOn, toggleSwitch }: HeaderProps) {
  const { colors } = useTheme();
  const { viewRtlStyle } = useValues();
  const { navigate } = useNavigation<navigation>();

  return (
    <View style={styles.headerMain}>
      <View style={styles.headerMargin}>
        <View style={[styles.headerAlign, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.headerTitle, { flexDirection: viewRtlStyle }]}>
            <Image source={images.splash} style={styles.logo} />
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            activeOpacity={0.5}
            onPress={() => navigate("Notification")}
          >
            <Icons.Notification color={appColors.white} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.switchContainer,
            { backgroundColor: colors.card, flexDirection: viewRtlStyle },
          ]}
        >
          <View style={{ flexDirection: viewRtlStyle, gap: 3 }}>
            <Text style={[styles.valueTitle, { color: colors.text }]}>
              Available For Ride
            </Text>
            <Text
              style={[
                styles.valueTitle,
                { color: isOn ? appColors.price : appColors.red },
              ]}
            >
              {isOn ? " ( Online )" : " ( Offline )"}
            </Text>
          </View>
          <SwitchToggle
            switchOn={isOn}
            onPress={toggleSwitch}
            circleStyle={styles.switchCircle}
            backgroundColorOff={appColors.cardicon}
            backgroundColorOn={appColors.primary}
            circleColorOn={"white"}
            circleColorOff={appColors.primary}
            containerStyle={styles.containerStyle}
          />
        </View>
      </View>
    </View>
  );
}
