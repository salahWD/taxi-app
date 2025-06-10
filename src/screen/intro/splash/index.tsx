import React, { useEffect, useState, useCallback } from "react";
import { Image, View } from "react-native";
import images from "../../../utils/images/images";
import styles from "./styles";
import {
  getValue,
  setValue,
  deleteValue,
} from "../../../utils/localstorage/index";
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
  const { settingData, taxidoSettingData } = useSelector(
    (state) => state.setting
  );
  const [splashImage, setSplashImage] = useState<string | null>(null);
  const [showNoInternet, setShowNoInternet] = useState(false);

  useEffect(() => {
    const loadSplashImage = async () => {
      try {
        const cachedImage = await getValue("splashImage");
        if (cachedImage) {
          console.log("Scenario 1: Cached splash image loaded:", cachedImage);
          setSplashImage(cachedImage);
        } else {
          console.log("Scenario 3: No cached splash image found");
        }
      } catch (error) {
        console.error(
          "Scenario 7: Error loading splash image from storage:",
          error
        );
      }
    };
    loadSplashImage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Scenario 1: Starting data fetch");
        await dispatch(taxidosettingDataGet());
        await dispatch(settingDataGet());
        await dispatch(translateDataGet());
        await dispatch(selfDriverData());
        await dispatch(selfData());
        console.log("Scenario 1: Data fetch completed successfully");
      } catch (error) {
        console.error("Scenario 6: Data fetch failed:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const updateSplashImage = async () => {
      const serverImage =
        taxidoSettingData?.taxido_values?.setting?.driver_splash_screen
          ?.original_url;

      try {
        if (serverImage && typeof serverImage === "string") {
          console.log(
            "Scenario 1: Updating splash image with server URL:",
            serverImage
          );
          await setValue("splashImage", serverImage);
        } else {
          console.log(
            "Scenario 4: No valid server splash image, deleting cached image"
          );
          await deleteValue("splashImage");
        }
      } catch (error) {
        console.error(
          "Scenario 7: Error updating splash image in storage:",
          error
        );
      }
    };
    if (taxidoSettingData) {
      console.log(
        "Scenario 1/4: taxidoSettingData available, checking splash image"
      );
      updateSplashImage();
    } else {
      console.log("Scenario 4: taxidoSettingData not available");
    }
  }, [taxidoSettingData]);

  useEffect(() => {
    console.log("Debug: settingData state:", settingData); // Log full settingData for inspection
    if (!settingData) {
      console.log(
        "Scenario 2: settingData is null or undefined, waiting for data"
      );
      return;
    }
    if (!settingData?.values?.activation) {
      console.log(
        "Scenario 2: No activation data, proceeding to next screen as fallback"
      );
      proceedToNextScreen(); // Proceed anyway if activation data is missing
      return;
    }
    const { maintenance_mode } = settingData?.values?.activation;
    if (maintenance_mode === "1" || maintenance_mode === 1) {
      console.log("Scenario 2: Maintenance mode active");
      setShowNoInternet(true);
    } else {
      console.log(
        "Scenario 1/8/9: Maintenance mode off, proceeding to next screen"
      );
      proceedToNextScreen();
    }
  }, [settingData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Debug: Timeout triggered, forcing navigation");
      proceedToNextScreen();
    }, 1000); // 5-second fallback
    return () => clearTimeout(timeout);
  }, [proceedToNextScreen]);

  // const proceedToNextScreen = useCallback(async () => {
  //   try {
  //     const token = await getValue("token");
  //     if (token) {
  //       console.log("Scenario 9: Token found, navigating to TabNav");
  //       dispatch(selfData());
  //       replace("TabNav");
  //     } else {
  //       console.log("Scenario 8: No token found, navigating to OnBoarding");
  //       // replace("OnBoarding");
  //     }
  //   } catch (error) {
  //     console.error("Scenario 7: Error reading token from storage:", error);
  //   }
  // }, [dispatch, replace]);
  const proceedToNextScreen = useCallback(async () => {
    console.log(
      "Debug: proceedToNextScreen called, replace function:",
      replace
    );
    try {
      const token = await getValue("token");
      if (token) {
        console.log("Scenario 9: Token found, navigating to TabNav");
        dispatch(selfData());
        replace("TabNav");
      } else {
        console.log("Scenario 8: No token found, navigating to OnBoarding");
        replace("OnBoarding");
      }
    } catch (error) {
      console.error("Scenario 7: Error reading token from storage:", error);
    }
  }, [dispatch, replace]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={splashImage ? { uri: splashImage } : images.splashDriver}
          style={styles.img}
          onError={() => {
            console.log(
              "Scenario 5: Splash image failed to load, falling back to default"
            );
            setSplashImage(null);
            deleteValue("splashImage");
          }}
        />
      </View>
    </View>
  );
}
