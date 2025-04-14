import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated from "react-native-reanimated";
import { Header } from "../../../commonComponents";
import appColors from "../../../theme/appColors";
import Icons from "../../../utils/icons/icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import styles from "./styles";
import { useValues } from "../../../utils/context";
import { useDispatch, useSelector } from "react-redux";
import { planDataGet } from "../../../api/store/action/settingAction";

export function Subscription() {
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width;
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { viewRtlStyle, isDark,currSymbol, currValue } = useValues();
  const { planData, loading } = useSelector((state) => state.setting);
  const { navigate } = useNavigation();
  const { translateData } = useSelector((state) => state.setting);

  

  useEffect(() => {
    dispatch(planDataGet());
  }, []);

  const gotopayment = (planId) => {
    navigate("PaymentSelect", { planId });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.item,
          {
            backgroundColor:
              currentIndex === index
                ? appColors.primary
                : isDark
                ? appColors.darkThemeSub
                : appColors.graybackground,
          },
        ]}
      >
        <View style={styles.centerAlign}>
          <View
            style={[
              styles.mainRound,
              {
                backgroundColor:
                  currentIndex === index
                    ? appColors.grayRound
                    : appColors.round,
              },
            ]}
          >
            <View
              style={[
                styles.subRound,
                {
                  backgroundColor:
                    currentIndex === index
                      ? appColors.white
                      : appColors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.price,
                  {
                    color:
                      currentIndex === index
                        ? appColors.primaryFont
                        : appColors.white,
                  },
                ]}
              >
                {currSymbol}{currValue * Math.floor(item.price)}
              </Text>
              <Text
                style={[
                  styles.type,
                  {
                    color:
                      currentIndex === index
                        ? appColors.secondaryFont
                        : appColors.white,
                  },
                ]}
              >
                /{translateData.month}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.itemText,
            {
              color:
                currentIndex === index ? appColors.white : appColors.primary,
            },
          ]}
        >
          {item.name}
        </Text>

        <ScrollView contentContainerStyle={styles.featuresContainer}>
          {item.description.map((feature, idx) => (
            <View
              key={idx}
              style={[styles.featureRow, { flexDirection: viewRtlStyle }]}
            >
              <Icons.ShildTik
                background={
                  currentIndex === index ? appColors.white : appColors.primary
                }
                tik={
                  currentIndex === index ? appColors.primary : appColors.white
                }
              />
              <Text
                style={[
                  styles.features,
                  {
                    color:
                      currentIndex === index ? appColors.white : colors.text,
                  },
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.msgContainer}>
          <View style={[styles.direction, { flexDirection: viewRtlStyle }]}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentIndex === index
                      ? appColors.planDot
                      : appColors.planLine,
                },
              ]}
            />
            <View
              style={[
                styles.dashLine,
                {
                  borderColor:
                    currentIndex === index
                      ? appColors.planDot
                      : appColors.planLine,
                },
              ]}
            />
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentIndex === index
                      ? appColors.planDot
                      : appColors.planLine,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.msg,
              { color: currentIndex === index ? appColors.white : colors.text },
            ]}
          >
            {translateData.subNote}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => gotopayment(item.id)}
          style={[
            styles.selectBtn,
            {
              backgroundColor:
                currentIndex === index ? appColors.white : appColors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomNote,
              {
                color:
                  currentIndex === index ? appColors.primary : appColors.white,
              },
            ]}
          >
            {translateData.selectPlan}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View
      style={[
        styles.MainContainer,
        { backgroundColor: isDark ? appColors.primaryFont : appColors.white },
      ]}
    >
      <View
        style={{
          backgroundColor: isDark ? appColors.primaryFont : appColors.white,
        }}
      >
        <Header
          title={translateData.planDetails}
          backgroundColor={isDark ? appColors.primaryFont : appColors.white}
        />
      </View>
      <View
        style={[
          styles.planTitleContainer,
          { backgroundColor: isDark ? appColors.primaryFont : appColors.white },
        ]}
      >
        <Text
          style={[
            styles.planTitle,
            { color: isNotificationOn ? appColors.primary : colors.text },
          ]}
        >
          {translateData.subscriptionTitle}
        </Text>
        <Text style={styles.planHeading}>{translateData.subscriptionMsg}</Text>
      </View>
      <View style={styles.container}>
        <Carousel
          width={width}
          height={570}
          data={planData?.data || []}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width * 0.8}
          inactiveSlideOpacity={0.7}
          inactiveSlideScale={0.8}
          loop={false}
          onSnapToItem={(index) => setCurrentIndex(index)}
          useNativeDriver={true}
        />
      </View>
      <View
        style={[
          styles.noteContainer,
          {
            backgroundColor: isDark
              ? appColors.darkThemeSub
              : appColors.planNote,
          },
        ]}
      >
        <Text style={[styles.note, { color: colors.text }]}>
          {" "}
          {translateData.subscriptionNote}
        </Text>
      </View>
    </View>
  );
}
