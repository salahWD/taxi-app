import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  BackHandler,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import styles from "./styles";
import { Header, UpcomingRide, RenderRideItem } from "../component";
import {
  useNavigation,
  useTheme,
  useIsFocused,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../utils/context";
import appColors from "../../../theme/appColors";
import { driverZone, selfDriverData } from "../../../api/store/action/index";
import { useDispatch, useSelector } from "react-redux";
import { ZoneUpdatePayload } from "../../../api/interface/zoneInterface";
import { rideRequestDataGet } from "../../../api/store/action/rideRequestAction";
import Geolocation from "react-native-geolocation-service";
import { setValue } from "../../../utils/localstorage/index";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import BackgroundService from "react-native-background-actions";
import Images from "../../../utils/images/images";
import Icons from "../../../utils/icons/icons";
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import commonStyles from "../../../style/commanStyles";
import { useFocusEffect } from "@react-navigation/native";
import SwipeButton from "../../../commonComponents/sliderButton";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function Home() {
  const navigation = useNavigation<navigation>();
  const [isOn, setIsOn] = useState(false);
  const { colors } = useTheme();
  const { textRtlStyle, setToken, viewRtlStyle, isDark, currSymbol, hasRedirected, setHasRedirected } =
    useValues();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { navigate } = useNavigation<navigation>();
  const dispatch = useDispatch<AppDispatch>();
  const { rideRequestdata, statusCode } = useSelector(
    (state) => state.rideRequest
  );
  const [watchId, setWatchId] = useState(null);
  const [offlineLat, setOfflineLat] = useState();
  const [offlineLng, setOfflineLng] = useState();
  const { selfDriver } = useSelector((state: any) => state.account);
  const { translateData } = useSelector((state) => state.setting);

  const redirectToRide = () => {
    setHasRedirected(true);
    navigate("MyRide");
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(selfDriverData());
    }, [])
  );
  const rideData = [
    {
      id: "1",
      dashBoardData: `${currSymbol}${selfDriver?.total_driver_commission}`,
      title: `${translateData.totalEarning}`,
      screen: "MyWallet",
    },
    {
      id: "2",
      dashBoardData: selfDriver?.total_pending_rides,
      title: `${translateData.pendingRides}`,
      screen: "MyRide",
    },
    {
      id: "3",
      dashBoardData: selfDriver?.total_complete_rides,
      title: `${translateData.completedRides}`,
      screen: "MyRide",
    },
    {
      id: "4",
      dashBoardData: selfDriver?.total_cancel_rides,
      title: `${translateData.cancelledRides}`,
      screen: "MyRide",
    },
  ];

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371e3;
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const deltaLat = toRad(coords2.latitude - coords1.latitude);
    const deltaLon = toRad(coords2.longitude - coords1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const veryIntensiveTask = async (taskData) => {
    const { delay } = taskData;
    let lastPosition = null;

    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentPosition = { latitude, longitude };
            if (lastPosition) {
              const distance = haversineDistance(lastPosition, currentPosition);
              getZoneValue(latitude, longitude);
              setOfflineLat(latitude);
              setOfflineLng(longitude);
              if (distance >= 50) {
                lastPosition = currentPosition;
                getZoneValue(latitude, longitude);
              }
            } else {
              lastPosition = currentPosition;
            }
          },
          (error) => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    });
  };

  const isAndroid13OrBelow =
    Platform.OS === "android" && Platform.Version <= 33;

  const options = {
    taskName: "LocationLogger",
    taskTitle: "Logging Location in Background",
    taskDesc: "This logs the user's location every 50 meters",
    ...(isAndroid13OrBelow && {
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
    }),
    color: appColors.pink,
    parameters: {
      delay: 2000,
    },
    isForeground: true,
  };

  const gotoRide = (ride) => {
    if (ride.service_category.slug === "rental") {
      navigate("RentalDetails", { ride });
    } else {
      console.log(`going to ride with id: ${ride.id}`);
      navigation.navigate("Ride", { ride });
    }
  };

  useEffect(() => {
    const zone_id = 2;
    dispatch(rideRequestDataGet(zone_id));

    const intervalId = setInterval(() => {
      dispatch(rideRequestDataGet(zone_id));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const startBackgroundTask = async () => {
    const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (permission === RESULTS.GRANTED) {
      if (!BackgroundService.isRunning()) {
        try {
          await BackgroundService.start(veryIntensiveTask, options);
        } catch (error) {
          console.error("Error starting background task:", error);
        }
      }
    } else {
      const requestResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      if (requestResult === RESULTS.GRANTED) {
        try {
          await BackgroundService.start(veryIntensiveTask, options);
        } catch (error) {
          console.error("Error starting background task:", error);
        }
      } else {
      }
    }
  };

  const stopBackgroundTask = async () => {
    await BackgroundService.stop();
    driverOffline();
  };

  const getZoneValue = (latitude, longitude) => {
    let payload: ZoneUpdatePayload = {
      locations: [
        {
          lat: latitude,
          lng: longitude,
        },
      ],
      is_online: 1,
    };

    dispatch(driverZone(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
        } else {
        }
      });
  };

  const driverOffline = () => {
    let payload: ZoneUpdatePayload = {
      locations: [
        {
          lat: offlineLat,
          lng: offlineLng,
        },
      ],
      is_online: 0,
    };

    dispatch(driverZone(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          setValue("token", res.access_token);
          setToken(res.access_token);
        } else {
        }
      });
  };

  const toggleSwitch = () => {
    if (!isOn) {
      setIsOn(true);
      startBackgroundTask();
    } else {
      stopBackgroundTask();
      setIsOn(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      setIsModalVisible(true);
      return true;
    };
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  const handleExit = () => {
    BackHandler.exitApp();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (selfDriver?.total_active_rides <= 0 && !hasRedirected) {
      setHasRedirected(false);
    }
    return () => {
      if (watchId?.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const { Popover } = renderers;

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.spaceBelow}>
          <Header isOn={isOn} toggleSwitch={toggleSwitch} />
          <FlatList
            data={rideData}
            numColumns={2}
            renderItem={({ item }) => (
              <RenderRideItem item={item} colors={colors} />
            )}
            keyExtractor={(item) => item.id}
            style={[styles.listStyle, { backgroundColor: colors.background }]}
          />
          <View
            style={[styles.rideContainer, { backgroundColor: colors.card }]}
          >
            <Text
              style={[
                styles.rideTitle,
                { color: colors.text, textAlign: textRtlStyle },
              ]}
            >
              {translateData.newUpcomingRide}
            </Text>
            {rideRequestdata?.data && rideRequestdata.data.length > 0 ? (
              rideRequestdata.data?.map((ride, index) => (
                <UpcomingRide key={index} ride={ride} gotoRide={gotoRide} />
              ))
            ) : (
              <View style={styles.noRideContainer}>
                <Image
                  source={Images.noRide}
                  style={styles.noRideImg}
                  resizeMode="contain"
                />
                <Text style={styles.noRideText}>
                  {translateData.noRideRequest}
                </Text>
                <Menu
                  renderer={Popover}
                  rendererProps={{
                    preferredPlacement: "bottom",
                    triangleStyle: styles.triangleStyle,
                  }}
                >
                  <MenuTrigger style={styles.infoMenu}>
                    <Icons.Info />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: commonStyles.popupContainer,
                    }}
                  >
                    <Text
                      style={commonStyles.popupText}
                    >{`${translateData.statusCode} ${statusCode}`}</Text>
                  </MenuOptions>
                </Menu>
              </View>
            )}
          </View>
        </View>

        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCancel}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={handleCancel}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={[styles.modalContainer, { backgroundColor: colors.card }]}
              activeOpacity={1}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {translateData.exitMsg}
              </Text>
              <View
                style={[
                  styles.buttonContainer,
                  { flexDirection: viewRtlStyle },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: isDark
                        ? colors.background
                        : appColors.graybackground,
                    },
                  ]}
                  onPress={handleExit}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {translateData.exit}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                  <Text style={styles.buttonText}>{translateData.cancel}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
      {selfDriver?.total_active_rides > 0 && (
        <View style={styles.selfDriver}>
          <SwipeButton buttonText={translateData.backTOActive} />
        </View>
      )}
      {selfDriver?.total_active_rides > 0 && !hasRedirected && redirectToRide()}
    </>
  );
}
