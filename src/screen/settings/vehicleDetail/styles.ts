import { StyleSheet } from 'react-native';
import { windowHeight } from '../../../theme/appConstant';
import appFonts from '../../../theme/appFonts';


const vehicleStyles = StyleSheet.create({
    serviceList: {
        marginTop: windowHeight(6)
    },
    categoryList: { marginTop: windowHeight(0.8) },
    viewContainer: { bottom: windowHeight(1) },
    Category: { bottom: windowHeight(35) },
    vehicle: { bottom: windowHeight(3.3) },
    vehicleNo: { bottom: windowHeight(49) },
    datePicker: { bottom: windowHeight(4.3) },
    vehicleRegistrationDate: {
        fontFamily: appFonts.medium, marginBottom: windowHeight(1),
    },
    vehicleColor: { bottom: windowHeight(50) },
    seat: { bottom: windowHeight(56) },
    selectCategory: { bottom: windowHeight(5.8) },
    selectVehicle: { bottom: windowHeight(6) },
    vehicleName: { bottom: windowHeight(2.2) },
    registrationDate:{bottom: windowHeight(10)},

})


export default vehicleStyles;