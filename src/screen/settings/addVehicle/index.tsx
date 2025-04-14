import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Header, Input, notificationHelper } from "../../../commonComponents";
import appColors from "../../../theme/appColors";
import { fontSizes, windowHeight, windowWidth } from "../../../theme/appConstant";
import Icons from "../../../utils/icons/icons";
import { launchImageLibrary } from "react-native-image-picker";
import Swiper from "react-native-swiper";
import Images from "../../../utils/images/images";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";
import { Switch } from "../appSettings/component";
import { rentalVehicleTypesData, rentalZone } from "../../../api/store/action";
import { useDispatch, useSelector } from "react-redux";
import { getValue } from "../../../utils/localstorage";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { URL } from "../../../api/config";
import { useValues } from "../../../utils/context";

export function AddVehicle() {
  const route = useRoute();
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues()
  const { editData, screen } = route.params || {};
  const { goBack } = useNavigation();
  const [imageUri, setImageUri] = useState(
    { uri: editData?.rental_vehicle_galleries[0] } || null
  );
  const [imageUriFront, setImageUriFront] = useState(
    { uri: editData?.rental_vehicle_galleries[4] } || null
  );
  const [imageUriSide, setImageUriSide] = useState(
    { uri: editData?.rental_vehicle_galleries[1] } || null
  );
  const [imageUriBoot, setImageUriBoot] = useState(
    { uri: editData?.rental_vehicle_galleries[2] } || null
  );
  const [imageUriInterior, setImageUriInterior] = useState(
    { uri: editData?.rental_vehicle_galleries[3] } || null
  );
  const [imageUriRegistration, setImageUriRegistration] = useState(
    { uri: editData?.rental_vehicle_galleries[4] } || null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleValue, setVehicleValue] = useState(null);
  const [vehicleTypeopen, setvehicleTypeOpen] = useState(false);
  const [zoneopen, setZoneOpen] = useState(false);
  const [zoneValue, setZoneValue] = useState(null);
  const [vehicleName, setVehicleName] = useState(editData?.name || null);
  const [description, setDescription] = useState(editData?.description || null);
  const [registrationNo, setRegistrationNo] = useState();
  const { translateData } = useSelector((state) => state.setting);
  const [perDayPrice, setPerDayPrice] = useState(
    !isNaN(editData?.vehicle_per_day_price) ? editData?.vehicle_per_day_price : 0
  );
  


  const [driverPerDayPrice, setDriverperDayPrice] = useState(
    !isNaN(editData?.driver_per_day_chargee) ? editData?.driver_per_day_charge : 0
  );


  const [categoryType, setCategoryType] = useState(
    editData?.vehicle_subtype || null
  );
  const [fualType, setFualType] = useState(editData?.fuel_type || null);
  const [vehicleSpeed, setvehicleSpeed] = useState(
    editData?.vehicle_speed || null
  );
  const [vehicleMileage, setVehicleMileage] = useState(
    editData?.mileage || null
  );
  const [withDriver, setWithDriver] = useState(
    editData?.allow_with_driver || 0
  );
  const [vehicleStatus, setVehicleStatus] = useState(editData?.status || 0);
  const [acStatus, setACStatus] = useState(0);
  const { rentalVehicleTypedata } = useSelector((state) => state.vehicleType);
  const { rentalZones } = useSelector((state) => state.zoneUpdate);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rentalVehicleTypesData());
    dispatch(rentalZone({ vehicle_type_id: vehicleValue }));
  }, [vehicleValue]);

  const [vehicleType, setVehicleType] = useState([]);

  useEffect(() => {
    if (rentalVehicleTypedata?.data) {
      const dropdownItems = rentalVehicleTypedata.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setVehicleType(dropdownItems);
    }
  }, [rentalVehicleTypedata]);

  const [rentalZoneType, setRentalZoneType] = useState([]);

  useEffect(() => {
    if (rentalZones?.data) {
      const dropdownItems = rentalZones.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRentalZoneType(dropdownItems);
    }
  }, [rentalZones]);

  const [gearType, setGearType] = useState([
    { label: `${translateData.manual}`, value: "manual" },
    { label: `${translateData.auto}`, value: "auto" },
  ]);
  const [valuegear, setValueGear] = useState(null);
  const [openGear, setOpenGear] = useState(false);
  const [value, setValue] = useState(null);
  const [fields, setFields] = useState(
    editData?.interior || [{ id: Date.now(), value: "" }]
  );

  const addNewField = () => {
    if (fields.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 fields.");
      return;
    }
    setFields([...fields, { id: Date.now(), value: "" }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateFieldValue = (id, newValue) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setFields(updatedFields);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const swiperData = [
    {
      image: Images.imgCarNormal,
      title: translateData.normalImage,
      description: translateData.normalDesc,
    },
    {
      image: Images.imgCarFront,
      title: translateData.frontView,
      description: translateData.frontDesc,
    },
    {
      image: Images.imgCarSide,
      title: translateData.sideView,
      description: translateData.sideDesc,
    },
    {
      image: Images.imgCarBoot,
      title: translateData.bootView,
      description: translateData.bootDesc,
    },
    {
      image: Images.imgCarInterior,
      title: translateData.interior,
      description: translateData.intDesc,
    },
  ];

  const handlePress = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUri(selectedImage);
          }
        }
      }
    );
  };

  const onwithDriver = () => {
    setWithDriver((prevState) => (prevState === 0 ? 1 : 0));
  };

  const onvehicleStatus = () => {
    setVehicleStatus((prevState) => (prevState === 0 ? 1 : 0));
  };

  const onAcStatus = () => {
    setACStatus((prevState) => (prevState === 0 ? 1 : 0));
  };

  const handlePressFront = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUriFront(selectedImage);
          }
        }
      }
    );
  };

  const handlePressSide = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUriSide(selectedImage);
          }
        }
      }
    );
  };

  const handlePressBoot = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUriBoot(selectedImage);
          }
        }
      }
    );
  };

  const handlePressInterior = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUriInterior(selectedImage);
          }
        }
      }
    );
  };

  const handlePressRegistration = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          Alert.alert("Error", "Something went wrong while picking the image!");
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            setImageUriRegistration(selectedImage);
          }
        }
      }
    );
  };
  const removemainImg = () => {
    setImageUri(null);
  };

  const removemainImgFront = () => {
    setImageUriFront(null);
  };

  const removemainImgSide = () => {
    setImageUriSide(null);
  };

  const removemainImgBoot = () => {
    setImageUriBoot(null);
  };

  const removemainImgInterior = () => {
    setImageUriInterior(null);
  };

  const removemainImgRegistration = () => {
    setImageUriRegistration(null);
  };

  const addVehicles = async () => {
    const token = await getValue("token");
    const formData = new FormData();

    formData.append("name", vehicleName);
    formData.append("description", description);
    formData.append("vehicle_type_id", vehicleValue);
    formData.append("zone_ids[0]", "2");
    formData.append("vehicle_per_day_price", perDayPrice);
    formData.append("allow_with_driver", withDriver.toString());
    formData.append("driver_per_day_charge", driverPerDayPrice);
    formData.append("vehicle_subtype", categoryType);
    formData.append("fuel_type", fualType);
    formData.append("gear_type", valuegear);
    formData.append("vehicle_speed", vehicleSpeed);
    formData.append("mileage", vehicleMileage);
    fields.forEach((field, index) => {
      formData.append(`interior[${index}]`, field.value);
    });
    formData.append("status", vehicleStatus.toString());
    formData.append("normal_image", {
      uri: imageUri.uri,
      type: imageUri.type,
      name: imageUri.fileName,
    });
    formData.append("front_view", {
      uri: imageUriFront.uri,
      type: imageUriFront.type,
      name: imageUriFront.fileName,
    });
    formData.append("side_view", {
      uri: imageUriSide.uri,
      type: imageUriSide.type,
      name: imageUriSide.fileName,
    });
    formData.append("boot_view", {
      uri: imageUriBoot.uri,
      type: imageUriBoot.type,
      name: imageUriBoot.fileName,
    });
    formData.append("interior_image", {
      uri: imageUriInterior.uri,
      type: imageUriInterior.type,
      name: imageUriInterior.fileName,
    });

    const response = await fetch(`${URL}/api/rental-vehicle`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "Accept-Lang": "en",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        setValue("token", data.access_token);
        notificationHelper("Vehicle Add", translateData.addSuccessfully, "success")
        goBack();
        dispatch(selfData());
      } else {
      }
    } else {
      const errorData = await response.text();

      setSuccess(false);
      setMessage(res.message);
      messageRef.current?.animate();
    }
  };

  const updateVehicles = async () => {
    try {
      const token = await getValue("token");
      const formData = new FormData();

      formData.append("name", vehicleName);
      formData.append("description", description);
      formData.append("vehicle_type_id", vehicleValue);
      formData.append("zone_ids[0]", zoneValue);
      formData.append("vehicle_per_day_price", perDayPrice);
      formData.append("allow_with_driver", withDriver.toString());
      formData.append("driver_per_day_charge", driverPerDayPrice);
      formData.append("vehicle_subtype", categoryType);
      formData.append("fuel_type", fualType);
      formData.append("gear_type", valuegear);
      formData.append("vehicle_speed", vehicleSpeed);
      formData.append("mileage", vehicleMileage);
      fields.forEach((field, index) => {
        formData.append(`interior[${index}]`, field.value);
      });
      formData.append("status", vehicleStatus.toString());
      formData.append("normal_image", {
        uri: imageUri.uri,
        type: imageUri.type,
        name: imageUri.fileName,
      });
      formData.append("front_view", {
        uri: imageUriFront.uri,
        type: imageUriFront.type,
        name: imageUriFront.fileName,
      });
      formData.append("side_view", {
        uri: imageUriSide.uri,
        type: imageUriSide.type,
        name: imageUriSide.fileName,
      });
      formData.append("boot_view", {
        uri: imageUriBoot.uri,
        type: imageUriBoot.type,
        name: imageUriBoot.fileName,
      });
      formData.append("interior_image", {
        uri: imageUriInterior.uri,
        type: imageUriInterior.type,
        name: imageUriInterior.fileName,
      });
      formData.append("_method", "PUT");
      const response = await fetch(`${URL}/api/rental-vehicle/18`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "Accept-Lang": "en",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("HTTP error! Status:", response.status);
        return;
      }

      const responseData = await response.json();
    } catch (error) {
      console.error("Error occurred during fetch:", error.message);
    }
  };

  useEffect(() => {
    setVehicleValue(editData?.vehicle_type_id || null);
    setZoneValue(editData?.zones[0].id || null);
  }, []);

  const renderField = ({ item, index }) => (
    <View style={[styles.fieldContainer, { flexDirection: viewRtlStyle }]}>
      <Text style={[styles.bullet, { color: isDark ? appColors.white : appColors.primaryFont }]}>•</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border }, { color: isDark ? appColors.white : appColors.black }]}
        placeholder={translateData.enterText}
        placeholderTextColor={appColors.secondaryFont}
        value={item.value || item}
        onChangeText={(text) => updateFieldValue(item.id, text)}
      />
      {index === fields.length - 1 && fields.length < 5 ? (
        <TouchableOpacity style={styles.addButton} onPress={addNewField}>
          <Icons.plus />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeField(item.id)}
        >
          <Icons.minus />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header title={translateData.addVehicle} />
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Text style={[styles.title, { textAlign: textRtlStyle }, { color: colors.text }]}>{translateData.vehicleType}</Text>
          <DropDownPicker
            open={vehicleTypeopen}
            value={vehicleValue}
            items={vehicleType}
            setOpen={setvehicleTypeOpen}
            setValue={setVehicleValue}
            setItems={setVehicleType}
            placeholder={translateData.selectVehicle}
            style={[styles.dropContainer, { borderColor: colors.border }]}
            zIndex={4}
            placeholderStyle={styles.vehiclePlaceholder}
            style={[styles.vehicleStyle, {
              borderColor: isDark ? appColors.darkborder : appColors.border,
              backgroundColor: isDark ? colors.card : appColors.white,
              flexDirection: viewRtlStyle,
            }]}
            dropDownContainerStyle={{ backgroundColor: isDark ? colors.card : appColors.dropDownColor, borderColor: colors.border }}
            textStyle={[styles.vehicleText, { color: colors.text }]}
            labelStyle={[styles.vehicleLabel, { color: isDark ? appColors.white : appColors.black }]}
            listItemLabelStyle={{ color: isDark ? appColors.white : appColors.black }}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
              fontSize: fontSizes.FONT4
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
          />

          <Text style={[styles.title, { textAlign: textRtlStyle }, { marginTop: windowHeight(1.8) }, { color: colors.text }]}>{translateData.zone}</Text>
          <DropDownPicker
            open={zoneopen}
            value={zoneValue}
            items={rentalZoneType}
            setOpen={setZoneOpen}
            setValue={setZoneValue}
            setItems={setRentalZoneType}
            style={styles.dropContainer}
            placeholder={translateData.selectZone}
            placeholderStyle={styles.zonePlaceholder}
            zIndex={3}
            style={[styles.zoneStyle,
            {
              borderColor: isDark ? appColors.darkborder : appColors.border,
              backgroundColor: isDark ? colors.card : appColors.white,
              flexDirection: viewRtlStyle,

            }
            ]}
            dropDownContainerStyle={{ backgroundColor: isDark ? colors.card : appColors.dropDownColor, borderColor: colors.border }}
            textStyle={[styles.vehicleText, { color: colors.text }]}
            labelStyle={[styles.vehicleLabel, { color: isDark ? appColors.white : appColors.black }]}
            listItemLabelStyle={{ color: isDark ? appColors.white : appColors.black }}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
              fontSize: fontSizes.FONT4
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
          />
          <View style={styles.vehicleInput}>
            <Input
              placeholder={translateData.enterVehicleNames}
              titleShow={true}
              title={translateData.vehicleName}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setVehicleName(text)}
              value={vehicleName}

            />
          </View>
          <Text style={[styles.title, { textAlign: textRtlStyle }, { marginTop: windowHeight(0.3) }, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.vehicleDescription}</Text>
          <TextInput
            style={[styles.descriptionField, { textAlign: textRtlStyle }, { color: isDark ? appColors.white : appColors.primaryFont }, { backgroundColor: isDark ? colors.card : appColors.white }, { borderColor: isDark ? appColors.darkborder : appColors.border }]}
            placeholder={translateData.writeHeres}
            placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont}
            multiline={true}
            numberOfLines={3}
            maxLength={500}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <View style={styles.registrationInput}>
            <Input
              placeholder={translateData.enterRegistrationNo}
              titleShow={true}
              title={translateData.registrationNumber}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setRegistrationNo(text)}
              value={registrationNo} />
          </View>
        </View>

        <View style={[styles.uploadContainer, { backgroundColor: isDark ? colors.card : appColors.white }, { borderColor: colors.border }]}>
          <View style={[styles.uploadSubContainer, { flexDirection: viewRtlStyle }]}>
            <Text style={[styles.uploadTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.uploadFile}</Text>
            <TouchableOpacity onPress={openModal}>
              <Icons.Help />
            </TouchableOpacity>
          </View>
          <View style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}>
            <TouchableOpacity
              onPress={handlePress}
              style={[{ borderWidth: imageUri?.uri ? 0 : 1 }, styles.imgUpload]}
            >
              {imageUri?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUri?.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImg}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>{translateData.uploadImage}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressFront}
              style={[
                { borderWidth: imageUriFront?.uri ? 0 : 1 },
                styles.imgUpload,
              ]}
            >
              {imageUriFront?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUriFront?.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImgFront}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>{translateData.uploadFrontView}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}>
            <TouchableOpacity
              onPress={handlePressSide}
              style={[
                { borderWidth: imageUriSide?.uri ? 0 : 1 },
                styles.imgUpload,
              ]}
            >
              {imageUriSide?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUriSide.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImgSide}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>{translateData.uploadSideView}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressBoot}
              style={[
                { borderWidth: imageUriBoot?.uri ? 0 : 1 },
                styles.imgUpload,
              ]}
            >
              {imageUriBoot?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUriBoot.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImgBoot}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>{translateData.uploadBootView}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={[styles.imgContainer2, { flexDirection: viewRtlStyle }]}>
            <TouchableOpacity
              onPress={handlePressInterior}
              style={[
                { borderWidth: imageUriInterior?.uri ? 0 : 1 },
                styles.imgUpload,
              ]}
            >
              {imageUriInterior?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUriInterior.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImgInterior}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>{translateData.uploadInterior}</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePressRegistration}
              style={[
                { borderWidth: imageUriRegistration?.uri ? 0 : 1 },
                styles.imgUpload,
              ]}
            >
              {imageUriRegistration?.uri ? (
                <>
                  <Image
                    source={{ uri: imageUriRegistration.uri }}
                    style={styles.uploadedImg}
                  />
                  <TouchableOpacity
                    onPress={removemainImgRegistration}
                    style={styles.imgClose}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.placeHolder}>
                    {translateData.uploadRegistration}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder={translateData.enterPerDayPrice}
            titleShow={true}
            title={translateData.vehiclePerDayPrice}
            backgroundColor={isDark ? colors.card : appColors.white}
            onChangeText={(text) => setPerDayPrice(text)}
            value={perDayPrice}

          />
          <View style={[styles.driverAllow, { flexDirection: viewRtlStyle }]}>
            <Text style={[styles.withDriver, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.withDriver}</Text>
            <Switch onPress={onwithDriver} switchOn={withDriver === 1} />
          </View>
          {withDriver === 1 && (
            <Input
              placeholder={translateData.enterPerDayPrice}
              titleShow={true}
              title={translateData.driverPerDayPrice}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setDriverperDayPrice(text)}
              value={driverPerDayPrice}
            />
          )}
          <View style={styles.vehicleType}>
            <Input
              placeholder={translateData.suv}
              titleShow={true}
              title={translateData.vehicleType}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setCategoryType(text)}
              value={categoryType}
            />
          </View>
          <View style={[styles.statusContainer, { flexDirection: viewRtlStyle }]}>
            <Text style={[styles.withDriver, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.aCNonAC}</Text>
            <Switch onPress={onAcStatus} switchOn={acStatus === 1} />
          </View>
          <View style={styles.fualType}>
            <Input
              placeholder={translateData.diesel}
              titleShow={true}
              title={translateData.fualType}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setFualType(text)}
              value={fualType}
            />
          </View>
          <Text style={[styles.gearTitle, { textAlign: textRtlStyle }, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.gearType}</Text>
          <DropDownPicker
            open={openGear}
            value={valuegear}
            items={gearType}
            setOpen={setOpenGear}
            setValue={setValueGear}
            setItems={setGearType}
            style={[styles.border, { borderColor: colors.border }]}
            placeholderStyle={styles.vehiclePlaceholder}
            style={[
              {
                borderColor: isDark ? appColors.darkborder : appColors.border,
                flexDirection: viewRtlStyle,
                backgroundColor: isDark ? colors.card : appColors.white
              }
            ]}
            dropDownContainerStyle={{ backgroundColor: isDark ? colors.card : appColors.dropDownColor, borderColor: colors.border }}
            textStyle={[styles.vehicleText, { color: colors.text }]}
            labelStyle={[styles.vehicleLabel, { color: isDark ? appColors.white : appColors.black }]}
            listItemLabelStyle={{ color: isDark ? appColors.white : appColors.black }}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
          
            }}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
              fontSize: fontSizes.FONT4
            }}
          />
          <View style={styles.vehicleSpeed}>
            <Input
              placeholder={translateData.enterVehicleSpeed}
              titleShow={true}
              title={translateData.vehicleSpeed}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setvehicleSpeed(text)}
              value={vehicleSpeed}
            />
          </View>
          <View style={styles.vehicleMileage}>
            <Input
              placeholder={translateData.enterVehicleMileage}
              titleShow={true}
              title={translateData.vehicleMileage}
              backgroundColor={isDark ? colors.card : appColors.white}
              onChangeText={(text) => setVehicleMileage(text)}
              value={vehicleMileage}
            />
          </View>
          <View style={styles.bagCount}>
            <Input
              placeholder={translateData.enterbagCount}
              titleShow={true}
              title={translateData.bagCount}
              backgroundColor={isDark ? colors.card : appColors.white}
              keyboardType="number-pad"
            />
          </View>

          <Text style={[styles.titleInterior, { textAlign: textRtlStyle }, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.moreInformation}</Text>
          <View style={[styles.listView, { backgroundColor: isDark ? colors.card : appColors.white }, { borderColor: colors.border }]}>
            <FlatList data={fields} renderItem={renderField} />
          </View>
          <View style={styles.vehicleStatusContainer}>
            <View style={[styles.statusContainer, { flexDirection: viewRtlStyle }]}>
              <Text style={[styles.withDriver, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.Status}</Text>
              <Switch onPress={onvehicleStatus} switchOn={vehicleStatus === 1} />
            </View>
          </View>

        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity onPress={closeModal} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                {translateData.imageGuide}
              </Text>

              <View style={[styles.closeContainer, { right: rtl ? windowWidth(82) : 10 }]}>
                <TouchableOpacity onPress={closeModal}>
                  <Icons.Close />

                </TouchableOpacity>
              </View>


              <View style={styles.swiperStyle}>
                <Swiper
                  paginationStyle={{ gap: windowHeight(0.5) }}
                  showsPagination={true}
                  dotColor={appColors.closeBg}
                  activeDotColor={appColors.primary}
                  loop={true}
                  showsButtons={false}
                  dotStyle={styles.swiperDot}
                  activeDotStyle={styles.swiperDot}
                >
                  {swiperData?.map((item, index) => (
                    <View key={index} style={styles.sliderView}>
                      <Image source={item.image} style={styles.sliderImg} />
                      <Text style={[styles.sliderTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.sliderDesc}>{item.description}</Text>
                    </View>
                  ))}
                </Swiper>
              </View>

              <View style={styles.btnContainer}>
                <Button
                  title={translateData.okay}
                  color={appColors.white}
                  backgroundColor={appColors.primary}
                  onPress={closeModal}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <View style={styles.buttonContainer}>
        {screen == "editDetals" ? (
          <Button
            title={translateData.update}
            backgroundColor={appColors.primary}
            color={appColors.white}
            onPress={updateVehicles}
          />
        ) : (
          <Button
            title={translateData.upload}
            backgroundColor={appColors.primary}
            color={appColors.white}
            onPress={addVehicles}
          />
        )}
      </View>
    </ScrollView>
  );
}
