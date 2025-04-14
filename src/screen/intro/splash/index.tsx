import React, { useEffect, useState, useCallback } from "react";
import { Image, View } from "react-native";
import images from "../../../utils/images/images";
import styles from "./styles";
import { getValue, setValue, deleteValue } from "../../../utils/localstorage/index";
import {
  selfData,
  selfDriverData,
  settingDataGet,
  translateDataGet,
  taxidosettingDataGet,
} from "../../../api/store/action";
import { useDispatch, useSelector } from "react-redux";
import { useAppNavigation } from "../../../utils/navigation";

export function Splash() {
  const { replace } = useAppNavigation();
  const dispatch = useDispatch();
  const { settingData, taxidoSettingData } = useSelector((state) => state.setting);
  const [splashImage, setSplashImage] = useState<string | null>(null);
  const [showNoInternet, setShowNoInternet] = useState(false);


  useEffect(() => {
    const loadSplashImage = async () => {
      try {
        const cachedImage = await getValue("splashImage");
        if (cachedImage) {
          setSplashImage(cachedImage);
        }
      } catch (error) {
        console.error("Error loading splash image:", error);
      }
    };
    loadSplashImage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        await dispatch(taxidosettingDataGet());
        await dispatch(settingDataGet());
        await dispatch(translateDataGet());
        await dispatch(selfDriverData());
        await dispatch(selfData());
      };
      fetchData();
    }, [dispatch]);

    useEffect(() => {
      const updateSplashImage = async () => {
        const serverImage = taxidoSettingData?.taxido_values?.setting?.driver_splash_screen?.original_url;

        try {
          if (serverImage && typeof serverImage === "string") {
            await setValue("splashImage", serverImage);
          } else {
            await deleteValue("splashImage");
          }
        } catch (error) {
          console.error("Error updating splash image:", error);
        }
      };
      if (taxidoSettingData) {
        updateSplashImage();
      }
    }, [taxidoSettingData]);
  


    useEffect(() => {
      if (!settingData?.values?.activation) return;
      const { maintenance_mode } = settingData?.values?.activation;
      if (maintenance_mode === "1" || maintenance_mode === 1) {
        setShowNoInternet(true);
      } else {
        proceedToNextScreen();
      }
    }, [settingData]);


    const proceedToNextScreen = useCallback(async () => {
      const token = await getValue("token");
      if (token) {
        dispatch(selfData());
        replace("TabNav");
      } else {
        replace("OnBoarding");
      }
  }, [dispatch, replace]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={splashImage ? { uri: splashImage } : images.splashDriver}
          style={styles.img}
          onError={() => {
            setSplashImage(null);
            deleteValue("splashImage");
          }}
        />
      </View>
    </View>
  );
}
