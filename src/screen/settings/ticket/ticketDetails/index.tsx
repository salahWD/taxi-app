import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../../../../commonComponents";
import appColors from "../../../../theme/appColors";
import Images from "../../../../utils/images/images";
import { windowHeight, fontSizes } from "../../../../theme/appConstant";
import Icons from "../../../../utils/icons/icons";
import styles from "./styles";
import DocumentPicker from "react-native-document-picker";
import { getValue } from "../../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { messageDataGet, ticketDataGet } from "../../../../api/store/action";
import { URL } from "../../../../api/config";
import { useValues } from "../../../../utils/context";
import { useTheme } from "@react-navigation/native";
import ReactNativeFs from "react-native-fs";

export function TicketDetails({ route }) {
  const { ticketData } = route.params;
  const [textViewShow, setTextViewShow] = useState(false);
  const [inputText, setInputText] = useState("");
  const [files, setFiles] = useState([]);
  const { messageData } = useSelector((state) => state.tickets);
  const { viewRtlStyle, rtl, isDark, textRtlStyle } = useValues();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    const ticket_id = ticketData.id;
    dispatch(messageDataGet({ ticket_id }));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDocumentUpload = useCallback(async () => {
    setTextViewShow(true);
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

  const TicketReplay = async () => {
    const forme = {
      message: inputText,
      attachments: files,
      ticket_id: messageData.id,
    };

    setFiles();
    setInputText();
    setTextViewShow(false);
    const token = await getValue("token");
    try {
      const formData = new FormData();

      formData.append("message", forme.message);

      if (forme.attachments && forme.attachments.length > 0) {
        forme.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || "application/octet-stream",
          });
        });
      }
      formData.append("ticket_id", forme.ticket_id);

      const response = await fetch(`${URL}/api/ticket/reply`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const ticket_id = ticketData.id;

      dispatch(ticketDataGet());
      dispatch(messageDataGet({ ticket_id }));

      const responseData = await response.json();
      dispatch(ticketDataGet());
      dispatch(messageDataGet({ ticket_id }));
    } catch (error) {}
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    return formattedTime;
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: isDark ? colors.card : appColors.white },
        { borderColor: colors.border },
      ]}
    >
      <View style={[styles.row, { flexDirection: viewRtlStyle }]}>
        <View
          style={[styles.userInfoContainer, { flexDirection: viewRtlStyle }]}
        >
          <Image source={Images.user} style={styles.userImage} />
          <View style={styles.userTextContainer}>
            <Text
              style={[
                styles.userName,
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {item.created_by.name}
            </Text>
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketId}>{ticketData.ticket_number}</Text>
        </View>
      </View>
      <View>
        <Text style={[styles.description, { textAlign: textRtlStyle }]}>
          {item.message}
        </Text>
        <View>
          <View
            style={[
              styles.fileContainer,
              {
                flexDirection: viewRtlStyle,
              },
            ]}
          >
            {item?.media?.map((file, index) => {
              const fileSize = file.size;
              const sizeFormatted =
                fileSize < 1024
                  ? `${fileSize} B`
                  : fileSize < 1024 * 1024
                  ? `${(fileSize / 1024).toFixed(2)} KB`
                  : fileSize < 1024 * 1024 * 1024
                  ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
                  : `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;

              const handleDownloadFile = async (fileIndex) => {
                const imageUrl = item.media[fileIndex].original_url;
                const fileName = item.media[fileIndex].name;
                const filePath = `${ReactNativeFs.DownloadDirectoryPath}/${fileName}`;

                if (Platform.OS === "android") {
                  try {
                    const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                      {
                        title: "Storage Permission Required",
                        message:
                          "App needs access to your storage to download files",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                      }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      downloadFile(imageUrl, filePath);
                    } else {
                      Alert.alert(
                        "Permission Denied",
                        "Storage permission is required to download files"
                      );
                    }
                  } catch (err) {
                  }
                } else {
                  downloadFile(imageUrl, filePath);
                }
              };

              const downloadFile = async (url, path) => {
                try {
                  const download = ReactNativeFs.downloadFile({
                    fromUrl: url,
                    toFile: path,
                    background: true,
                    begin: (res) => {},
                    progress: (res) => {
                      const progressPercent =
                        (res.bytesWritten / res.contentLength) * 100;
                    },
                  });

                  const result = await download.promise;
                  if (result.statusCode === 200) {
                    Alert.alert(
                      `${translateData.downloadComplete}`,
                      `${translateData.fileDownloadedSuccessfully}`
                    );
                  } else {
                    Alert.alert("Download Failed", "Failed to download file");
                  }
                } catch (error) {
                  console.error("Download error:", error);
                  Alert.alert("Download Failed", "Failed to download file");
                }
              };

              return (
                <View
                  key={index}
                  style={[
                    styles.mainContainer,
                    {
                      borderColor: colors.border,
                      flexDirection: viewRtlStyle,
                    },
                  ]}
                >
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: file.original_url }}
                  />
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.file_Name,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                          fontSize: fontSizes.FONT3,
                        },
                      ]}
                    >
                      {file.name.length > 5
                        ? `${file.name.substring(0, 5)}...`
                        : file.name}
                    </Text>
                    <Text
                      style={[
                        styles.sizeFormatted,
                        { fontSize: fontSizes.FONT3SMALL },
                      ]}
                    >
                      {sizeFormatted}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDownloadFile(index)}
                    style={styles.downloadIcon}
                  >
                    <Icons.Download color={appColors.secondaryFont} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
        <Text style={[styles.time, { textAlign: rtl ? "left" : "right" }]}>
          {formatTime(item.created_at)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screenMainContainer}>
      <Header title={translateData.ticketDetails} />
      <View style={styles.list}>
        <FlatList
          data={messageData?.messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setTextViewShow(true);
        }}
      >
        <View
          style={[
            styles.textViewShow,
            {
              borderColor: colors.border,
              backgroundColor: isDark ? colors.card : appColors.white,
            },
          ]}
        >
          {textViewShow && (
            <View
              style={[
                styles.textView,
                { backgroundColor: isDark ? colors.card : appColors.white },
              ]}
            >
              <TextInput
                style={[
                  styles.inputView,
                  { backgroundColor: isDark ? colors.card : appColors.white },
                ]}
                placeholder={translateData.typeSomethinghere}
                placeholderTextColor={appColors.secondaryFont}
                value={inputText}
                onChangeText={(text) => setInputText(text)}
                autoFocus={true}
                multiline={true}
              />

              <View
                style={[
                  styles.fileFormat,
                  {
                    flexDirection: viewRtlStyle,
                  },
                ]}
              >
                {files?.map((file, index) => {
                  const fileSize = file.size;
                  const sizeFormatted =
                    fileSize < 1024
                      ? `${fileSize} B`
                      : fileSize < 1024 * 1024
                      ? `${(fileSize / 1024).toFixed(2)} KB`
                      : fileSize < 1024 * 1024 * 1024
                      ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
                      : `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;

                  const handleRemoveFile = (fileIndex) => {
                    const updatedFiles = files.filter(
                      (_, i) => i !== fileIndex
                    );
                    setFiles(updatedFiles);
                  };

                  return (
                    <View
                      key={index}
                      style={[
                        styles.viewContainer,
                        {
                          borderColor: colors.border,
                          flexDirection: viewRtlStyle,
                        },
                      ]}
                    >
                      <Image style={styles.img} source={{ uri: file.uri }} />
                      <TouchableOpacity
                        onPress={() => handleRemoveFile(index)}
                        style={styles.removeFile}
                      >
                        <Icons.CloseSimple />
                      </TouchableOpacity>
                      <View style={styles.fileTextContainer}>
                        <Text style={styles.fileName}>
                          {file.name.length > 5
                            ? `${file.name.substring(0, 5)}...`
                            : file.name}
                        </Text>
                        <Text style={styles.sizeFormattedText}>
                          {sizeFormatted}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={[styles.border, { borderColor: colors.border }]} />
            </View>
          )}
          <View
            style={[
              styles.bottomSearchBar,
              { flexDirection: viewRtlStyle },
              { backgroundColor: isDark ? colors.card : appColors.white },
            ]}
          >
             
            <TouchableOpacity
              style={[
                styles.attachment,
                { left: rtl ? "15%" : windowHeight(1) },
              ]}
              onPress={handleDocumentUpload}
            >
              <Icons.clip />
            </TouchableOpacity>
            <View
              style={[
                styles.btnContainer,
                { left: rtl ? "430%" : windowHeight(0) },
              ]}
            >
                    
              <TouchableOpacity style={styles.sendBtn} onPress={TicketReplay}>
                <Text style={styles.btnTitle}>{translateData.send}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
