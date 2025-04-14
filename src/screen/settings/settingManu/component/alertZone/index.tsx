import { View, Text,  TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import Icons from "../../../../../utils/icons/icons";
import { ListItem } from "../";
import appColors from "../../../../../theme/appColors";
import { useValues } from "../../../../../utils/context";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { clearValue } from "../../../../../utils/localstorage";
import { resetState } from "../../../../../api/store/reducers";
import { deleteProfile, settingDataGet } from "../../../../../api/store/action";
import styles from "./styles";
import { useLoadingContext } from "../../../../../utils/loadingContext";
import { SkeletonAppPage } from "../../../appSettings/component";
import { fontSizes, windowHeight, windowWidth } from "../../../../../theme/appConstant";
import ContentLoader, { Rect } from "react-content-loader/native";
import { notificationHelper } from "../../../../../commonComponents";
import appFonts from "../../../../../theme/appFonts";

export function AlertZone() {
  const { textRtlStyle, isDark, viewRtlStyle } = useValues();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const { settingData, translateData } = useSelector((state) => state.setting);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);



  useEffect(() => {
    if (!addressLoaded) {
      setLoading(true);
        setLoading(false);
        setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);

  const deleteAccount = () => {
    notificationHelper("Delete Account", "Account Deleted Successfully", "error")
    if (settingData?.values?.activation?.login_number == 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      clearValue();
      dispatch(deleteProfile());
      dispatch(settingDataGet());
    } else if (settingData?.values?.activation?.login_number == 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginMail" }],
      });
      clearValue();
      dispatch(deleteProfile());
      dispatch(settingDataGet());
    }
  };

  const gotoLogout = () => {
    notificationHelper("Logout", "Logged Out Successfully", "error")
    if (settingData?.values?.activation?.login_number == 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      clearValue();
      dispatch(resetState());
      dispatch(settingDataGet());
    } else if (settingData?.values?.activation?.login_number == 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginMail" }],
      });
      clearValue();
      dispatch(resetState());
      dispatch(settingDataGet());
    }
  };

  const skeletonTitle = () => (
    <ContentLoader
      speed={1}
      width={windowWidth(100)}
      height={windowHeight(8)}
      viewBox={`0 0 ${windowWidth(100)} ${windowHeight(8)}`}
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={
        isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
      }
    >
      <Rect
        x={windowWidth(4)}
        y={windowHeight(1.5)}
        rx={0}
        ry={0}
        width={windowWidth(32)}
        height={windowHeight(2.5)}
      />
    </ContentLoader>
  );

  return (
    <View style={[styles.main, { backgroundColor: appColors.white }]}>
      {loading ? (
        skeletonTitle()
      ) : (
        <Text style={[styles.title, { textAlign: textRtlStyle }]}>
          {translateData.alertZone}
        </Text>
      )}

      {loading ? (
        Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.loaderStyle}>
            <SkeletonAppPage />
            <View>
              <View style={[styles.border, { borderColor: colors.border }]} />
            </View>
          </View>
        ))
      ) : (
        <View style={{bottom:windowHeight(1.8)}}>
          <ListItem
            icon={<Icons.Delete />}
            text={translateData.deleteAccount}
            backgroundColor={appColors.alertIconBg}
            color={appColors.red}
            onPress={() => setModalVisible(true)}
          />
          <View
            style={[styles.border, { borderColor: appColors.alertBorder }]}
          />
          <ListItem
            icon={<Icons.Logout />}
            text={translateData.logout}
            backgroundColor={appColors.alertIconBg}
            color={appColors.red}
            onPress={() => setModalVisible1(true)}
          />
        </View>
      )}
      <Modal
        animationType='none'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modelView}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text, textAlign: "center", width: '65%', alignSelf: 'center' }]}>
              {translateData.deleteAccountConfirm || "Are you sure you want to delete your account?"}
            </Text>

            <View style={[styles.modelButton, { flexDirection: viewRtlStyle }]}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: appColors.graybackground }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.text, textAlign: 'center', top: windowHeight(1.7), fontFamily: appFonts.medium, fontSize:fontSizes.FONT4 }}>{translateData.cancel}</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: appColors.red }]}
                onPress={deleteAccount}
              >
                <Text style={{ color: appColors.white, textAlign: 'center', top: windowHeight(1.7), fontFamily: appFonts.medium, fontSize: fontSizes.FONT4 }}>{translateData.delete}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='none'
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={styles.modelView}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text, textAlign: "center", width: '65%', alignSelf: 'center' }]}>
              {translateData.logoutConfirm}
            </Text>

            <View style={[styles.modelButton, { flexDirection: viewRtlStyle }]}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: appColors.graybackground }]}
                onPress={() => setModalVisible1(false)}
              >
                <Text style={{ color: colors.text, textAlign: 'center', top: windowHeight(1.7), fontFamily: appFonts.medium, fontSize: fontSizes.FONT4 }}>{translateData.cancel}</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: appColors.red }]}
                onPress={gotoLogout}
              >
                <Text style={{ color: appColors.white, textAlign: 'center', top: windowHeight(1.7), fontFamily: appFonts.medium, fontSize: fontSizes.FONT4 }}>{translateData.logout}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

