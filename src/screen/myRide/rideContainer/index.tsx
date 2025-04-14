import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import Images from "../../../utils/images/images";
import { styles } from "./style";
import { LineContainer, LocationDetails } from "../../../commonComponents";
import { useValues } from "../../../utils/context";
import Icons from "../../../utils/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { rideDataGets, vehicleData } from "../../../api/store/action";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import appColors from "../../../theme/appColors";
import appFonts from "../../../theme/appFonts";
import { LoaderRide } from "./loaderRide";
import { windowHeight } from "../../../theme/appConstant";

type PendingProp = NativeStackNavigationProp<RootStackParamList>;

export default function RideContainer({ status }) {
  const { navigate } = useNavigation<PendingProp>();
  const { viewRtlStyle, textRtlStyle, isDark, currValue, currSymbol } = useValues();
  const { colors } = useTheme()

  const dispatch = useDispatch();
  const { rideGets } = useSelector((state) => state.ride);
  const { allVehicle } = useSelector((state) => state.vehicleType);
  const { translateData } = useSelector((state) => state.setting);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const acceptedRides = rideGets?.data?.filter(
    (ride) => ride?.ride_status?.slug === status
  );

  const paginatedData = acceptedRides?.slice(0, page * 5) || [];


  const gotoMessage = (item) => {
    navigate("Chat", {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      riderName: item?.rider?.name,
      riderImage: item?.rider?.profile_image?.original_url,
    });
  };

  const gotoCall = (item) => {
    const phoneNumber = item?.driver?.phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(rideDataGets());
      dispatch(vehicleData());
      return () => { };
    }, [dispatch])
  );
  const loadMoreData = () => {
    if (!loading && hasMoreData) {
      setLoading(true);
      setTimeout(() => {
        if (paginatedData.length < acceptedRides?.length) {
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMoreData(false);
        }
        setLoading(false);
      }, 1000);
    }
  };

  const formatDates = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return {
      date: `${day} ${month}’${year}`,
      time: `${hours}:${minutes} ${ampm}`,
    };
  };

  const handlePress = (selectedItem, vehicleData) => {
    navigate("PendingDetails", {
      item: selectedItem,
      vehicleDetail: vehicleData,
    });
  };


  const renderItem = ({ item }) => {
    const { vehicle_type_id } = item.driver.vehicle_info;
    const vehicleData = allVehicle?.find(
      (vehicle) => vehicle?.id === vehicle_type_id
    );
    const formattedDate = formatDates(item.created_at);

    return (
      <View>
        <TouchableOpacity
          style={[styles.container]}
          onPress={() => handlePress(item, vehicleData)}
          activeOpacity={0.9}
        >
          <View style={[styles.rideInfoContainer, { backgroundColor: isDark ? colors.card : appColors.white, borderColor: colors.border }]}>
            <View
              style={[
                styles.profileInfoContainer,
                { flexDirection: viewRtlStyle },
              ]}
            >
              <Image
                style={styles.profileImage}
                source={
                  item?.rider?.profile_image?.original_url
                    ? { uri: item?.rider?.profile_image?.original_url }
                    : Images.ProfileDefault
                }

              />

              <View style={styles.profileTextContainer}>
                <Text
                  style={[
                    styles.profileName,
                    { color: isDark ? appColors.white : appColors.primaryFont },
                    { textAlign: textRtlStyle },
                  ]}
                >
                  {item.rider.name}
                </Text>
                <View
                  style={[
                    styles.carInfoContainer,
                    { flexDirection: viewRtlStyle },
                  ]}
                >
                  {Array.from({ length: 5 }).map((_, index) => {
                    const fullStarThreshold = index + 1;
                    const halfStarThreshold = index + 0.5;
                    if (item?.rider?.rating_count >= fullStarThreshold) {
                      return <Icons.RatingStar key={index} />;
                    } else if (item?.rider?.rating_count >= halfStarThreshold) {
                      return <Icons.RatingHalfStar key={index} />;
                    } else {
                      return <Icons.RatingEmptyStar key={index} />;
                    }
                  })}
                  <View
                    style={[styles.ratingContainer, { flexDirection: viewRtlStyle }]}
                  >
                    <Text
                      style={[styles.rating_count, {
                        color: isDark ? appColors.white : appColors.primaryFont
                      }]}
                    >
                      {item?.rider?.rating_count}
                    </Text>
                    <Text
                      style={styles.reviews_count}
                    >
                      ({item?.rider?.reviews_count})
                    </Text>
                  </View>
                </View>
              </View>
              {item?.ride_status?.slug === "accepted" && (
                <View
                  style={[styles.acceptedContainer, {
                    flexDirection: viewRtlStyle
                  }]}
                >
                  <TouchableOpacity
                    style={[styles.callContainer, {
                      borderColor: colors.border,
                    }]}
                    onPress={() => gotoMessage(item)}
                  >
                    <Icons.Message color={appColors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.callContainer, {
                      borderColor: colors.border,
                    }]}
                    onPress={() => gotoCall(item)}
                  >
                    <Icons.Call color={appColors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={[styles.containerService, { flexDirection: viewRtlStyle }]}>
              <View
                style={styles.serviceContainer}
              >
                <Text
                  style={styles.serviceName}
                >
                  {item?.service?.name}
                </Text>
              </View>
              <View
                style={styles.service_category_Container}
              >
                <Text
                  style={{
                    color: appColors.primaryFont,
                    fontFamily: appFonts.regular,
                  }}
                >
                  {item?.service_category?.name}
                </Text>
              </View>
            </View>
            <View style={[styles.dashedLine, {
              borderColor: colors.border,
            }]} />
            <View style={{ flexDirection: viewRtlStyle }}>
              <Image
                style={styles.tripImage}
                source={{ uri: vehicleData?.vehicle_image?.original_url }}
              />
              <View style={styles.tripTextContainer}>
                <Text
                  style={[
                    styles.tripIDText,
                    { color: isDark ? appColors.white : appColors.primaryFont, textAlign: textRtlStyle },
                  ]}
                >
                  #{item?.ride_number}
                </Text>
                <Text style={[styles.tripCostText, { textAlign: textRtlStyle }]}>
                  {currSymbol}{currValue * item.total}
                </Text>
              </View>
              <View
                style={styles.iconContainer1}
              >
                <View style={[styles.containerIcon, { flexDirection: viewRtlStyle }]}>
                  <View style={styles.calanderSmall}>
                    <Icons.CalanderSmall />
                  </View>
                  <Text style={styles.tripDateText}>{formattedDate.date}</Text>
                </View>
                <View style={[styles.containerIcon, { flexDirection: viewRtlStyle }]}>
                  <View style={styles.clock}>
                    <Icons.Clock />
                  </View>
                  <Text style={styles.tripDateText}>{formattedDate.time}</Text>
                </View>
              </View>
            </View>
          </View>
          <LineContainer />
          <LocationDetails locationDetails={item.locations} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      {loading && !acceptedRides?.length ? (
        <LoaderRide />
      ) : acceptedRides?.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={Images.noRides} style={styles.noDataImage} />
          <Text style={styles.noDataText}>{translateData.norideTitle}</Text>
          <Text style={styles.noDataDesc}>{translateData.norideDescription}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedData}
            scrollEnabled={true}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.9}
            ListFooterComponent={
              loading && (
                <ActivityIndicator
                  size="large"
                  color={appColors.buttonBg}
                  style={{ marginTop: 10 }}
                />
              )
            }
          />
          <View style={{ marginBottom: windowHeight(50) }} />
        </>
      )}
    </View>
  );


}
