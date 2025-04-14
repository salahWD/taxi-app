import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../../screen/home';
import { ActiveRide } from '../../screen/home/activeRide';
import { MyRide, Settings } from '../../screen';
import { Text } from 'react-native';
import appColors from '../../theme/appColors';
import Icons from '../../utils/icons/icons';
import styles from './styles';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function App() {
    const { translateData } = useSelector((state) => state.setting);

    const defaultTranslations = {
        home: "Home",
        activeRide: "Active Ride",
        myRide: "My Ride",
        settings: "Settings"
    };

    const t = translateData || defaultTranslations;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBarContainer,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name={"Home"}
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icons.Home color={focused ? appColors.white : appColors.categoryTitle} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabelStyle, { color: focused ? appColors.white : appColors.categoryTitle }]}>
                            {t.home}
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name={"Active Ride"}
                component={ActiveRide}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icons.DrivingLarge color={focused ? appColors.white : appColors.categoryTitle} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabelStyle, { color: focused ? appColors.white : appColors.categoryTitle }]}>
                            {t.activeRide}
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name={"My Ride"}
                component={MyRide}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icons.Car color={focused ? appColors.white : appColors.categoryTitle} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabelStyle, { color: focused ? appColors.white : appColors.categoryTitle }]}>
                            {t.myRide}
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name={"Settings"}
                component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icons.Setting color={focused ? appColors.white : appColors.categoryTitle} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabelStyle, { color: focused ? appColors.white : appColors.categoryTitle }]}>
                            {t.settings}
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
