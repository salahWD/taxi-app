import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import appColors from '../../../../../../theme/appColors';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { categoryDataGet } from '../../../../../../api/store/action/categoryAction';
import DropDownPicker from 'react-native-dropdown-picker';
import { useValues } from '../../../../../../utils/context';
import { fontSizes, windowHeight } from '../../../../../../theme/appConstant';
import styles from './styles';

interface RenderItemsProps {
  categoryIndex: number;
  selectedCategory: string;
  handleItemPress: (index: number, categoryName: string) => void;
  selectedService: string;
}

export function RenderCategoryList({ handleItemPress, selectedService, selectedCategory }: RenderItemsProps) {
  const { colors } = useTheme();
  const { rtl, isDark,viewRtlStyle } = useValues()
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state: any) => state.serviceCategory);
  const [serviceDataValue, setServiceDataValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    getCategory();
  }, []);


  useEffect(() => {
    if (selectedService && typeof selectedService === "string" && categoryData?.data?.length > 0) {
      const filteredServices = categoryData.data.filter(category => {

        return (
          Array.isArray(category.used_for) &&
          category.used_for.some(service => {
            return service.name.toLowerCase() === selectedService.toLowerCase();
          })
        );
      });

      setServiceDataValue(filteredServices);
      setValue(selectedCategory);

      const dropdownItems = filteredServices.map(item => ({
        label: item.name,
        value: item.id,
      }));

      setItems(dropdownItems);
    }
  }, [selectedService, categoryData]);



  const getCategory = () => {
    dispatch(categoryDataGet());
  };


  const handleValueChange = (itemValue: number) => {
    setValue(itemValue);
    const selectedItem = serviceDataValue.find(item => item.id === itemValue);

    if (selectedItem) {
      handleItemPress(serviceDataValue.indexOf(selectedItem), selectedItem.name, selectedItem.id, selectedItem.slug);
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
        dropDownContainerStyle={{ backgroundColor:isDark?colors.card: appColors.dropDownColor,borderColor:colors.border}}
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
        zIndex={3}
        listMode="SCROLLVIEW" 
        dropDownDirection="AUTO"
      />
    </View>
  );
}
