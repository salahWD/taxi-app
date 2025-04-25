import { View, Text, TouchableOpacity } from "react-native";
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


type navigation = NativeStackNavigationProp<RootStackParamList>;

export function Ride() {

  const { selfDriver } = useSelector((state: any) => state.account);
  const [activeRiders, setActiveRiders] = useState(selfDriver?.total_active_rides);
  const navigation = useNavigation<navigation>();
  const { currSymbol, currValue, textRtlStyle, viewRtlStyle, isDark, hasRedirected, setHasRedirected } =
    useValues();
  const { colors } = useTheme();
  const [bidId, setBidID] = useState<number | null>(null);
  const route = useRoute();
  const { ride } = route.params;
  const [value, setValue] = useState(ride.ride_fare);
  const dispatch = useDispatch();
  const { bidGet } = useSelector((state) => state.bid);
  const { translateData } = useSelector((state) => state.setting);

  const redirectToRide = () => {
    setHasRedirected(true);
    navigation.navigate("MyRide");
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(selfDriverData());
      if (selfDriver?.total_active_rides > activeRiders) {
        setHasRedirected(false);
      }
      setActiveRiders(selfDriver?.total_active_rides || 0);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [selfDriver, dispatch]);


  useEffect(() => {
    if (selfDriver?.total_active_rides <= 0 && !hasRedirected) {
      setHasRedirected(false);
    }
  }, []);


  const gotoAcceptFare = async () => {
    let payload: DriverRideRequest = {
      amount: value,
      ride_request_id: ride.id,
    };

    dispatch(bidDataPost(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.id) {
          setBidID(res.id);
        }else {
          console.log("Error in bidDataPost response:", res);
        }
      });
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(selfDriverData());
    }, [])
  );

  // useEffect(() => {
  //   if (bidGet.status === "accepted") {
  //     console.log("Bid accepted, redirecting to My Rides screen");
  //     redirectToRide();
  //   } else {
  //     console.log("Bid data:", bidGet);
  //     console.log("Bid status:", bidGet?.status);
  //     console.log("ride:", ride);
  //   }
  // }, [bidGet]);

  useEffect(() => {
    if (bidGet) {
      console.log("bidGet", bidGet)
      if (
        bidGet.status === "accepted" &&
        ride?.service_category?.slug != "schedule"
      ) {
        console.log("bid accepted ", bidGet.status, ride?.service_category?.slug)
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
        console.log("scheduled bid accepted ", bidGet.status, ride?.service_category?.slug);
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
                title={`${translateData.acceptFareon}${currSymbol} ${
                  currValue * value
                }`}
                backgroundColor={buttonColor}
                color={appColors.white}
              />
            </View>
          </View>
        </View>
      </View>
      {selfDriver?.total_active_rides > 0 && !hasRedirected && redirectToRide()}
    </>
  );
}
