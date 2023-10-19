import React, {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Switch, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import StatComponent from '../../components/StatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Wins() {
  const prediction = "ATL"
  const styles = StyleSheet.create({
    statContainer: {
      paddingTop: 30,
      paddingBottom: 50,
    },
  });
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const teams = ['Atlanta Braves', 'Philidelphia Phillies', 'Chicago Bears', 'Pittsburgh Pirates', 'Orlando Blazers']; // The idea would be to pull a team list of all teams for this
  const fakeStatsData = [
    {
      statTeamOne: '-152',
      statName: 'Odds',
      statTeamTwo: '+126',
      betterStat: 1,
      fontSize: 20,
    },
    {
      statTeamOne: '64.3%',
      statName: 'OBP',
      statTeamTwo: '50.2%',
      betterStat: 1,
      fontSize: 20,
    },
    {
      statTeamOne: '.276',
      statName: 'BA',
      statTeamTwo: '.257',
      betterStat: 1,
      fontSize: 20,
    },
    {
      statTeamOne: '.343',
      statName: 'OBP',
      statTeamTwo: '.329',
      betterStat: 1,
      fontSize: 20,
    },
    {
      statTeamOne: '4.08',
      statName: 'ERA',
      statTeamTwo: '4.04',
      betterStat: 2,
      fontSize: 20,
    },
    {
      statTeamOne: '1.292',
      statName: 'WHIP',
      statTeamTwo: '1.251',
      betterStat: 2,
      fontSize: 20,
    },
  ];

  async function getStatsVisibilitySetting() {
    try {
      const readValue = await AsyncStorage.getItem('statsVisible');
      console.log("read value: " + readValue)
      if (readValue !== "true" && readValue !== "false") {
        console.log("defaulting stats visibility to true due to invalid or no value stored");
        await setStatsVisibilitySetting(true);
        return true;
      } else {
        return readValue === "true";
      }
    } catch(e) {
      console.error(e);
      console.log("defaulting stats visibility to true due to error");
      return true;
    }
  }

  async function setStatsVisibilitySetting(visibility) {
    try {
      console.log("storing statsVisible value: " + visibility);
      await AsyncStorage.setItem('statsVisible', ("" + visibility) );
    } catch (e) {
      console.error(e)
    }
  }

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const initStatsVisibility = async () => {
      const visibility = await getStatsVisibilitySetting();
      console.log("initializing stats visibility to: " + visibility);
      setIsVisible(visibility);
    };
    initStatsVisibility();
  }, []);

  function toggleStats() {
    setStatsVisibilitySetting(!isVisible);
    setIsVisible(!isVisible);
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitle: "At Bet",
          headerTitleStyle: {
            fontSize: 32
          }
        }}
      />
      <View style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between',paddingBottom: 45}}>
        <Picker style={{ height: 40, width: 200  }}
          selectedValue={'Philidelphia Phillies'} onValueChange={(itemValue) => setSelectedTeam(itemValue)}>
          {teams.map((team, index) => (
            <Picker.Item  labelStyle={{ fontSize: 10 }}
            style = {{fontSize: 10}}key={index} label={team} value={team} />
          ))}
        </Picker>   
        <Text style={{ color: "blue", fontSize: 60, paddingTop: 60}}>VS</Text>     
        <Picker style={{ height: 40, width: 200, fontSize : 10}}
          selectedValue={'Chicago Bears'} onValueChange={(itemValue) => setSelectedTeam2(itemValue)}>
          {teams.map((team, index) => (
            <Picker.Item style= {{fontSize: 10}} labelStyle={{ fontSize: 10 }}
             key={index} label={team} value={team} />
          ))}
        </Picker>

        </View>
        <Text style={{ color: "blue", fontSize: 40, paddingTop: 30, paddingBottom: 30 }}>Prediction</Text>
        <Text style={{ color: "green", fontSize: 60, paddingBottom: 15 }}>{prediction}</Text>
        <Switch
          style={{
            display: 'flex',
          }}
          onValueChange={toggleStats}
          value={isVisible}
        />
        {
          isVisible ?
          <View style={styles.statContainer}>
            {fakeStatsData.map((data, index) => (
              <StatComponent
                key={index}
                statTeamOne={data.statTeamOne}
                statName={data.statName}
                statTeamTwo={data.statTeamTwo}
                betterStat={data.betterStat}
                fontSize={30}
              />
            ))}
          </View>
          : null
        }

      </View>
    </SafeAreaView>
  );
}
