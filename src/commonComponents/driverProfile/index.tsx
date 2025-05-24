import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import Icons from "../../utils/icons/icons";
import commanStyle from "../../style/commanStyles";
import styles from "./styles";
import images from "../../utils/images/images";
import { useTheme } from "@react-navigation/native";
import { useValues } from "../../utils/context";
import { windowWidth } from "../../theme/appConstant";
import appColors from "../../theme/appColors";

interface DriverProfileProps {
  borderRadius: number;
  backgroundColor: string;
  iconColor: string;
  showCarTitle?: boolean;
  userDetails?: string;
  rideDetails?: any;
}
export function DriverProfile({
  borderRadius,
  iconColor,
  userDetails,
  rideDetails,
}: DriverProfileProps) {
  const { colors } = useTheme();
  const { viewRtlStyle, isDark, rtl } = useValues();

  const gotoCall = () => {
    const phoneNumber = rideDetails?.rider.phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View
      style={[
        styles.profile,
        {
          backgroundColor: colors.card,
          flexDirection: viewRtlStyle,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.subProfile, { flexDirection: viewRtlStyle }]}>
        <Image
          source={
            userDetails?.profile_image?.original_url
              ? { uri: userDetails?.profile_image?.original_url }
              : images.ProfileDefault
          }
          style={[styles.userImage, { borderRadius: borderRadius }]}
        />

        <View>
          <View
            style={[
              commanStyle.directionRow,
              { flexDirection: viewRtlStyle, marginHorizontal: windowWidth(2) },
            ]}
          >
            <Text
              style={[
                styles.userName,
                { color: colors.text },
                { left: rtl ? windowWidth(1.6) : windowWidth(2) },
              ]}
            >
              {userDetails?.name || rideDetails?.rider?.name}
            </Text>
          </View>
          <View style={{ flexDirection: viewRtlStyle }}>
            <View
              style={[styles.starContainer, { flexDirection: viewRtlStyle }]}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const fullStarThreshold = index + 1;
                const halfStarThreshold = index + 0.5;
                if (rideDetails?.rider?.rating_count >= fullStarThreshold) {
                  return <Icons.RatingStar key={index} />;
                } else if (
                  rideDetails?.rider?.rating_count >= halfStarThreshold
                ) {
                  return <Icons.RatingHalfStar key={index} />;
                } else {
                  return <Icons.RatingEmptyStar key={index} />;
                }
              })}
              <Text
                style={[
                  commanStyle.totalReview,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {rideDetails?.rider?.rating_count}
                <Text style={{ color: appColors.secondaryFont }}>
                  ({rideDetails?.rider?.reviews_count})
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[commanStyle.containerBtn, { flexDirection: viewRtlStyle }]}>
        {/* <TouchableOpacity
          style={[
            commanStyle.iconButton,
            { borderColor: colors.border },
          ]}
          onPress={gotoChat}
        >
          <Icons.Message color={iconColor} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[commanStyle.iconButton, { borderColor: colors.border }]}
          activeOpacity={0.5}
          onPress={gotoCall}
        >
          <Icons.Call color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
