import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Input, Header, Button, notificationHelper } from "../../../../commonComponents";
import { fontSizes } from "../../../../theme/appConstant";
import appColors from "../../../../theme/appColors";
import DropDownPicker from "react-native-dropdown-picker";
import Icons from "../../../../utils/icons/icons";
import DocumentPicker from "react-native-document-picker";
import styles from "./styles";
import { getValue } from "../../../../utils/localstorage";
import {
  departmentDataGet,
  priorityDataGet,
  ticketDataGet,
} from "../../../../api/store/action/ticketAction";
import { URL } from "../../../../api/config";
import { useValues } from "../../../../utils/context";
import { useNavigation, useTheme } from "@react-navigation/native";

export function CreateTicket() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues();
  const [subjectValue, setSubjectValue] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [priorityList, setPriorityList] = useState([]);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { priorityData, departmentData } = useSelector(
    (state: any) => state.tickets
  );
  const { translateData } = useSelector((state) => state.setting);

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    dispatch(priorityDataGet());
    dispatch(departmentDataGet());
  }, []);

  useEffect(() => {
    if (priorityData?.data) {
      setPriorityList(
        priorityData.data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
    if (departmentData?.data) {
      setDepartmentList(
        departmentData.data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
  }, [priorityData, departmentData]);

  const handleDocumentUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setFiles([...files, ...response]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert("Error", "Failed to upload file(s).");
      }
    }
  }, [files]);

  const TicketRequest = async () => {
    setLoading(true);
    const token = await getValue("token");
    try {
      const formData = new FormData();
      formData.append("subject", subjectValue);
      formData.append("description", description);
      formData.append("priority_id", selectedPriority);
      formData.append("department_id", selectedDepartment);

      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || "application/octet-stream",
          });
        });
      }

      const response = await fetch(`${URL}/api/ticket`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();

      if (response.ok) {
        if (responseData.id) {
          notificationHelper(translateData.success, translateData.ticketCreated, "success")
          navigation.navigate("SupportTicket");
          dispatch(ticketDataGet());
        } else {
          Alert.alert(
            "Error",
            responseData.message || "Failed to create ticket."
          );
        }
      } else {
        console.error("Server error:", responseData);
        Alert.alert("Error", "Server error. Please check API logs.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Header title={translateData.createTicket} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Input
            title={translateData.subject}
            placeholder={translateData.enterSubject}
            titleShow={true}
            value={subjectValue}
            onChangeText={setSubjectValue}
            backgroundColor={isDark ? colors.card : appColors.white}
          />
          <Text
            style={[
              styles.fieldTitle,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.descriptionCar}
          </Text>
          <TextInput
            style={[
              styles.descriptionField,
              { textAlign: textRtlStyle },
              { backgroundColor: isDark ? colors.card : appColors.white },
              { borderColor: colors.border },
              { color: isDark ? appColors.white : appColors.black },
            ]}
            placeholder={translateData.writeHeres}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.secondaryFont
            }
            multiline={true}
            numberOfLines={3}
            maxLength={500}
            value={description}
            onChangeText={setDescription}
          />
          <Text
            style={[
              styles.fieldTitle1,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.priority}
          </Text>
          <DropDownPicker
            open={open}
            value={selectedPriority}
            items={priorityList}
            setOpen={setOpen}

            setValue={setSelectedPriority}
            placeholder={translateData.selectPriority}
            dropDownContainerStyle={{
              backgroundColor: isDark ? colors.card : appColors.white,
              borderColor: colors.border,
            }}
            textStyle={[styles.text, { color: colors.text }]}
            placeholderStyle={[
              styles.placeholderStyle,
              { color: isDark ? appColors.darkText : appColors.secondaryFont },
            ]}
            labelStyle={[styles.text, { color: colors.text }]}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            listItemLabelStyle={{
              color: isDark ? appColors.white : appColors.black,
            }}
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            style={[
              {
                borderColor: isDark ? appColors.darkborder : appColors.border,
                backgroundColor: isDark
                  ? appColors.darkThemeSub
                  : appColors.white,
                flexDirection: viewRtlStyle,
              },
            ]}
            textStyle={{
              textAlign: rtl ? "right" : "left",
              color: colors.text,
              fontSize: fontSizes.FONT4,
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
            zIndex={3}
            listMode="SCROLLVIEW"
            dropDownDirection="AUTO"
          />
          <Text
            style={[
              styles.fieldTitle2,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.department}
          </Text>
          <DropDownPicker
            open={openDepartment}
            value={selectedDepartment}
            items={departmentList}
            setOpen={setOpenDepartment}
            setValue={setSelectedDepartment}
            placeholder={translateData.selectDepartment}
            placeholderStyle={[
              styles.placeholderStyle,
              { color: isDark ? appColors.darkText : appColors.secondaryFont },
            ]}
            dropDownContainerStyle={{
              backgroundColor: isDark ? colors.card : appColors.white,
              borderColor: colors.border,
            }}
            textStyle={[styles.text, { color: colors.text }]}
            labelStyle={[styles.text, { color: colors.text }]}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            listItemLabelStyle={{
              color: isDark ? appColors.white : appColors.black,
            }}
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            style={[
              {
                borderColor: isDark ? appColors.darkborder : appColors.border,
                backgroundColor: isDark
                  ? appColors.darkThemeSub
                  : appColors.white,
                flexDirection: viewRtlStyle,
              },
            ]}
            textStyle={{
              textAlign: rtl ? "right" : "left",
              fontSize: fontSizes.FONT4,
            }}
            zIndex={2}
            listMode="SCROLLVIEW"
            dropDownDirection="AUTO"
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
          />
          <Text
            style={[
              styles.fieldTitle3,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.uploadFile}
          </Text>
          {files.length > 0 ? (
            <View
              style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}
            >
              {files?.map((file, index) => (
                <View key={index} style={styles.imgView}>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => handleRemoveFile(index)}
                  >
                    <Icons.CloseSimple />
                  </TouchableOpacity>
                  {file.type?.includes("image") ? (
                    <Image source={{ uri: file.uri }} style={styles.img} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeHolder}>{file.name}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleDocumentUpload}
              activeOpacity={0.7}
              style={[
                styles.docSelection,
                {
                  backgroundColor: isDark
                    ? appColors.darkThemeSub
                    : appColors.white,
                },
                { borderColor: colors.border },
              ]}
            >
              <View style={styles.docContainer}>
                <Icons.Download color={appColors.secondaryFont} />
                <Text style={styles.uploadText}>{translateData.upload}</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.submitBtn}>
            <Button title={translateData.submit} backgroundColor={appColors.primary} color={appColors.white} loading={loading} onPress={TicketRequest} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
