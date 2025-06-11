import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Header, Button } from "../../../commonComponents";
import appColors from "../../../theme/appColors";
import { Details } from "../component";
import { Bill } from "../../home/endRide/component";
import { Payment } from "../../home/endRide/component";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/main/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import appFonts from "../../../theme/appFonts";
import Icons from "../../../utils/icons/icons";
import OTPTextView from "react-native-otp-textinput";
import { useDispatch, useSelector } from "react-redux";
import { rideStartData, rideEndPatch } from "../../../api/store/action";
import { useValues } from "../../../utils/context";
import styles from "./styles";

type navigation = NativeStackNavigationProp<RootStackParamList>;

interface RouteParams {
  item: any;
  vehicleDetail: any;
  status: string;
}

export function PendingDetails() {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const { vehicleDetail, status } = (route.params as RouteParams) || {};
  const [item, setItem] = useState((route.params as RouteParams)?.item);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [warning, setWarning] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const dispatch = useDispatch();
  const { viewRtlStyle, textRtlStyle, rtl, isDark, currSymbol, currValue } =
    useValues();
  const { colors } = useTheme();
  const { translateData, taxidoSettingData } = useSelector(
    (state) => state.setting
  );
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const navigation = useNavigation<navigation>();

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 8);
  };

  const startTimer = () => {
    const now = new Date();

    setStartTime(now);
    setElapsedSeconds(0);
    setIsRunning(true);
    return now;
  };

  const gotoPickup = () => {
    if (loading) return;
    setLoading(true);
    if (taxidoSettingData.taxido_values.activation.ride_otp == "0") {
      const now = startTimer();
      let payload = {
        ride_id: item?.id,
        start_time: formatTime(now),
      };
      console.log("no otp required", payload);

      dispatch(rideStartData(payload))
        .unwrap()
        .then((res: any) => {
          console.log("responce of ride start data", res);
          if (res?.message && !res?.success) {
            Alert.alert("Error", res.message);
          } else {
            setItem(res);
            console.log("trip started successfully");
          }
          setLoading(false);
          setOtpModalVisible(false);
        })
        .catch(() => {
          setLoading(false);
          setOtpModalVisible(false);
        });
    } else {
      setOtpModalVisible(true);
    }
  };

  const handleChange = (otp: string) => {
    setEnteredOtp(otp);
    if (otp.length == 5) {
      setWarning("");
    }
  };

  const closeModal = () => {
    if (loading) return;
    const now = startTimer();
    setOtpModalVisible(false);
    setLoading(true);
    let payload = {
      ride_id: item?.id,
      otp: enteredOtp,
      start_time: formatTime(now),
    };
    console.log("otp sent", payload);

    dispatch(rideStartData(payload))
      .unwrap()
      .then((res: any) => {
        console.log("responce of ride start data", res);
        if (res?.message && !res?.success) {
          Alert.alert("Error", res.message);
        } else {
          setItem(res);
          console.log("trip started successfully");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log(item?.ride_status?.slug);
  }, []);

  useEffect(() => {
    if (isRunning && startTime) {
      const timerInterval = setInterval(() => {
        const now = new Date();
        const secondsGap = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedSeconds(secondsGap);
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [isRunning, startTime]);

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
                  {currSymbol}
                  {currValue * item?.sub_total}
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
                  {currSymbol}
                  {currValue * item?.tax}
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
                  {currSymbol}
                  {currValue * item?.platform_fees}
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
                  {currSymbol}
                  {currValue * item?.total}
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
      </ScrollView>
      <View style={styles.buttonView}>
        {item?.ride_status?.slug == "accepted" && (
          <Button /* pickup customer button */
            backgroundColor={appColors.primary}
            color={appColors.white}
            // title={translateData.pickupCustomer}
            title={"Start Ride"}
            onPress={() => gotoPickup()}
            loading={loading}
          />
        )}
        {item?.ride_status?.slug == "started" && (
          <Button /* track ride button */
            backgroundColor={appColors.primary}
            color={appColors.white}
            // title={translateData.trackRide}
            title={"End Trip"}
            onPress={() => gotoPickup()}
            loading={loading}
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
              onPress={() => gotoPickup()}
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
            <TouchableOpacity
              onPress={() => gotoPickup()}
              style={styles.closeButton}
            >
              <Button
                title={translateData.verify}
                color={appColors.white}
                // onPress={closeModal}
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
