import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import Icons from "../../../../../utils/icons/icons";
import appColors from "../../../../../theme/appColors";
import { ListItem } from "../";
import { useNavigation, useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/main/types";
import { useValues } from "../../../../../utils/context";
import { useLoadingContext } from "../../../../../utils/loadingContext";
import { SkeletonAppPage } from "../../../appSettings/component";
import { windowHeight } from "../../../chat/context";
import ContentLoader, { Rect } from "react-content-loader/native";
import { windowWidth } from "../../../../../theme/appConstant";
import { useSelector } from "react-redux";
import { settingDataGet } from "../../../../../api/store/action";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function General() {
  const navigation = useNavigation<Navigation>();
  const { colors } = useTheme();
  const { textRtlStyle, isDark } = useValues();
  const [loading, setLoading] = useState(false);
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    const fetchData = async () => {
      if (!addressLoaded) {
        setLoading(true);
        await settingDataGet();
        setLoading(false);
        setAddressLoaded(true);
      }
    };
  
    fetchData();
  }, [addressLoaded, setAddressLoaded]);
  

  const loaderTitle = () => (
    <ContentLoader
      speed={1}
      width={windowWidth(38)}
      height={windowHeight(18)}
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight}
    >
      <Rect
        x="0" 
        y="0" 
        width={windowWidth(40)} 
        height={windowHeight(15)} 
        rx={0} 
        ry={0} 
      />
    </ContentLoader>
  );
  return (
    <View>
      {loading ? loaderTitle() : (
        <Text
          style={[styles.title, { color: colors.text, textAlign: textRtlStyle }]}>
          {translateData.general}
        </Text>
      )}
      <View
        style={[
          styles.listView,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              style={styles.loaderStyle}
            >
              <SkeletonAppPage />
              {index !== 4 && (
                <View style={styles.loaderBorder}>
                  <View style={[styles.border, { borderColor: colors.border }]} />
                </View>
              )}
            </View>
          ))
        ) : (
          <>
            <ListItem
              icon={<Icons.UserSetting color={colors.text} />}
              text={translateData.profileSettings}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("ProfileSetting")}
              showNextIcon={true}
            />
            <View style={[styles.border, { borderColor: colors.border }]} />

            <ListItem
              icon={<Icons.WalletSetting color={colors.text} />}
              text={translateData.myWallet}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("MyWallet")}
              showNextIcon
            />
            <View style={[styles.border, { borderColor: colors.border }]} />

            <ListItem
              icon={<Icons.Bank color={colors.text} />}
              text={translateData.appSetting}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("AppSettings")}
              showNextIcon
            />
            <View style={[styles.border, { borderColor: colors.border }]} />

            <ListItem
              icon={<Icons.Subscription color={colors.text} />}
              text={translateData.subscriptionPlan}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("Subscription")}
              showNextIcon
            />
            <View style={[styles.border, { borderColor: colors.border }]} />

            <ListItem
              icon={<Icons.VehicleList color={colors.text} />}
              text={translateData.rentalVehicle}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("VehicleList")}
              showNextIcon
            />
            <View style={[styles.border, { borderColor: colors.border }]} />

            <ListItem
              icon={<Icons.MessageEmpty color={colors.text} />}
              text={translateData.supportTicket}
              backgroundColor={isDark ? colors.background : appColors.graybackground}
              color={isDark ? appColors.white : appColors.primaryFont}
              onPress={() => navigation.navigate("SupportTicket")}
              showNextIcon
            />
          </>
        )}
      </View>
    </View>
  );
}
