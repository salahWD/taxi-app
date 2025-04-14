import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { useValues } from "../../../../../utils/context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/main/types";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import appColors from "../../../../../theme/appColors";
import { walletData } from "../../../../../api/store/action/walletActions";
import { UserContainerLoader } from "./userLoader";
import { getValue } from "../../../../../utils/localstorage";
import { selfData } from "../../../../../api/store/action";

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export function Profile() {
  const { currSymbol, currValue, viewRtlStyle, textRtlStyle } = useValues();
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationType>();
  const dispatch = useDispatch();
  const { translateData } = useSelector((state) => state.setting);
  const { self } = useSelector((state) => state.account);
  const { walletTypedata } = useSelector((state) => state.wallet);
  const [walletLoading, setWalletLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const char = self?.name ? self.name.charAt(0) : "";

  useEffect(() => {
    const fetchData = async () => {
      setWalletLoading(true);
      dispatch(walletData());
      const value = await getValue("token");
      setToken(value);
      setWalletLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    dispatch(selfData());
  }, [dispatch]);

  return (
    <View
      style={[
        styles.main,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {walletLoading ? (
        <UserContainerLoader />
      ) : (
        <>
          <View style={[styles.detainContain, { flexDirection: viewRtlStyle }]}>
            {self?.profile_image?.original_url ? (
              <Image
                source={{ uri: self.profile_image.original_url }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.nameTag}>
                <Text style={[styles.char, { color: appColors.white }]}>{char}</Text>
              </View>
            )}

            <View style={styles.details}>
              <Text
                style={[
                  styles.name,
                  { color: colors.text, textAlign: textRtlStyle },
                ]}
              >
                {self?.name || translateData.guest}
              </Text>
              {self?.email && (
                <Text style={[styles.mail, { textAlign: textRtlStyle }]}>
                  {self.email}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.walletContain}
            onPress={() => navigate("MyWallet")}
          >
            <View style={[styles.wallet, { flexDirection: viewRtlStyle }]}>
              <Text style={styles.walletTitle}>{translateData.walletBalance}</Text>
              <Text style={styles.walletAmount}>
                {currSymbol}
                {isNaN(currValue * walletTypedata?.balance) ? "0" : currValue * walletTypedata.balance}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
