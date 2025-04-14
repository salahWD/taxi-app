import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Icons from "../../../utils/icons/icons";
import appColors from "../../../theme/appColors";
import styles from "./styles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { windowWidth } from "../../../theme/appConstant";
import { Switch } from "../appSettings/component";
import { useDispatch, useSelector } from "react-redux";
import { rentalVehicleData } from "../../../api/store/action";
import { useValues } from "../../../utils/context";

export function VehicleList() {
  const navigation = useNavigation();
  const [toggleStates, setToggleStates] = useState({});
  const { rentalVehicleList } = useSelector((state: any) => state.rental);
  const dispatch = useDispatch();
  const { viewRtlStyle, isDark, rtl, currSymbol, currValue } = useValues()
  const { colors } = useTheme()
  const { translateData } = useSelector((state) => state.setting);

  const gotoAdd = () => {
    navigation.navigate("AddVehicle");
  };

  useEffect(() => {
    dispatch(rentalVehicleData());
  }, [dispatch]);

  useEffect(() => {
    if (rentalVehicleList?.data) {
      const initialToggleStates = {};
      rentalVehicleList.data.forEach((item) => {
        initialToggleStates[item.id] = item.status === 1;
      });
      setToggleStates(initialToggleStates);
    }
  }, [rentalVehicleList]);

  const handleToggle = (id) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const gotoUpdate = (editData) => {
    let screen = "editDetals";
    navigation.navigate("AddVehicle", { editData, screen });
  };

  const renderVehicleItem = ({ item }) => {
    const isSwitchOn = toggleStates[item.id] || false;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => gotoUpdate(item)}
        style={[styles.listContainer, { backgroundColor: colors.card }, { borderColor: colors.border }]}
      >
        <View style={[styles.titleContainer, { flexDirection: viewRtlStyle }, { backgroundColor: colors.card }]}>
          <Text style={[styles.carBrand, { color: colors.text }]}>{item.name}</Text>
          <Switch
            switchOn={isSwitchOn}
            onPress={() => handleToggle(item.id)}
            background={appColors.closeBg}
          />
        </View>
        <View style={styles.imageView}>
          <Image
            source={{ uri: item?.normal_image?.original_url }}
            style={styles.carImg}
          />
        </View>
        <View style={[styles.descContainer, { flexDirection: viewRtlStyle }]}>
          <Text style={styles.engineInfo}>{item.description}</Text>
          <Text style={styles.rentPrice}>
            {currSymbol}{currValue * item.vehicle_per_day_price}
            <Text style={styles.perDay}>/{translateData.day}</Text>
          </Text>
        </View>
        <View style={[styles.dashLine,{borderBottomColor:colors.border}]} />
        <View style={[styles.descContainer, { flexDirection: viewRtlStyle }]}>
          <Text style={[styles.driverTitle, { color: colors.text }]}>{translateData.driverPrice}</Text>
          <Text style={styles.rentPrice}>
            {currSymbol}{currValue * item.driver_per_day_charge}
            <Text style={styles.perDay}>/{translateData.day}</Text>
          </Text>
        </View>
        <View style={[styles.tagContainer, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.iconBox, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(0) : windowWidth(3) }]}>
            <Icons.CarType />
            <Text style={styles.iconTitle}>{item.vehicle_subtype}</Text>
          </View>
          <View style={[styles.iconBox1, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(3) : windowWidth(3) }]}>
            <Icons.FuelType />
            <Text style={styles.iconTitle}>{item.fuel_type}</Text>
          </View>
          <View style={[styles.iconBox, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(3) : windowWidth(3) }]}>
            <Icons.Milage />
            <Text style={styles.iconTitle}>{item.mileage}km/ltr</Text>
          </View>
          <View style={[styles.iconBox, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(0) : windowWidth(3) }]}>
            <Icons.GearType />
            <Text style={styles.iconTitle}>{item.gear_type}</Text>
          </View>
          <View style={[styles.iconBox1, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(3) : windowWidth(3) }]}>
            <Icons.CarSeat />
            <Text style={styles.iconTitle}>{item.seatingCapacity} {translateData.seat}</Text>
          </View>
          <View style={[styles.iconBox, { flexDirection: viewRtlStyle }, { backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground }, { marginRight: rtl ? windowWidth(3) : windowWidth(3) }]}>
            <Icons.Speed />
            <Text style={styles.iconTitle}>{item.vehicle_speed}/h</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.main, { flexDirection: viewRtlStyle }, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.backIcon, { borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
        >
          <Icons.Back color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {translateData.vehicleList}
        </Text>
        <TouchableOpacity
          onPress={gotoAdd}
          activeOpacity={0.7}
          style={[styles.backIcon, { borderColor: colors.border }]}
        >
          <Icons.Add color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={[styles.tipContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.tip}>
          {translateData.vehicleNote}
        </Text>
      </View>
      <FlatList
        data={rentalVehicleList?.data || []}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContaine}
      />
    </View>
  );
}
