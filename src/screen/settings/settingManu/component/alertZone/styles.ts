import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../../../../theme/appConstant";
import appColors from "../../../../../theme/appColors";
import appFonts from "../../../../../theme/appFonts";

const styles = StyleSheet.create({
    main: {
        height: windowHeight(21.5),
        width: '100%',
        marginVertical: windowHeight(1.5),
        borderRadius: windowHeight(0.9),
    },
    loaderTitle: {
        marginVertical: windowHeight(1.5),
        height: windowHeight(2.5),
        width: windowWidth(20),
        left: windowHeight(2)
    },
    title: {
        color: appColors.red,
        marginVertical: windowHeight(2),
        marginHorizontal: windowWidth(3),
        fontFamily: appFonts.regular
    },
    border: {
        borderBottomWidth: windowHeight(0.1),
        marginHorizontal: windowWidth(4)
    },
    loaderStyle: {
        bottom: windowHeight(2.5),
    },
    modelButton: {
        justifyContent: "space-between",
        paddingHorizontal:windowHeight(2),
        marginTop:windowHeight(2)
    },
    modelTitle: {
        fontFamily: appFonts.regular,
        width: windowWidth(300),
        textAlign: "center",
        marginBottom: windowHeight(20),
    },
    modelView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent:{
        width:'92%',
        borderRadius:windowHeight(1)
    },
    alertBorder: {
        borderBottomWidth: windowHeight(0.9),
        marginHorizontal: windowHeight(13),
        marginVertical: windowHeight(10),
    },
    cancelButton:{
        height:windowHeight(5.7),
        width:'48%',
        marginBottom:windowHeight(2),
        borderRadius:windowHeight(0.7)
    }
})
export default styles;



