import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import React, { useCallback, useState } from "react";
import appColors from "../../../../../theme/appColors";
import styles from "./styles";
import { Button } from "../../../../../commonComponents";
import { InputBox } from "../../../component";
import LoginViewProps from "../../types";
import { CountryPicker } from "react-native-country-codes-picker";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useValues } from "../../../../../utils/context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../../api/store";
import { windowHeight, windowWidth } from "../../../../../theme/appConstant";
import { AuthTitle } from "../authtitle";
import { translateDataGet } from "../../../../../api/store/action";

export function LoginView({
  gotoOTP,
  gotoRegistration,
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  borderColor,
  demouser,
  setDemouser,
}: LoginViewProps) {
  const [error, setError] = useState("");
  const { colors } = useTheme();
  const { textRtlStyle, viewRtlStyle, isDark, rtl } = useValues();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state) => state.auth);
  const { translateData, settingData } = useSelector((state) => state.setting);
  const [show, setShow] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(translateDataGet());
    }, [dispatch])
  );


  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    setError("");

    if (newPhoneNumber.length === 10) {
      Keyboard.dismiss();
    }

  };
  const handleGetOTP = () => {
    if (!phoneNumber) {
      setError(translateData.enterYourPhone);
      return;
    }
    gotoOTP();
    setError("");
  };

  const goDemoUser = () => {
    setPhoneNumber("1234567890");
    setDemouser(true);
  };




  return (
    <View
      style={[
        styles.main,
        { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },
      ]}
    >
      <View style={styles.subView}>
        <AuthTitle title={translateData.authTitle} subTitle={translateData.subTitle} />
        <View style={[styles.countryCodeContainer, { flexDirection: viewRtlStyle }]}>
          <View
            style={[
              styles.codeComponent,
              { right: rtl ? windowWidth(2.5) : windowWidth(0.5) },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShow(true)}
              style={[
                styles.countryCode,
                {
                  backgroundColor: isDark
                    ? appColors.primaryFont
                    : appColors.graybackground,
                  borderColor: borderColor ? borderColor : colors.border,
                },
              ]}
            >
              <Text style={styles.dialCode}>{countryCode}</Text>
            </TouchableOpacity>

            <CountryPicker
              show={show}
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              style={{
                modal: {
                  height: 500,
                  backgroundColor: colors.background,
                },
                countryName: {
                  color: colors.text,
                },
                dialCode: {
                  color: colors.text,
                },
                countryButtonStyles: {
                  backgroundColor: colors.card,
                  flexDirection: rtl ? "row-reverse" : "row",
                },
                textInput: {
                  backgroundColor: colors.card,
                  color: colors.text,
                  textAlign: textRtlStyle,
                },
                line: { backgroundColor: colors.border },
              }}
              lang={""}
              flatListProps={{
                contentContainerStyle: {
                  flexDirection: rtl ? "row-reverse" : "row",
                },
              }}
            />
          </View>
          <InputBox
            placeholder={translateData.enterPhone}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.secondaryFont
            }
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType={"phone-pad"}
            backgroundColors={
              isDark ? appColors.primaryFont : appColors.graybackground
            }
            borderColor={
              isDark ? appColors.primaryFont : appColors.graybackground
            }
          />
        </View>
        {error && (
          <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.button}>
        <Button
          onPress={handleGetOTP}
          title={translateData.getOtp}
          backgroundColor={appColors.primary}
          color={appColors.white}
          loading={loading}
        />
      </View>
      {settingData?.values?.activation?.demo_mode == 1 ? (
        <View style={styles.demoBtn}>
          <Button
            onPress={goDemoUser}
            title={translateData.demoDriver}
            color={appColors.primary}
            borderColor={appColors.primary}
            borderWidth={windowHeight(0.1)}
          />
        </View>
      ) : null}
      <View style={styles.subView}></View>
    </View>
  );
}
