import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatComponent = ({ statTeamOne, statName, statTeamTwo, betterStat, fontSize = 16 }) => {
  const isBetterStatTeamOne = betterStat === 1;
  const isBetterStatTeamTwo = betterStat === 2;

  const statTeamOneColor = isBetterStatTeamOne ? 'green' : 'red';
  const statTeamTwoColor = isBetterStatTeamTwo ? 'green' : 'red';

  const textStyle = {
    color: 'blue',
    fontSize,
  };

  const midStyle = {
    color: 'blue',
    fontSize: 32,
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 30,
  },
  textContainer: {
    flex: 1,
  },
});

export default StatComponent;
