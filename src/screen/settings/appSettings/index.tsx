import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CurrencyModal,
  LanguageModal,
  Notification,
  DarkTheme,
  Rtl,
  SkeletonAppPage,
} from "./component/";
import styles from "./styles";
import { Header } from "../../../commonComponents";
import { useTheme } from "@react-navigation/native";
import { useLoadingContext } from "../../../utils/loadingContext";
import { useDispatch, useSelector } from "react-redux";
import { languageDataGet, currencyDataGet } from "../../../api/store/action";

export function AppSettings() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const { translateData } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(languageDataGet());
    dispatch(currencyDataGet())
  }, []);

  useEffect(() => {
    if (!addressLoaded) {
      setLoading(true);
      setLoading(false);
      setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Header title={translateData.appSetting} />
      <View style={styles.container}>
        <View
          style={[
            styles.listContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <View key={index}>
                <SkeletonAppPage />
              </View>
            ))
          ) : (
            <>
              <DarkTheme />
              <Notification />
              <Rtl />
              <CurrencyModal />
              <LanguageModal />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
