import { View, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { TaxiDetails } from "../../../endRide/component";
import commanStyle from "../../../../../style/commanStyles";
import Icons from "../../../../../utils/icons/icons";
import styles from "./styles";
import appColors from "../../../../../theme/appColors";
import { DriverProfile } from "../../../../../commonComponents";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/main/types";
import { useValues } from "../../../../../utils/context";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function Profile({ userDetails, rideDetails }) {
  const { colors } = useTheme();
  const { viewRtlStyle } = useValues();
  const navigation = useNavigation<navigation>();

  //   const gotoChat = () => {
  //     navigation.navigate("Chat", {
  //       driverId: rideDetails?.driver?.id,
  //       riderId: rideDetails?.rider?.id,
  //       rideId: rideDetails?.id,
  //       riderName: rideDetails?.rider?.name,
  //       riderImage: rideDetails?.rider?.profile_image?.original_url,
  //     });
  //   };

  const gotoCall = () => {
    const phoneNumber = userDetails.phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.profile, { flexDirection: viewRtlStyle }]}>
        <DriverProfile
          borderRadius={25}
          backgroundColor={appColors.white}
          iconColor={appColors.primary}
          showCarTitle={true}
          showInfoIcon={false}
          userDetails={userDetails}
        />
        <View style={commanStyle.containerBtn}>
          {/* <TouchableOpacity style={commanStyle.iconButton} onPress={gotoChat}>
                        <Icons.Message color={appColors.primary} />
                    </TouchableOpacity> */}
          <TouchableOpacity
            style={commanStyle.iconButton}
            activeOpacity={0.5}
            onPress={gotoCall}
          >
            <Icons.Call color={appColors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <TaxiDetails />
    </View>
  );
}
