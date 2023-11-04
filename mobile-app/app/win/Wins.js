import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, Switch, Text } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import StatComponent from '../../components/StatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Wins() {

  const navigation = useNavigation();
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = () => {
    startTimeRef.current = new Date(); // Record the start time
  };

  const stopTimerAndLog = () => {
    if (startTimeRef.current) {
      const endTime = new Date();
      const duration = endTime - startTimeRef.current; // Calculate the duration
      console.log(`Time on wins page ${duration} milliseconds`);
      startTimeRef.current = null;
    }
  };

   // Handle navigation away from the page
   const handleNavigationAway = () => {
    stopTimerAndLog(); // Stop the timer when navigating away
    console.log("Navigated away from the page");
    navigation.removeListener('beforeRemove', handleNavigationAway);
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', handleNavigationAway);
    return () => {
      navigation.removeListener('beforeRemove', handleNavigationAway);
    };
  }, [navigation]);
  const { team1, team2 } = useLocalSearchParams({ team1: String, team2: String }) //Hello guys, this is the teams that the person selects by full name
  const prediction = "ATL"
  const styles = StyleSheet.create({
    statContainer: {
      paddingTop: 30,
      paddingBottom: 50,
    },
  });
  const [clickCounts, setClickCounts] = useState({});

  const handleStatClick = (statName) => {
    // Update the click count in the state
    setClickCounts((clickCounts) => ({
      ...clickCounts,
      [statName]: (clickCounts[statName] || 0) + 1,
    }));
    console.log(clickCounts)
  };
  const fakeStatsData = [
    {
      statTeamOne: '-152',
      statName: 'Odds',
      statTeamTwo: '+126',
      betterStat: 1,
      fontSize: 20,
      statDescription: 'Betting odds for Team One vs. Team Two. Negative value (-152) indicates Team One is favored, while a positive value (+126) suggests Team Two is the underdog.'
    },
    {
      statTeamOne: '64.3%',
      statName: 'OBP',
      statTeamTwo: '50.2%',
      betterStat: 1,
      fontSize: 20,
      statDescription: 'On-Base Percentage (OBP) measures a batter\'s ability to get on base. Team One has a higher OBP (64.3%), indicating better performance in this statistic.'
    },
    {
      statTeamOne: '.276',
      statName: 'BA',
      statTeamTwo: '.257',
      betterStat: 1,
      fontSize: 20,
      statDescription: 'Batting Average (BA) represents a player\'s hitting efficiency. Team One has a higher BA (.276), indicating a better batting average.'
    },
    {
      statTeamOne: '.343',
      statName: 'OPS',
      statTeamTwo: '.329',
      betterStat: 1,
      fontSize: 20,
      statDescription: 'OPS (On-Base Plus Slugging) is a comprehensive statistic that combines a batters ability to get on base and their power at the plate. Team One has a higher OPS (.343), indicating better overall performance in this statistic.'
    },    
    {
      statTeamOne: '4.08',
      statName: 'ERA',
      statTeamTwo: '4.04',
      betterStat: 2,
      fontSize: 20,
      statDescription: 'Earned Run Average (ERA) measures a pitcher\'s effectiveness. Team Two has a slightly better ERA (4.04) compared to Team One (4.08).'
    },
    {
      statTeamOne: '1.292',
      statName: 'WHIP',
      statTeamTwo: '1.251',
      betterStat: 2,
      fontSize: 20,
      statDescription: 'Walks plus Hits per Inning Pitched (WHIP) measures a pitcher\'s ability to prevent baserunners. Team Two has a better WHIP (1.251) compared to Team One (1.292).'
    },
  ];
  useEffect(() => {
    startTimer();
    console.log("stats timer started")
  }, []);

  async function getStatsVisibilitySetting() {
    try {
      const readValue = await AsyncStorage.getItem('statsVisible');
      //console.log("read value: " + readValue)
      if (readValue !== "true" && readValue !== "false") {
        //console.log("defaulting stats visibility to true due to invalid or no value stored");
        await setStatsVisibilitySetting(true);
        return true;
      } else {
        return readValue === "true";
      }
    } catch (e) {
      console.error(e);
      console.log("defaulting stats visibility to true due to error");
      return true;
    }
  }

  async function setStatsVisibilitySetting(visibility) {
    try {
      console.log("storing statsVisible value: " + visibility);
      await AsyncStorage.setItem('statsVisible', ("" + visibility));
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
        <Text style={{ color: "blue", fontSize: 60, paddingTop: 10, paddingBottom: 0 }}>ATL    vs    PHI</Text>
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
                  statDescription={data.statDescription}
                  onStatClick={handleStatClick}
                />
              ))}
            </View>
            : null
        }

      </View>
    </SafeAreaView>
  );
}
