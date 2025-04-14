import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../../theme/appConstant";

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: '100%',
        marginBottom: windowHeight(10)
    },
    container: {
        paddingHorizontal: windowWidth(4)
    },
})
export default styles
