import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "../../auth/registration/vehicleRegistration/styles";
import appColors from "../../../theme/appColors";
import { Input, Button, Header, notificationHelper } from "../../../commonComponents";
import { useNavigation, useTheme } from "@react-navigation/native";
import { TitleView } from "../../auth/component";
import {
  RenderCategoryList,
  RenderServiceList,
  RenderVehicleList,
} from "../../auth/registration/vehicleRegistration/component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../utils/context";
import DatePicker from "react-native-date-picker";
import Icons from "../../../utils/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { driverRuleGet } from "../../../api/store/action/driverRuleAction";
import { selfDriverData } from "../../../api/store/action";
import { serviceDataGet } from "../../../api/store/action/serviceAction";
import { categoryDataGet } from "../../../api/store/action/categoryAction";
import { vehicleTypeDataGet } from "../../../api/store/action/vehicleTypeAction";
import { windowHeight } from "../chat/context";
import vehicleStyles from "./styles";

type ProfileScreenProps = NativeStackNavigationProp<RootStackParamList>;

export function VehicleDetail() {
  const { goBack } = useNavigation<ProfileScreenProps>();
  const { colors } = useTheme();
  const { textRtlStyle, viewRtlStyle, isDark } = useValues();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [categoryIndex, setCategoryIndex] = useState<number>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySlug, setcategorySlug] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [vehicleIndex, setVehicleIndex] = useState<number>(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedServiceID, setSelectedServiceID] = useState();
  const [selectedCategoryID, setSelectedCategoryID] = useState();
  const [selectedVehicleID, setSelectedVehicleID] = useState();
  const [formData, setFormData] = useState({
    vehicleName: "",
    vehicleNumber: "",
    registrationDate: "",
    maximumSeats: "",
    vehicleColor: "",
  });

  const { selfDriver } = useSelector((state: any) => state.account);
  const { serviceData } = useSelector((state: any) => state.service);
  const { categoryData } = useSelector((state: any) => state.serviceCategory);
  const { vehicleTypedata } = useSelector((state: any) => state.vehicleType);
  const { translateData } = useSelector((state) => state.setting);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selfDriverData());
    dispatch(driverRuleGet());
    dispatch(serviceDataGet());
    dispatch(categoryDataGet());
  }, []);

  const months = [
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

  useEffect(() => {
    if (selfDriver && selfDriver?.vehicle_info) {
      const RegistrationDate = new Date(selfDriver.vehicle_info?.created_at);
      const formattedDate = `${RegistrationDate.getDate()} ${months[RegistrationDate.getMonth()]
        }’${RegistrationDate.getFullYear()}`;
      setFormData({
        vehicleName: selfDriver?.vehicle_info?.model || "",
        vehicleNumber: selfDriver?.vehicle_info?.plate_number || "",
        registrationDate: formattedDate || "",
        vehicleColor: selfDriver?.vehicle_info?.color || "",
        maximumSeats: selfDriver?.vehicle_info?.seat || "",
      });
      setSelectedServiceID(selfDriver?.service_id);
      setSelectedCategoryID(selfDriver?.service_category_id);
    }
  }, [selfDriver?.vehicle_info]);








  
  useEffect(() => {
    if (serviceData.data && serviceData.data.length > 0) {
      const service = serviceData.data.find(
        (service) => service.id === selfDriver?.service_id
      );
      if (service) {
        setSelectedService(service.name);
      }
    } else {
    }
    if (categoryData.data && categoryData.data.length > 0) {
      const category = categoryData.data.find(
        (category) => category.id === selfDriver?.service_category_id
      );

      if (category) {
        setSelectedCategory(category.name);
      }
    } else {
    }
    dispatch(
      vehicleTypeDataGet({
        service_id: selfDriver?.service_id,
        service_category_id: selfDriver?.service_category_id,
      })
    );
  }, [serviceData, selfDriver, categoryData]);

  useEffect(() => {
    if (vehicleTypedata && vehicleTypedata?.data?.length > 0) {
      const vehicle = vehicleTypedata?.data?.find(
        (vehicle) => vehicle.id === selfDriver.vehicle_info?.vehicle_type_id
      );

      if (vehicle) {
        setSelectedVehicle(vehicle.name);
      }
    } else {
    }
  }, [vehicleTypedata]);
  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleItemPress = (index: number, name: string, serviceId: number) => {
    setSelectedItemIndex(index);
    setSelectedService(name);
    setSelectedServiceID(serviceId);
  };

  const gotoBankDetails = () => {
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      goBack();
      notificationHelper("Update", translateData.detailsUpdateSuccessfully, "success")
    }
  };

  const handleVehiclePress = (
    index: number,
    vehicleName: string,
    vehicleId: string
  ) => {
    setVehicleIndex(index), setSelectedVehicle(vehicleName);
    setSelectedVehicleID(vehicleId);
  };

  const handleCategoryPress = (
    index: number,
    categoryName: string,
    categoryId?: string,
    slug?: string
  ) => {
    setSelectedCategory(categoryName);
    setCategoryIndex(index);
    setSelectedCategoryID(categoryId);
    setcategorySlug(slug);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <ScrollView style={[styles.main]} showsVerticalScrollIndicator={false}>
      <Header title={translateData.vehicleRegistration} />
      <View style={[styles.subView, { backgroundColor: colors.background }]}>
        <View style={styles.subContainer}>
          <TitleView
            title={translateData.vehicleRegistration}
            subTitle={translateData.registerContent}
          />
          <View style={{ height: windowHeight(50) }}>
            <Text
              style={[
                styles.selectTitle,
                { color: isDark ? appColors.white : appColors.primaryFont },
                { textAlign: textRtlStyle },
              ]}
            >
              {translateData.selectService}
            </Text>
            <View
              style={[
                { flexDirection: viewRtlStyle, marginTop: windowHeight(5) },
            
              ]}
            >
              <RenderServiceList
                selectedItemIndex={selectedItemIndex}
                handleItemPress={handleItemPress}
              />
            </View>
          </View>
          <View style={{ marginTop: windowHeight(72) }}>
            <Text
              style={[
                styles.selectTitle,
                { color: isDark ? appColors.white : appColors.primaryFont },
                { textAlign: textRtlStyle },
              ]}
            >
              {translateData.selectCategory}
            </Text>
            <View
              style={[
                vehicleStyles.categoryList,
                { flexDirection: viewRtlStyle },
              ]}
            >
              <RenderCategoryList
                categoryIndex={categoryIndex}
                handleItemPress={handleCategoryPress}
                selectedService={selectedService}
                selectedCategory={selectedCategory}
              />
            </View>
          </View>
          <View style={{ bottom: windowHeight(2.7) }}>
            <Text
              style={[
                styles.selectTitle1,
                { color: isDark ? appColors.white : appColors.primaryFont },
                { textAlign: textRtlStyle },
              ]}
            >
              {translateData.selectVehicle}
            </Text>
            <View style={{ flexDirection: viewRtlStyle }}>
              <RenderVehicleList
                vehicleIndex={vehicleIndex}
                selectedItemIndex={selectedItemIndex}
                selectedCategory={selectedCategory}
                selectedVehicle={selectedVehicle}
                serviceId={selectedServiceID}
                handleItemPress={handleVehiclePress}
              />
            </View>
          </View>

          <View style={vehicleStyles.vehicleName}>
            <Input
              titleShow={true}
              title={translateData.vehicleName}
              placeholder={translateData.enterVehicleNames}
              value={formData.vehicleName}
              onChangeText={(text) => handleChange("vehicleName", text)}
              showWarning={showWarning && formData.vehicleName === ""}
              warning={translateData.enterYourvehicleName}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
            />
          </View>
          <View style={vehicleStyles.vehicle}>
            <Input
              titleShow={true}
              title={translateData.vehicleNo}
              placeholder={translateData.rnterVehicleNo}
              value={formData.vehicleNumber}
              onChangeText={(text) => handleChange("vehicleNumber", text)}
              showWarning={showWarning && formData.vehicleNumber === ""}
              warning={translateData.pleaseEnterVehicleNo}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
            />
          </View>
          <View style={{ bottom: windowHeight(20) }}>
            <Text
              style={[
                vehicleStyles.vehicleRegistrationDate,
                {
                  color: isDark ? appColors.white : appColors.primaryFont,

                  textAlign: textRtlStyle,
                },
              ]}
            >
              {translateData.vehicleRegistrationDate}
            </Text>

            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
                handleChange("registrationDate", formatDate(date));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <View
              style={[
                styles.dateInput,
                { backgroundColor: colors.card, borderColor: colors.border },
                { flexDirection: viewRtlStyle },
              ]}
            >
              <TextInput
                style={[
                  styles.dateInputFild,
                  { textAlign: textRtlStyle },
                  { color: colors.text },
                ]}
                placeholder={translateData.enterVehicleRegistrationDate}
                placeholderTextColor={
                  isDark ? appColors.darkText : appColors.secondaryFont
                }
                value={
                  formData.registrationDate ? formData.registrationDate : ""
                }
                editable={false}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Icons.Calander />
              </TouchableOpacity>
            </View>

            {showWarning && !formData.registrationDate && (
              <Text style={styles.warning}>
                {translateData.EnteryourregistrationDate}
              </Text>
            )}
          </View>
          <View style={vehicleStyles.vehicle}>
            <Input
              titleShow={true}
              title={translateData.vehicleColor}
              placeholder={translateData.enterVehicleColor}
              value={formData.vehicleColor ? formData.vehicleColor : ""}
              onChangeText={(text) => handleChange("vehicleColor", text)}
              showWarning={showWarning && formData.vehicleColor === ""}
              warning={translateData.enterYourvehicleColor}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
            />
          </View>
          <View style={vehicleStyles.datePicker}>
            <Input
              titleShow={true}
              title={translateData.maximumSeats}
              placeholder={translateData.enterMaximumSeats}
              value={formData.maximumSeats ? formData.maximumSeats : ""}
              onChangeText={(text) => handleChange("maximumSeats", text)}
              showWarning={showWarning && formData.maximumSeats === ""}
              warning={translateData.enterYourmaximumSeats}
              keyboardType="numeric"
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
            />
          </View>
          <View style={{width:'108%',alignSelf:'center'}}>
          <Button title={translateData.update} backgroundColor={appColors.primary} color={appColors.white}  onPress={gotoBankDetails} />
          </View>
          {/* <Text
            style={[
              styles.ruleTitle,
              { color: colors.text, textAlign: textRtlStyle },
            ]}
          >
            {translateData.selectYourRule}
          </Text> */}
        </View>
      </View>
      <View style={styles.spaceTop}>
        <Button
          onPress={gotoBankDetails}
          title={translateData.update}
          backgroundColor={appColors.primary}
          color={appColors.white}
        />
      </View>
    </ScrollView>
  );
}
