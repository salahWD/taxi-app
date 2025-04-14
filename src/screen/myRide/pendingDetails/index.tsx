import { View, ScrollView, Modal, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { Header, Button } from "../../../commonComponents";
import appColors from "../../../theme/appColors";
import { Details } from "../component";
import { Bill } from "../../home/endRide/component";
import { Payment } from "../../home/endRide/component";
import { useRoute, useTheme } from "@react-navigation/native";
import appFonts from "../../../theme/appFonts";
import Icons from "../../../utils/icons/icons";
import OTPTextView from "react-native-otp-textinput";
import { useDispatch, useSelector } from "react-redux";
import { rideStartData } from "../../../api/store/action";
import { useValues } from "../../../utils/context";
import styles from "./styles";

export function PendingDetails() {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const { item, vehicleDetail, status } = route.params;
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [warning, setWarning] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const dispatch = useDispatch();
  const { viewRtlStyle, textRtlStyle, rtl, isDark, currSymbol, currValue } = useValues();
  const { colors } = useTheme();
  const { translateData } = useSelector((state) => state.setting);

  const gotoPickup = () => {
    setOtpModalVisible(true);
  };

  const handleChange = (otp: string) => {
    setEnteredOtp(otp);
    if (otp.length == 5) {
      setWarning("");
    }
  };
  const closeModal = () => {
    setOtpModalVisible(false);
    setLoading(true);
    let payload: ReviewInterface = {
      ride_id: item?.id,
      otp: enteredOtp,
    };

    dispatch(rideStartData(payload))
      .unwrap()
      .then((res: any) => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.main}>
      <Header title={`${item?.ride_status?.name} Ride`} />
      <ScrollView showsVerticalScrollIndicator={false}>
          <>
            <Details rideDetails={item} vehicleDetail={vehicleDetail} />
            <View style={styles.completedMainView}>
              {status === "completed" ? (
                <>
                  <Bill rideDetails={item} />
                  <Payment rideDetails={item} />
                </>
              ) : null}
            </View>
            <View style={styles.billMainView}>
              <View
                style={[
                  styles.viewBill,
                  {
                    backgroundColor: isDark ? colors.card : appColors.white,

                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rideText,
                    {
                      color: isDark ? appColors.white : appColors.primaryFont,
                      textAlign: textRtlStyle,
                    },
                  ]}
                >
                  {translateData.billSummary}
                </Text>
                <View
                  style={[
                    styles.billBorder,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.platformContainer,
                    {
                      flexDirection: viewRtlStyle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {translateData.rideFare}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {currSymbol}{currValue * item?.sub_total}
                  </Text>
                </View>
                <View
                  style={[
                    styles.platformContainer,
                    {
                      flexDirection: viewRtlStyle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {translateData.tax}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {currSymbol}{currValue *item?.tax}
                  </Text>
                </View>
                <View
                  style={[
                    styles.platformContainer,
                    {
                      flexDirection: viewRtlStyle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {translateData.platformFees}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {currSymbol}{currValue *item?.platform_fees}
                  </Text>
                </View>
                <View
                  style={[
                    styles.billBorder,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.billView,
                    {
                      flexDirection: viewRtlStyle,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: appFonts.regular,
                      color: isDark ? appColors.white : appColors.primaryFont,
                    }}
                  >
                    {translateData.totalBill}
                  </Text>
                  <Text
                    style={{
                      fontFamily: appFonts.regular,
                      color: appColors.price,
                    }}
                  >
                    {currSymbol}{currValue * item?.total}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.pendingView}>
              {item?.payment_status == "PENDING" ? (
                <View
                  style={[
                    styles.completedPaymentView,
                    {
                      backgroundColor: isDark ? colors.card : appColors.white,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={styles.completedPaymentText}>
                    {translateData.paymentPending}
                  </Text>
                  <TouchableOpacity style={styles.refreshView}>
                    <Text style={styles.refreshText}>
                      {translateData.refresh}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.paymentView}>
                  <Payment rideDetails={item} />
                </View>
              )}
            </View>
            <View style={styles.bottomView} />
          </>
        {/* )} */}
      </ScrollView>
      <View style={styles.buttonView}>
        {item?.ride_status?.slug == "accepted" && (
          <Button
            backgroundColor={appColors.primary}
            color={appColors.white}
            title={translateData.pickupCustomer}
            onPress={gotoPickup}
          />
        )}
        {item?.ride_status?.slug == "started" && (
          <Button
            backgroundColor={appColors.primary}
            color={appColors.white}
            title={translateData.trackRide}
            onPress={gotoPickup}
          />
        )}
        {item?.ride_status?.slug == "completed" &&
          item?.payment_status == "PENDING" && (
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData.requestPayment}
              onPress={gotoPickup}
            />
          )}
        {item?.ride_status?.slug == "completed" &&
          item?.payment_status == "COMPLETE" && (
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData.reviewCustomer}
              onPress={gotoPickup}
            />
          )}
      </View>
      <Modal
        visible={otpModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.card : appColors.white },
            ]}
          >
            <TouchableOpacity
              style={[styles.closeBtn, { flexDirection: viewRtlStyle }]}
              onPress={closeModal}
            >
              <Icons.Close />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalText,
                { color: isDark ? colors.text : appColors.primaryFont },
              ]}
            >
              {translateData.otpConfirm}
            </Text>
            <Text
              style={[
                styles.otpTitle,
                { textAlign: textRtlStyle },
                { color: isDark ? colors.text : appColors.primaryFont },
              ]}
            >
              {translateData.enterOTP}
            </Text>
            <OTPTextView
              containerStyle={[
                styles.otpContainer,
                { flexDirection: viewRtlStyle },
              ]}
              textInputStyle={[
                styles.otpInput,
                {
                  backgroundColor: isDark
                    ? colors.background
                    : appColors.graybackground,
                },
                { color: colors.text },
              ]}
              handleTextChange={handleChange}
              inputCount={4}
              keyboardType="numeric"
              tintColor="transparent"
              offTintColor="transparent"
            />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Button
                title={translateData.verify}
                color={appColors.white}
                onPress={closeModal}
                backgroundColor={appColors.primary}
                margin="0"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
