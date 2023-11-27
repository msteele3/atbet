import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colorPalette } from '../resources/colors';

const StatComponent = ({
  statTeamOne,
  statName,
  statTeamTwo,
  betterStat,
  fontSize = 16,
  statDescription,
  onStatClick, // Pass the callback function as a prop
  isDarkModeEnabled
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor: colorPalette.lightColors.safeAreaColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      paddingBottom: 30,
    },
    textContainer: {
      flex: 1,
    },
  });
  const isBetterStatTeamOne = betterStat === 1;
  const isBetterStatTeamTwo = betterStat === 2;
  const statTeamOneColor = isBetterStatTeamOne ? 'green' : 'red';
  const statTeamTwoColor = isBetterStatTeamTwo ? 'green' : 'red';
  const [displayTip, setDisplayTip] = useState(false);

  const textStyle = {
    color: 'blue',
    fontSize,
  };

  const midStyle = {
    color: 'blue',
    fontSize: 32,
  };

  const handleViewClick = () => {
    if (displayTip) {
      setDisplayTip(false);
    } else {
      setDisplayTip(true);
    }

    // Call the callback function to track the click
    onStatClick(statName);
  };

  return (
    <View style={{ display: 'flex', alignItems: 'center', backgroundColor: isDarkModeEnabled? colorPalette.darkColors.safeAreaColor: colorPalette.lightColors.safeAreaColor}}>
      <TouchableOpacity onPress={handleViewClick}>
        <View style={styles.container}>
          <View style={[styles.textContainer, { alignItems: 'center' }]}>
            <Text style={{ color: statTeamOneColor, fontSize }}>{statTeamOne}</Text>
          </View>
          <View style={[styles.textContainer, { alignItems: 'center' }]}>
            <Text style={midStyle}>{statName}</Text>
          </View>
          <View style={[styles.textContainer, { alignItems: 'center' }]}>
            <Text style={{ color: statTeamTwoColor, fontSize }}>{statTeamTwo}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {displayTip ? (
        <View style={{ width: '80%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: isDarkModeEnabled ? colorPalette.darkColors.pickerTextColor: colorPalette.lightColors.pickerTextColor }}>
          <Text style={{textAlign: 'center',color:isDarkModeEnabled ? colorPalette.darkColors.pickerTextColor: colorPalette.lightColors.pickerTextColor}}>{statDescription}</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};



export default StatComponent;
