import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  ScrollView,
} from "react-native";
import appColors from "../../../../theme/appColors";
import { ProgressBar } from "../component";
import { Input, Button } from "../../../../commonComponents";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Header, TitleView } from "../../component";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main/types";
import Icons from "../../../../utils/icons/icons";
import { useValues } from "../../../../utils/context";
import { CountryPicker } from "react-native-country-codes-picker";
import { windowWidth } from "../../../intro/onBoarding/styles";
import { useSelector } from "react-redux";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function CreateAccount() {
  const navigation = useNavigation<navigation>();
  const [showWarning, setShowWarning] = useState(false);
  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const { colors } = useTheme();
  const { textRtlStyle, viewRtlStyle, isDark, setAccountDetail, rtl } =
    useValues();
  const [countryCode, setCountryCode] = useState("+1");
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { translateData } = useSelector((state) => state.setting);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: countryCode,
  });




  const handleChange = (key: string, value: string) => {
    if (key === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length >= 10) {
        Keyboard.dismiss();
      }

      setFormData((prevData) => ({
        ...prevData,
        [key]: numericValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }

    if (key === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value.trim() === "") {
        setEmailFormatWarning(translateData.emailVerify);
      } else if (!emailRegex.test(value.trim())) {
        setEmailFormatWarning(translateData.emailformate);
      } else {
        setEmailFormatWarning("");
      }
    }

  };



  const gotoDocument = () => {
    const phoneNumber = formData.phoneNumber.trim();
    const isPhoneNumberValid = phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber);
    const isEmailEmpty = formData.email.trim() === "";
    const isEmailInvalid = !isEmailEmpty && emailFormatWarning !== "";
    const isPasswordEmpty = formData.password.trim() === "";
    const isConfirmPasswordEmpty = formData.confirmPassword.trim() === "";
    const doPasswordsMatch = formData.password === formData.confirmPassword;

    if (!isPhoneNumberValid) {
      setShowWarning(true);
      setError(translateData.invalidPhoneNumber);
      return;
    }

    if (isEmailEmpty) {
      setShowWarning(true);
      setError(translateData.enterYourEmail);
      return;
    }

    if (isEmailInvalid) {
      setShowWarning(true);
      setError(translateData.emailformate);
      return;
    }

    if (isPasswordEmpty || isConfirmPasswordEmpty) {
      setShowWarning(true);
      setError(translateData.password);
      return;
    }

    if (!doPasswordsMatch) {
      setShowWarning(true);
      setError(translateData.doNotMatch);
      return;
    }

    setShowWarning(false);
    setError("");

    setAccountDetail(formData);
    navigation.navigate("DocumentVerify");
  };
  return (
    <View style={{ flex: 1 }}>
      <Header backgroundColor={isDark ? colors.card : appColors.white} />
      <ProgressBar fill={1} />
      <ScrollView style={[styles.subView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.space}>
          <TitleView
            title={translateData.createAccount}
            subTitle={translateData.registerContent}
          />
          <Input
            title={translateData.userName}
            titleShow={true}
            placeholder={translateData.enterUserName}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            showWarning={showWarning && formData.username === ""}
            warning={translateData.enterYouruserName}
            backgroundColor={
              isDark ? appColors.darkThemeSub : appColors.white
            }
            borderColor={colors.border}
          />
          <View style={styles.name}>
            <Input
              title={translateData.name}
              titleShow={true}
              placeholder={translateData.enterYourName}
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              showWarning={showWarning && formData.name === ""}
              warning={translateData.pleaseEnterYourName}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
              borderColor={colors.border}
            />
          </View>
          <Text
            style={[styles.mobileNumber, {

              color: isDark ? appColors.white : appColors.primaryFont,

              textAlign: textRtlStyle,
            }]}
          >
            {translateData.mobileNumber}
          </Text>

          <View
            style={styles.country}
          >
            <View style={{ flexDirection: viewRtlStyle, width: "100%" }}>
              <View
                style={[
                  styles.codeComponent,
                  { right: rtl ? windowWidth(12) : windowWidth(0.5) },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShow(true)}
                  style={[
                    styles.countryCode,
                    {
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.white,
                      borderColor: colors.border,
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
                    line: { borderColor: colors.border },
                  }}
                  lang={""}
                  flatListProps={{
                    contentContainerStyle: {
                      flexDirection: rtl ? "row-reverse" : "row",
                    },
                  }}
                />
              </View>

              <View
                style={[styles.phone, {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  flexDirection: viewRtlStyle,

                }]}
              >
                <TextInput
                  placeholder={translateData.enterPhone}
                  placeholderTextColor={
                    isDark ? appColors.darkText : appColors.secondaryFont
                  }
                  value={formData.phoneNumber}
                  onChangeText={(text) => {
                    handleChange("phoneNumber", text);
                    if (text.length === 10 && /^\d{10}$/.test(text)) {
                      setError("");
                    } else {
                      setError(translateData.invalidPhoneNumber || "Please Enter a Valid 10-Digit Mobile Number");
                    }
                  }}
                  keyboardType={"phone-pad"}
                  style={[
                    styles.number,
                    {
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.white,
                    },
                    { color: isDark ? appColors.white : appColors.black },
                  ]}
                />
              </View>
            </View>
            {error && (
              <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
                {error}
              </Text>
            )}
          </View>
          <View style={styles.email}>
            <Input
              title={translateData.email}
              titleShow={true}
              placeholder={translateData.enterEmail}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              showWarning={showWarning && formData.email === ""}
              warning={translateData.emailVerify}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
              borderColor={colors.border}
            />
          </View>
          {emailFormatWarning !== "" && (
            <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
              {emailFormatWarning}
            </Text>
          )}

          <Input
            title={translateData.pw}
            titleShow={true}
            placeholder={translateData.password}
            value={formData.password}
            warning={
              showWarning && formData.password === ""
                ? translateData.password
                : formData.password.length > 0 && formData.password.length < 8
                  ? translateData.passwordMinLength
                  : ""
            }
            onChangeText={(text) => handleChange("password", text)}
            showWarning={showWarning && (formData.password === "" || formData.password.length < 8)}
            backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
            borderColor={colors.border}
            rightIcon={
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClose />}
              </TouchableOpacity>
            }
            secureText={!isPasswordVisible}
          />

          <View style={styles.password}>
            <Input
              title={translateData.cPw}
              titleShow={true}
              placeholder={translateData.confirmPassword}
              value={formData.confirmPassword}
              warning={
                showWarning && formData.confirmPassword === ""
                  ? translateData.confirmPassword
                  : formData.password !== formData.confirmPassword &&
                    formData.confirmPassword !== ""
                    ? translateData.doNotMatch
                    : ""
              } onChangeText={(text) => handleChange("confirmPassword", text)}
              showWarning={
                showWarning && formData.confirmPassword === "" ||
                (formData.password !== formData.confirmPassword &&
                  formData.confirmPassword !== "")
              } backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
              borderColor={colors.border}
              rightIcon={
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  {isConfirmPasswordVisible ? (
                    <Icons.EyeOpen />
                  ) : (
                    <Icons.EyeClose />
                  )}
                </TouchableOpacity>
              }
              secureText={!isConfirmPasswordVisible}
            />
          </View>
        </View>
        <View style={styles.margin}>
          <Button
            onPress={gotoDocument}
            title={translateData.next}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        </View>
      </ScrollView>

    </View>
  );
}
