import { TouchableOpacity } from "react-native";
import React from "react";
import Icons from "../../utils/icons/icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import commanStyles from "../../style/commanStyles";

export function BackButton({ customStyle = {} }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const gotoBack = () => {
    navigation.goBack();
  };

  const styles = [
    commanStyles.backButton,
    { backgroundColor: colors.card, borderColor: colors.border },
  ];

  if (customStyle !== undefined) {
    styles.push(customStyle);
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={gotoBack} style={styles}>
      <Icons.Back color={colors.text} />
    </TouchableOpacity>
  );
}
