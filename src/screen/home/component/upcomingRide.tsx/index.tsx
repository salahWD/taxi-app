import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import images from "../../../../utils/images/images";
import Icons from "../../../../utils/icons/icons";
import styles from "./styles";
import { useValues } from "../../../../utils/context";
import { useTheme } from "@react-navigation/native";
import appColors from "../../../../theme/appColors";
import { windowHeight } from "../../../../theme/appConstant";
import CalanderSmall from "../../../../assets/icons/caladerSmall";
import Clock from "../../../../assets/icons/clock";
import { useSelector } from "react-redux";

interface UpcomingRideProps {
  ride: any;
  gotoRide: () => void;
}

export function UpcomingRide({ ride, gotoRide }: UpcomingRideProps) {
  const { textRtlStyle, viewRtlStyle, isDark, rtl, currSymbol, currValue } = useValues();
  const { colors } = useTheme();
  const { translateData } = useSelector((state) => state.setting);
  const [rating, setRating] = useState();
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day} ${month}’${year} at ${hours}:${minutes} ${ampm}`;
  };

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
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

  const formattedDate = formatDates(ride.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => gotoRide(ride)}
      style={[
        styles.main,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.top,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={[styles.alignment, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.profile, { flexDirection: viewRtlStyle }]}>
            <Image
              source={
                ride?.rider?.profile_image?.original_url
                  ? { uri: ride?.rider?.profile_image?.original_url }
                  : images.ProfileDefault
              }
              style={styles.userimage}
            />
            <View style={styles.rideContainer}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {ride.rider.name}
              </Text>
              <View
                style={[
                  styles.starContainer,
                  {
                    flexDirection: viewRtlStyle,
                    left: rtl ? windowHeight(4) : windowHeight(0.5),
                  },
                ]}
              >
                {Array.from({ length: 5 }).map((_, index) => {
                  const fullStarThreshold = index + 1;
                  const halfStarThreshold = index + 0.5;
                  if (ride?.rider?.rating_count >= fullStarThreshold) {
                    return <Icons.RatingStar key={index} />;
                  } else if (ride?.rider?.rating_count >= halfStarThreshold) {
                    return <Icons.RatingHalfStar key={index} />;
                  } else {
                    return <Icons.RatingEmptyStar key={index} />;
                  }
                })}
                <Text
                  style={[
                    styles.text1,
                    { color: isDark ? appColors.white : appColors.primaryFont },
                  ]}
                >
                  {" "}
                  {ride?.rider?.rating_count}
                  <Text
                    style={[
                      styles.text1,
                      {
                        color: isDark
                          ? appColors.white
                          : appColors.secondaryFont,
                      },
                    ]}
                  >
                    ({ride?.rider?.reviews_count})
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rate}>
            <Text style={styles.price}>{currSymbol}{currValue * ride.ride_fare}</Text>
          </View>
        </View>
        <View style={[styles.border, { borderColor: colors.border }]} />
        <View
          style={{
            flexDirection: viewRtlStyle,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: viewRtlStyle }}>
            <View style={styles.tagBg}>
              <Text style={[styles.userName]}>{ride.service.name}</Text>
            </View>
            <View style={[styles.tagBg]}>
              <Text style={[styles.userName, { color: appColors.primaryFont }]}>
                {ride.service_category.name}
              </Text>
            </View>
          </View>
          {ride.service_category.slug === "rental" ? (
            <View
              style={[styles.distanceValue, { flexDirection: viewRtlStyle }]}
            >
              <Icons.DayCalander color={colors.text} />
              <Text style={[styles.distance, { color: colors.text }]}>
                {" "}
                {ride.no_of_days} {translateData.days}
              </Text>
            </View>
          ) : (
            <View
              style={[styles.distanceValue, { flexDirection: viewRtlStyle }]}
            >
              <Icons.location color={colors.text} />
              <Text style={[styles.distance, { color: colors.text }]}>
                {" "}
                {parseFloat(ride.distance).toFixed(1)}
              </Text>
              <Text style={[styles.distance, { color: colors.text }]}>
                {" "}
                {ride.distance_unit}
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.border, { borderColor: colors.border }]} />
        {ride?.service_category?.slug === "schedule" && (
          <View
            style={[
              styles.scheduleContainer,
              {
                flexDirection: viewRtlStyle,
              },
            ]}
          >
            <View style={styles.containerSchedule}>
              <Text style={styles.startDateText}>
                {translateData.startDate}
              </Text>
              <View
                style={[styles.calanderSmall, { flexDirection: viewRtlStyle }]}
              >
                <CalanderSmall />
                <Text style={styles.formattedDateText}>
                  {" "}
                  {formattedDate.date}
                </Text>
              </View>
            </View>
            <View
              style={[styles.startContainer, { borderColor: colors.border }]}
            />
            <View style={styles.containerSchedule}>
              <Text style={styles.startTime}>{translateData.startTime}</Text>
              <View
                style={[styles.scheduleClock, { flexDirection: viewRtlStyle }]}
              >
                <Clock />
                <Text style={styles.formattedDateText}>
                  {" "}
                  {formattedDate.time}
                </Text>
              </View>
            </View>
          </View>
        )}
        {ride?.service_category?.slug === "rental" && (
          <>
            <View
              style={[styles.rentalContainer, { flexDirection: viewRtlStyle }]}
            >
              <View style={styles.containerSchedule}>
                <Text style={styles.startTime}>{translateData.startDate}</Text>
                <View
                  style={[
                    styles.scheduleClock,
                    { flexDirection: viewRtlStyle },
                  ]}
                >
                  <CalanderSmall />
                  <Text style={styles.formattedDateText}>
                    {" "}
                    {formattedDate.date}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.rentalBorder, { borderColor: colors.border }]}
              />
              <View style={styles.containerSchedule}>
                <Text style={styles.startTime}>{translateData.startTime}</Text>
                <View
                  style={[
                    styles.scheduleClock,
                    { flexDirection: viewRtlStyle },
                  ]}
                >
                  <Clock />
                  <Text style={styles.formattedDateText}>
                    {" "}
                    {formattedDate.time}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.rentalDateContainer,
                {
                  flexDirection: viewRtlStyle,
                },
              ]}
            >
              <View style={styles.containerSchedule}>
                <Text style={styles.startTime}>{translateData.endDate}</Text>
                <View
                  style={[
                    styles.scheduleClock,
                    { flexDirection: viewRtlStyle },
                  ]}
                >
                  <CalanderSmall />
                  <Text style={styles.formattedDateText}>
                    {" "}
                    {formattedDate.date}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.rentalBorder, { borderColor: colors.border }]}
              />
              <View style={styles.containerSchedule}>
                <Text style={styles.startTime}>{translateData.endTime}</Text>
                <View
                  style={[
                    styles.scheduleClock,
                    { flexDirection: viewRtlStyle },
                  ]}
                >
                  <Clock />
                  <Text style={styles.formattedDateText}>
                    {" "}
                    {formattedDate.time}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={[styles.smallCalander, { flexDirection: viewRtlStyle }]}>
          <CalanderSmall />
          <Text style={styles.timing}> {formattedDate.date}</Text>
          <View style={[styles.borderLine, { borderColor: colors.border }]} />
          <View style={{ flexDirection: viewRtlStyle }}>
            <Clock />
            <Text style={styles.timing}> {formattedDate.time}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.direction, { flexDirection: viewRtlStyle }]}>
        <Image source={images.line} style={styles.lineImage} />
        <Image source={images.line} style={styles.lineImage} />
      </View>
      <View
        style={[
          styles.bottom,
          styles.alignment,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.mainContainer, { flexDirection: viewRtlStyle }]}>
          <View>
            <Icons.location color={colors.text} />
            <View
              style={[
                styles.verticaldot,
                { borderColor: appColors.darkBorderBlack },
              ]}
            />
            <View style={styles.gps}>
              <Icons.gps color={colors.text} />
            </View>
          </View>
          <View>
            <Text
              style={[
                styles.pickup,
                { color: colors.text, textAlign: textRtlStyle },
              ]}
            >
              {ride.locations[0]}
            </Text>
            <View style={styles.borderContainer}>
              <View style={[styles.border, { borderColor: colors.border }]} />
            </View>
            <Text
              style={[
                styles.drop,
                { color: colors.text, textAlign: textRtlStyle },
              ]}
            >
              {ride.locations[ride.locations.length - 1]}
            </Text>
          </View>
        </View>
      </View>
      {ride.service_category.slug != "rental" && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.rentalInfoContainer,
            {
              backgroundColor: isDark
                ? colors.background
                : appColors.graybackground,
            },
          ]}
        >
          <Text style={styles.moreInfo}>{translateData.moreInfo}</Text>
        </TouchableOpacity>
      )}
      {ride.service_category.slug === "rental" && (
        <View style={[styles.InfoContainer, { flexDirection: viewRtlStyle }]}>
          <TouchableOpacity style={styles.moreInfoContainer}>
            <Text style={styles.moreInfo}>{translateData.moreInfo}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptContainer}>
            <Text style={styles.acceptText}>{translateData.accept}</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
