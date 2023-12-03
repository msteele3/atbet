import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, Switch, Text } from 'react-native';
import { Stack, useGlobalSearchParams, useNavigation, usePathname, useSearchParams } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import StatComponent from '../../components/StatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorPalette } from '../../resources/colors';

import StatsAPI from '../../lib/connect/statsApi'

export default function Wins() {

  const [statsRaw, setStatsRaw] = useState({});
  const [stats, setStats] = useState([]);
  const [prediction, setPrediction] = useState('');
  const statsAPI = new StatsAPI();
  const {team1} = useLocalSearchParams({ team1: String });
  const {team2} = useLocalSearchParams({ team2: String });
  const getStats = async() => {
    try {
      const statsResp = await statsAPI.getStats(team1, team2);
      setStatsRaw(statsResp);
      const statsToDisplay = [
        {
          statTeamOne: statsResp['odds'][0],
          statName: 'Odds',
          statTeamTwo: statsResp['odds'][1],
          betterStat: parseInt(statsResp['odds'][0]) < 0 ? 1 : 2,
          fontSize: 20,
          statDescription: parseInt(statsResp['odds'][0]) < 0
                           ? `Betting odds for Team One vs. Team Two. Negative value (${statsResp['odds'][0]}) indicates Team One is favored, while a positive value (${statsResp['odds'][1]}) suggests Team Two is the underdog.`
                           : `Betting odds for Team One vs. Team Two. Negative value (${statsResp['odds'][1]}) indicates Team Two is favored, while a positive value (${statsResp['odds'][2]}) suggests Team One is the underdog.`
        },
        {
          statTeamOne: '' + (parseFloat(statsResp['wl'][0]) * 100) + '%',
          statName: 'W-L%',
          statTeamTwo: '' + (parseFloat(statsResp['wl'][1]) * 100) + '%',
          betterStat: parseFloat(statsResp['wl'][0]) > parseFloat(statsResp['wl'][1]) ? 1 : 2,
          fontSize: 20,
          statDescription: parseFloat(statsResp['wl'][0]) > parseFloat(statsResp['wl'][1])
                           ? `Win-Loss Ratio represents the percentage of games that a team has won.  Team One has a better win-loss ratio (${parseFloat(statsResp['wl'][0]) * 100}%) than Team Two (${parseFloat(statsResp['wl'][1]) * 100})`
                           : `Win-Loss Ratio represents the percentage of games that a team has won.  Team Two has a better win-loss ratio (${parseFloat(statsResp['wl'][1]) * 100}%) than Team One (${parseFloat(statsResp['wl'][0]) * 100})`
        },
        {
          statTeamOne: statsResp['ba'][0],
          statName: 'BA',
          statTeamTwo: statsResp['ba'][1],
          betterStat: parseFloat(statsResp['ba'][0]) > parseFloat(statsResp['ba'][1]) ? 1 : 2,
          fontSize: 20,
          statDescription: parseFloat(statsResp['ba'][0]) > parseFloat(statsResp['ba'][1])
                           ? `Batting Average (BA) represents a player\'s hitting efficiency. Team One has a higher BA (${statsResp['ba'][0]}), indicating better overall batting than Team Two (${statsResp['ba'][1]}).`
                           : `Batting Average (BA) represents a player\'s hitting efficiency. Team Two has a higher BA (${statsResp['ba'][1]}), indicating better overall batting than Team One (${statsResp['ba'][0]}).`
        },
        {
          statTeamOne: statsResp['obp'][0],
          statName: 'OBP',
          statTeamTwo: statsResp['obp'][1],
          betterStat: parseFloat(statsResp['obp'][0]) > parseFloat(statsResp['obp'][1]) ? 1 : 2,
          fontSize: 20,
          statDescription: parseFloat(statsResp['obp'][0]) > parseFloat(statsResp['obp'][1])
                           ? `On-Base Percentage (OBP) measures a batter\'s ability to get on base. Team One has a higher OBP (${statsResp['obp'][0]}), indicating better performance than Team Two (${statsResp['obp'][1]}) in this statistic.`
                           : `On-Base Percentage (OBP) measures a batter\'s ability to get on base. Team Two has a higher OBP (${statsResp['obp'][1]}), indicating better performance than Team One (${statsResp['obp'][0]}) in this statistic.`
        },    
        {
          statTeamOne: statsResp['era'][0],
          statName: 'ERA',
          statTeamTwo: statsResp['era'][1],
          betterStat: parseFloat(statsResp['era'][0]) < parseFloat(statsResp['era'][1]) ? 1 : 2,
          fontSize: 20,
          statDescription: parseFloat(statsResp['era'][0]) < parseFloat(statsResp['era'][1])
                           ? `Earned Run Average (ERA) measures a pitcher\'s effectiveness. Team One has a lower ERA (${statsResp['era'][0]}), indicating better pitching than Team Two (${statsResp['era'][1]}).`
                           : `Earned Run Average (ERA) measures a pitcher\'s effectiveness. Team Two has a lower ERA (${statsResp['era'][1]}), indicating better pitching than Team One (${statsResp['era'][0]}).`
        },
        {
          statTeamOne: statsResp['whip'][0],
          statName: 'WHIP',
          statTeamTwo: statsResp['whip'][1],
          betterStat: parseFloat(statsResp['whip'][0]) < parseFloat(statsResp['whip'][1]) ? 1 : 2,
          fontSize: 20,
          statDescription: parseFloat(statsResp['whip'][0]) < parseFloat(statsResp['whip'][1])
                           ? `Walks plus Hits per Inning Pitched (WHIP) measures a pitcher\'s ability to prevent baserunners. Team One has a better WHIP (${statsResp['whip'][0]}), indicating better pitching than Team Two (${statsResp['whip'][1]}).`
                           : `Walks plus Hits per Inning Pitched (WHIP) measures a pitcher\'s ability to prevent baserunners. Team Two has a better WHIP (${statsResp['whip'][1]}), indicating better pitching than Team One (${statsResp['whip'][0]}).`
        },
      ];
      setStats(statsToDisplay);
      let team1_points = 0;
      let team2_points = 0;
      stats.forEach((stat) => {
        if (stat.betterStat === 1) {
          ++team1_points;
        } else {
          ++team2_points
        }
      })
      let team1_wins = team1_points > team2_points;
      if (team1_points === team2_points) {
        // break tie by saying odds is the most important stat
        team1_wins = parseInt(statsResp['odds'][0]) < 0;
      }
      setPrediction(team1_wins ? statsResp['abbrev'][0] : statsResp['abbrev'][1]);
    } catch(e) {
      console.error("error occurred while calling getStats: " + e.message, e, e.stack);
    }
  };
  useEffect(() => {
    getStats();
  }, []);

  const navigation = useNavigation();
  const path = usePathname();
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
  const { darkmode } = useLocalSearchParams({ darkmode: String });
  const isDarkModeEnabled = darkmode === 'true';

  console.log(isDarkModeEnabled)
  const styles = StyleSheet.create({
    statContainer: {
      paddingTop: 30,
      paddingBottom: 50,
      backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.lightColors.safeAreaColor,

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
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.safeAreaColor  }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.safeAreaColor  },
          headerShadowVisible: false,
          headerTitle: "At Bet",
          headerTitleStyle: {
            fontSize: 32,
            color: isDarkModeEnabled ? colorPalette.darkColors.pickerTextColor : colorPalette.lightColors.pickerTextColor,

          }
        }}
      />
      <View style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.safeAreaColor
      }}>
        {
          stats.length === 0
          ?
            <Text style={{ color: "blue", fontSize: 40, paddingTop: 260}}>Loading...</Text>
          :
            <>
              <Text style={{ color: "blue", fontSize: 60, paddingTop: 10, paddingBottom: 0 }}>{statsRaw['abbrev'][0]}    vs    {statsRaw['abbrev'][1]}</Text>
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
                    {stats.map((data, index) => (
                      <StatComponent
                        key={index}
                        statTeamOne={data.statTeamOne}
                        statName={data.statName}
                        statTeamTwo={data.statTeamTwo}
                        betterStat={data.betterStat}
                        fontSize={30}
                        statDescription={data.statDescription}
                        onStatClick={handleStatClick}
                        isDarkModeEnabled={isDarkModeEnabled}
                      />
                    ))}
                  </View>
                  : null
              }
            </>
        }
      </View>
    </SafeAreaView>
  );
}
