import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import appColors from '../../../../../../theme/appColors';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { vehicleTypeDataGet } from '../../../../../../api/store/action/vehicleTypeAction';
import { useValues } from '../../../../../../utils/context';
import { fontSizes, windowHeight } from '../../../../../../theme/appConstant';
import styles from './styles';

interface RenderItemsProps {
  vehicleIndex?: number;
  handleItemPress: (index: number, name: string, itemid?: number) => void;
  selectedVehicle: string;
  selectedCategory?: string;
  serviceId?: number;
  categoryId?: number;
  selectedItemIndex?: number;
}

export function RenderVehicleList({ handleItemPress, serviceId, categoryId, selectedVehicle }: RenderItemsProps) {
  const { vehicleTypedata } = useSelector((state: any) => state.vehicleType);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { rtl, isDark,viewRtlStyle } = useValues()
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    getService();
  }, [serviceId, categoryId]);

  useEffect(() => {
    if (vehicleTypedata && vehicleTypedata.data) {
      setValue(selectedVehicle)
      const dropdownItems = vehicleTypedata.data?.map(vehicle => ({
        label: vehicle.name,
        value: selectedVehicle ? selectedVehicle : vehicle.name,
      }));
      setItems(dropdownItems);
    }
  }, [vehicleTypedata]);

  const getService = () => {
    dispatch(vehicleTypeDataGet({ service_id: serviceId, service_category_id: categoryId }));
  };


  const handleValueChange = (itemValue: string) => {
    setValue(itemValue);
    const selectedItem = vehicleTypedata.data.find(item => item.name === itemValue);
    if (selectedItem) {
      const selectedIndex = vehicleTypedata.data.findIndex(item => item.name === itemValue);
      handleItemPress(selectedIndex, selectedItem.name, selectedItem.id);
    }
  };

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleValueChange}
        placeholder={translateData.selectCategory}
        containerStyle={styles.container}
        placeholderStyle={[styles.placeholderStyles,{ color: isDark?appColors.darkText:appColors.secondaryFont}]}
        style={{ backgroundColor:isDark?appColors.darkThemeSub:appColors.white, borderColor:colors.border ,flexDirection: viewRtlStyle,paddingHorizontal:windowHeight(1.9) }}
        dropDownContainerStyle={{ backgroundColor:isDark?colors.card: appColors.dropDownColor ,borderColor:colors.border}}
        textStyle={[styles.text,{ color: colors.text }]}
        labelStyle={[styles.text,{ color:isDark?appColors.white:appColors.black}]}
        listItemLabelStyle={{color:isDark?appColors.white:appColors.black}}
        tickIconStyle={{
          tintColor: isDark ? appColors.white : appColors.black,
        }}
        arrowIconStyle={{
          tintColor: isDark ? appColors.white : appColors.black, 
        }}
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        textStyle={{
          textAlign: rtl ? 'right' : 'left',
          fontSize: fontSizes.FONT4
        }}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        zIndex={2}
        listMode="SCROLLVIEW"
        dropDownDirection="AUTO"
      />
    </View>
  );
}
