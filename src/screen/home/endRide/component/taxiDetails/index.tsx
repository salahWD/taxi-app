import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import images from "../../../../../utils/images/images";
import { useValues } from "../../../../../utils/context";
import { useNavigation, useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/main/types";
import { useDispatch, useSelector } from "react-redux";

type navigation = NativeStackNavigationProp<RootStackParamList>;

export function TaxiDetails() {
  const { currSymbol, currValue, viewRtlStyle, textRtlStyle, isDark } =
    useValues();
  const { colors } = useTheme();
  const navigation = useNavigation<navigation>();
  const dispatch = useDispatch();
  const { rideGet } = useSelector((state) => state.ride);

  const gotoMap = () => {
    navigation.navigate("Map", {
      locationDetails: rideGet.location_coordinates,
    });
  };

  return (
    <View style={{ backgroundColor: colors.card }}>
      <View style={[styles.dashBorder, { borderColor: colors.border }]} />
      <View
        style={[
          styles.dateTime,
          { backgroundColor: colors.card, flexDirection: viewRtlStyle },
        ]}
      >
        <View style={[styles.alignment, { flexDirection: viewRtlStyle }]}>
          <Image source={images.carFront} style={styles.carImage} />
          <View style={styles.spaceHorizantal}>
            <Text
              style={[
                styles.id,
                { color: colors.text, textAlign: textRtlStyle },
              ]}
            >
              #{rideGet?.ride_number}
            </Text>
            <Text style={[styles.amount, { textAlign: textRtlStyle }]}>
              {currSymbol}
              {currValue * rideGet?.total}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.address, { flexDirection: viewRtlStyle }]}
        onPress={gotoMap}
      >
        {isDark ? (
          <Image source={images.mapDark} style={styles.mapImage} />
        ) : (
          <Image source={images.map} style={styles.mapImage} />
        )}
      </TouchableOpacity>
    </View>
  );
}
