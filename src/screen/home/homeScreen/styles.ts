import { StyleSheet } from "react-native";
import appColors from "../../../theme/appColors";
import appFonts from "../../../theme/appFonts";
import { fontSizes, windowWidth } from "../../../theme/appConstant";
import { windowHeight } from "../../../theme/appConstant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spaceBelow: {
        paddingBottom: windowHeight(10),
    },
    rideContainer: {
        paddingHorizontal: windowWidth(4),
        paddingTop: windowHeight(2),
        paddingBottom: windowHeight(3),
        marginTop: windowHeight(2.5),
    },
    rideTitle: {
        marginVertical: windowHeight(0.3),
        fontSize: fontSizes.FONT5,
        fontFamily: appFonts.medium,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.modelBg,
    },
    modalContainer: {
        width: '80%',
        paddingVertical: windowHeight(2.8),
        paddingHorizontal: windowWidth(5),
        borderRadius: windowHeight(0.9),
        alignItems: 'center',
    },
    modalTitle: {
        color: appColors.primaryFont,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT4
    },
    buttonContainer: {
        width: '102%',
        justifyContent: 'space-between',
        marginTop: windowHeight(2)
    },
    button: {
        backgroundColor: appColors.primary,
        width: windowWidth(34),
        height: windowHeight(5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(0.7)
    },
    buttonText: {
        fontFamily: appFonts.medium,
        color: appColors.white
    },
    noRideText: {
        color: appColors.secondaryFont,
        fontFamily: appFonts.regular,
        textAlign: 'center',
        width: windowWidth(80)
    },
    noRideImg: {
        height: windowHeight(25),
        width: windowWidth(80)
    },
    noRideContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: windowHeight(3),
        paddingBottom: windowHeight(10),
    },
    infoMenu: {
        marginHorizontal: windowWidth(2),
        paddingTop: windowHeight(0.2),
    },
    selfDriver: {
        position: "absolute",
        bottom: windowHeight(10),
        zIndex: 3,
        height: windowHeight(8),
        width: "100%",
    },
    titleStyle: {
        fontFamily: appFonts.medium,
        paddingHorizontal: 10,
    },
    gifImg: { width: windowHeight(8), height: windowHeight(8) },
    listStyle: { paddingHorizontal: windowHeight(0.8) },
    containerStyles: {
        borderRadius: windowHeight(5),
        marginHorizontal: windowWidth(4),
        backgroundColor: appColors.primary,
    },
    railStyles: {
        borderRadius: windowHeight(5),
        borderWidth: windowHeight(0),
        paddingVertical: windowHeight(0.55),
    },
    thumbIconStyles: {
        borderRadius: windowHeight(5),
        borderWidth: windowHeight(0),
        width: 50,
        height: 50,
        backgroundColor: appColors.primary,
    },

})
export default styles