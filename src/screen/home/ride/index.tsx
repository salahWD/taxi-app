import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import appColors from "../../../theme/appColors";
import {
  useNavigation,
  useTheme,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import styles from "./styles";
import { Map } from "../../mapView";
import commanStyles from "../../../style/commanStyles";
import {
  Button,
  BackButton,
  notificationHelper,
} from "../../../commonComponents";
import { UserDetails } from "./component/userDetails";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../utils/context";
import { DriverRideRequest } from "../../../api/interface/rideRequestInterface";
import {
  bidDataPost,
  bidDataGet,
  rideDataGet,
} from "../../../api/store/action/index";
import { useDispatch, useSelector } from "react-redux";

import { selfDriverData } from "../../../api/store/action/index";
import { vehicleData } from "../../../api/store/action";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function Ride() {
  const { selfDriver } = useSelector((state: any) => state.account);
  const [activeRiders, setActiveRiders] = useState(
    selfDriver?.total_active_rides
  );
  const navigation = useNavigation<navigation>();
  const {
    currSymbol,
    currValue,
    textRtlStyle,
    viewRtlStyle,
    isDark,
    hasRedirected,
    setHasRedirected,
    homeScreenRedirectTrig,
    setHomeScreenRedirectTrig,
  } = useValues();
  const { colors } = useTheme();
  const [bidId, setBidID] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const route = useRoute();
  const { ride } = route.params;
  const [value, setValue] = useState(ride.ride_fare);
  const dispatch = useDispatch();
  const { bidGet } = useSelector((state) => state.bid);
  const { translateData } = useSelector((state) => state.setting);

  const { allVehicle } = useSelector((state) => state.vehicleType);

  useFocusEffect(
    useCallback(() => {
      dispatch(vehicleData());
      return () => {};
    }, [dispatch])
  );

  const vehicle_type_id = selfDriver?.vehicle_info?.vehicle_type_id;
  const vehicleInfo = allVehicle?.find(
    (vehicle) => vehicle?.id === vehicle_type_id
  );

  useEffect(() => {
    setHomeScreenRedirectTrig(false);
  }, []);

  const redirectToRide = () => {
    // console.log("==============");
    // console.log(selfDriver?.last_active_ride?.id == ride.id);
    // console.log("ride", ride);
    // console.log("homeScreenRedirectTrig", homeScreenRedirectTrig);
    // console.log("hasRedirected", hasRedirected);
    // console.log("last active ride", selfDriver?.last_active_ride?.id);
    // console.log("redirecting to ride 2");
    const activeRideId = selfDriver?.last_active_ride?.id;
    setHasRedirected(activeRideId);
    navigation.navigate("PendingDetails", {
      item: selfDriver?.last_active_ride,
      vehicleDetail: vehicleInfo,
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(selfDriverData());
      if (
        selfDriver?.total_active_rides == "0" &&
        selfDriver?.total_pending_rides == "0"
      ) {
        setHasRedirected(-1);
      }
      setActiveRiders(selfDriver?.total_active_rides || 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selfDriver, dispatch]);

  const gotoAcceptFare = async () => {
    console.log(buttonLoading, " <===== buttonLoading");
    if (buttonLoading) return;
    setButtonLoading(true);
    let payload: DriverRideRequest = {
      amount: value,
      ride_request_id: ride.id,
    };

    dispatch(bidDataPost(payload))
      .unwrap()
      .then((res: any) => {
        console.log(res, "bidDataPost response");
        if (res?.id) {
          setBidID(res.id);
          Alert.alert("Success", "The Fare Was Sent Successfully");
        } else {
          Alert.alert("Error", res.message);
          console.log("Error in bidDataPost response:", res);
        }
        setButtonLoading(false);
      })
      .catch((error: any) => {
        console.error("Error in bidDataPost:", error);
        Alert.alert(
          "Error",
          "There was an error sending the fare. Please try again later."
        );
        setButtonLoading(false);
      });
    console.log(buttonLoading, " <= buttonLoading");
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(selfDriverData());
  //   }, [])
  // );

  useEffect(() => {
    if (bidGet) {
      console.log("bidGet", bidGet);
      if (
        bidGet.status === "accepted" &&
        ride?.service_category?.slug != "schedule"
      ) {
        console.log(
          "bid accepted ",
          bidGet.status,
          ride?.service_category?.slug
        );
        const rideID = bidGet.ride_id;
        navigation.navigate("AcceptFare", { ride_Id: rideID });
        dispatch(rideDataGet(rideID));
      } else if (bidGet.status === "rejected") {
        console.log("bid rejected ", bidGet.status);
        navigation.goBack();
        notificationHelper("Bid", "Bid Rejected", "error");
      } else if (
        ride?.service_category?.slug == "schedule" &&
        bidGet.status === "accepted"
      ) {
        console.log(
          "scheduled bid accepted ",
          bidGet.status,
          ride?.service_category?.slug
        );
        navigation.goBack();
        notificationHelper("Ride Status", "Ride Scheduled", "success");
      }
    }
  }, [bidGet, navigation]);

  const handleIncrement = () => {
    setValue(value + 10);
  };

  const handleDecrement = () => {
    if (value > ride.ride_fare) {
      setValue(value - 10);
    }
  };

  const buttonColor =
    value >= ride.ride_fare ? appColors.primary : appColors.disabled;

  return (
    <>
      <View style={commanStyles.main}>
        <View style={styles.mapSection}>
          <Map userLocation={ride.location_coordinates} />
        </View>
        <View style={styles.extraSection}></View>
        <View style={[styles.backButton]}>
          <BackButton />
        </View>
        <View style={styles.greenSection}>
          <UserDetails RideData={ride} />
          <View style={[styles.bottomView, { backgroundColor: colors.card }]}>
            <Text
              style={[
                styles.text,
                { color: colors.text, textAlign: textRtlStyle },
              ]}
            >
              {translateData.offerYourFare}
            </Text>
            <View
              style={[
                styles.boxContainer,
                {
                  backgroundColor: colors.background,
                  flexDirection: viewRtlStyle,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleDecrement}
                style={[
                  styles.boxLeft,
                  {
                    backgroundColor:
                      value <= ride.ride_fare ? colors.card : colors.card,
                  },
                ]}
                disabled={value <= ride.ride_fare}
              >
                <Text
                  style={[
                    styles.value,
                    { color: isDark ? appColors.white : appColors.primaryFont },
                  ]}
                >
                  -10
                </Text>
              </TouchableOpacity>
              <Text style={styles.textCenter}>
                {currSymbol}
                {currValue * value}
              </Text>
              <TouchableOpacity
                onPress={handleIncrement}
                style={[styles.boxRight, { backgroundColor: colors.card }]}
              >
                <Text
                  style={[
                    styles.value,
                    { color: isDark ? appColors.white : appColors.primaryFont },
                  ]}
                >
                  +10
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <Button
                onPress={gotoAcceptFare}
                title={`${translateData.acceptFareon} ${currSymbol} ${
                  currValue * value
                }`}
                backgroundColor={buttonColor}
                color={appColors.white}
                loading={buttonLoading}
              />
            </View>
          </View>
        </View>
      </View>
      {typeof selfDriver?.last_active_ride?.id !== "undefined" &&
        selfDriver?.last_active_ride?.id !== null &&
        selfDriver?.last_active_ride?.id != hasRedirected &&
        redirectToRide()}
    </>
  );
}
