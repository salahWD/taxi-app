import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";
import appColors from "../../../theme/appColors";
import { useNavigation, useTheme } from "@react-navigation/native";
import { TitleView } from "../../auth/component";
import renderDocumentUpload from "../../auth/registration/documentVerify/component";
import styles from "../../auth/registration/documentVerify/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../utils/context";
import { Header, Button, notificationHelper } from "../../../commonComponents";
import { useDispatch, useSelector } from "react-redux";
import { selfDriverData } from "../../../api/store/action";
import { documentGet } from "../../../api/store/action";
import documentstyles from "./styles";

type ProfileScreenProps = NativeStackNavigationProp<RootStackParamList>;

export function DocumentDetail() {
  const { colors } = useTheme();
  const { textRtlStyle } = useValues();
  const { goBack } = useNavigation<ProfileScreenProps>();
  const [showWarning, setShowWarning] = useState(false);
  const { selfDriver } = useSelector((state) => state.account);
  const { documentData } = useSelector((state) => state.documents);
  const [formData, setFormData] = useState({
    license: "",
  });
    const { translateData } = useSelector((state) => state.setting);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selfDriverData());
    dispatch(documentGet());
  }, []);

  useEffect(() => {
    if (selfDriver) {
      if (selfDriver?.documents) {
        setFormData({
          license: selfDriver?.documents[0]?.document_image?.original_url || "",
        });
      }
    }
  }, [selfDriver]);

  const [uploadedDocuments, setUploadedDocuments] = useState<{
    drivingLicense: DocumentPickerResponse | null;
    panCard: DocumentPickerResponse | null;
  }>({
    drivingLicense: null,
    panCard: null,
  });

  const gotoDocument = () => {
    let hasNullDocument = false;
    for (const documentType in uploadedDocuments) {
      if (
        uploadedDocuments[documentType as keyof typeof uploadedDocuments] ===
        null
      ) {
        hasNullDocument = true;
        break;
      }
    }

    if (hasNullDocument) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      goBack();
      notificationHelper("Update", translateData.detailsUpdateSuccessfully, "success")
    }
  };

  const handleDocumentUpload = async (
    documentType: keyof typeof uploadedDocuments
  ) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setUploadedDocuments({ ...uploadedDocuments, [documentType]: res });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  return (
    <View style={documentstyles.container}>
    <Header title={translateData.documentRegistration} />
    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
     
      <View style={[styles.sub, { backgroundColor: colors.background}]}>
        <View style={[styles.spaceHorizantal]}>
          <TitleView
            title={translateData.documentVerify}
            subTitle={translateData.registerContent}
          />
          <View>
            {documentData?.data?.map((doc) => (
              <View key={doc.id} style={styles.dateContainer}>
                {renderDocumentUpload(
                  uploadedDocuments,
                  handleDocumentUpload,
                  doc.slug,
                  `Upload ${doc.name}`
                )}
                {showWarning[doc.slug] && (
                  <Text
                    style={[
                      styles.titleText,
                      { textAlign: textRtlStyle, color: "red" },
                    ]}
                  >
                    {(`${doc.slug} required`) || `${translateData.fieldrequired}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonView}>
          <Button
            onPress={gotoDocument}
            title={translateData.update}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        </View>
      </View>

      <View style={documentstyles.uploadDocument}>
        {renderDocumentUpload(
          uploadedDocuments,
          handleDocumentUpload,
          "registrationCertificate",
          "Upload Registration Certificate"
        )}
        {showWarning && uploadedDocuments.registrationCertificate === null && (
          <Text style={[styles.titleText, { textAlign: textRtlStyle }]}>
            {translateData.registrationCertificate}
          </Text>
        )}
      </View>

      <View style={styles.buttonView}>
        <Button
          onPress={gotoDocument}
          title={translateData.update}
          backgroundColor={appColors.primary}
          color={appColors.white}
        />
      </View>
    </ScrollView>
    </View>
  );
}
