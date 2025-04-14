import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../auth/registration/bankDetails/styles";
import appColors from "../../../theme/appColors";
import { Header, Input, Button, notificationHelper } from "../../../commonComponents";
import { useNavigation, useTheme } from "@react-navigation/native";
import { TitleView } from "../../auth/component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import Icons from "../../../utils/icons/icons";
import { useSelector } from "react-redux";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function BankDetails() {
  const navigation = useNavigation<navigation>();
  const [showWarning, setShowWarning] = useState(false);
  const { colors } = useTheme();
  const { selfDriver } = useSelector((state: any) => state.account);
  const [formData, setFormData] = useState({
    holdername: "",
    accountnumber: "",
    ifsccode: "",
    bank: "",
    branch: "",
  });
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    if (selfDriver) {
      setFormData({
        holdername: selfDriver?.payment_account.bank_holder_name || "",
        accountnumber: selfDriver?.payment_account.bank_account_no || "",
        ifsccode: selfDriver?.payment_account.ifsc || "",
        bank: selfDriver?.payment_account.bank_name || "",
        branch: selfDriver?.payment_account.bank_account_no || "",
      });
    }
  }, [selfDriver]);

  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const gotoDocument = () => {
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      navigation.goBack();
      notificationHelper("Update", translateData.detailsUpdateSuccessfully, "success")
    }
  };

  return (
    <ScrollView style={[styles.main, { backgroundColor: colors.background }]}>
      <Header title={translateData.bankDetails} />
      <View style={[styles.subView, { backgroundColor: colors.background }]}>
        <View style={styles.inputfildView}>
          <TitleView
            title={translateData.bankDetails}
            subTitle={translateData.registerContent}
          />
          <Input
            titleShow={true}
            title={translateData.holderName}
            placeholder={translateData.enterHolderName}
            value={formData.holdername}
            onChangeText={(text) => handleChange("holdername", text)}
            showWarning={showWarning && formData.holdername === ""}
            warning={translateData.enterYourholderName}
            backgroundColor={colors.card}
            icon={<Icons.UserName color={appColors.secondaryFont} />}
          />
          <Input
            titleShow={true}
            title={translateData.accountNumber}
            placeholder={translateData.enterAccountNumber}
            keyboardType="default"
            value={formData.accountnumber}
            onChangeText={(text) => handleChange("accountnumber", text)}
            showWarning={showWarning && formData.accountnumber === ""}
            warning={translateData.enterYouraccountNumber}
            backgroundColor={colors.card}
            icon={<Icons.AccountNo color={appColors.secondaryFont} />}
          />
          <Input
            titleShow={true}
            title={translateData.ifscCode}
            placeholder={translateData.enterIFSCCode}
            value={formData.ifsccode}
            onChangeText={(text) => handleChange("ifsecode", text)}
            showWarning={showWarning && formData.ifsccode === ""}
            warning={translateData.enterYourifscCode}
            backgroundColor={colors.card}
            icon={<Icons.AccountIFSC color={appColors.secondaryFont} />}
            keyboardType="default"
          />
          <Input
            titleShow={true}
            title={translateData.bankName}
            placeholder={translateData.enterBankName}
            value={formData.bank}
            onChangeText={(text) => handleChange("bank", text)}
            showWarning={showWarning && formData.bank === ""}
            warning={translateData.enterYorebankName}
            backgroundColor={colors.card}
            icon={<Icons.Bank color={appColors.secondaryFont} />}
          />
          <Input
            titleShow={true}
            title={translateData.branchName}
            placeholder={translateData.enterBranchName}
            value={formData.branch}
            onChangeText={(text) => handleChange("branch", text)}
            showWarning={showWarning && formData.branch === ""}
            warning={translateData.enterYourbranchName}
            backgroundColor={colors.card}
            icon={<Icons.Bank color={appColors.secondaryFont} />}
          />
        </View>

        <View style={styles.buttonView}>
          <Button
            onPress={gotoDocument}
            title={translateData.update}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        </View>
      </View>
    </ScrollView>
  );
}
