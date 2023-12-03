import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import StatsAPI from '../lib/connect/statsApi'
import { colorPalette, darkColors } from '../resources/colors';


//  router.push(`/win/AltWins`)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
  },
});


const Home = () => {

  // load list of teams
  const [isLoadingTeams, setLoadingTeams] = useState(true);
  const [teams, setTeams] = useState([]);
  const statsAPI = new StatsAPI();

  const selectedItemBackground = isDarkModeEnabled 
                                 ? colorPalette.darkColors.selectedItemBackground 
                                 : colorPalette.lightColors.selectedItemBackground;

  const getTeams = async() => {
    try {
      const teamsResp = await statsAPI.getTeams();
      setTeams(teamsResp);
      setSelectedTeam(teamsResp[0])
      setSelectedTeam2(teamsResp[0])
    } catch(e) {
      console.error("error occurred while calling getTeams: " + e.message, e, e.stack);
    }
  };
  useEffect(() => {
    getTeams();
  }, []);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const startTimer = () => {
    startTimeRef.current = new Date(); // Record the start time
  };
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);


  const stopTimerAndLog = () => {
    if (startTimeRef.current) {
      const endTime = new Date();
      const duration = endTime - startTimeRef.current; // Calculate the duration
      console.log(`Time on main page ${duration} milliseconds`);
      startTimeRef.current = null;
    }
  };
  
  useEffect(() => {
    startTimer();
  }, []);
  return (
<SafeAreaView style={{ flex: 1, backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.safeAreaColor }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: isDarkModeEnabled ? colorPalette.darkColors.safeAreaColor : colorPalette.lightColors.safeAreaColor},
          headerShadowVisible: false,
          headerTitle: "At Bet",
          headerTitleStyle: {
            fontSize: 26,
            color: isDarkModeEnabled ? colorPalette.darkColors.pickerTextColor : colorPalette.lightColors.pickerTextColor,
          }

        }}
      />
      
      <View style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 100, width: '100%' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>Advertisement</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 50, color: 'blue', paddingTop: 0, paddingBottom: 0, width: "100%", alignItems:"center", paddingLeft: "10%"}}>Select Matchup</Text>
        <Picker style={{ height: 40, width: 700, paddingBottom: 200, backgroundColor: selectedItemBackground}}
          selectedValue={selectedTeam} onValueChange={(itemValue) => setSelectedTeam(itemValue)}>
          {
            teams.length > 0
            ?
              teams.map((team, index) => (
                <Picker.Item key={index} label={team} value={team} color={isDarkModeEnabled 
                  ? colorPalette.darkColors.pickerTextColor 
                  : colorPalette.lightColors.pickerTextColor} />
              ))
            :
              <Picker.Item label="Loading..." value="Loading..." color={isDarkModeEnabled 
                ? colorPalette.darkColors.pickerTextColor 
                : colorPalette.lightColors.pickerTextColor} />
          }
        </Picker>
        <Text style={{ fontSize: 50, color: 'blue', paddingBottom: 0 }}>vs</Text>
        <Picker style={{ height: 40, width: 700, paddingBottom: 200, backgroundColor: selectedItemBackground }}
          selectedValue={selectedTeam2} onValueChange={(itemValue) => setSelectedTeam2(itemValue)}>
          {
            teams.length > 0
            ?
              teams.map((team, index) => (
                <Picker.Item key={index} label={team} value={team} color={isDarkModeEnabled 
                ? colorPalette.darkColors.pickerTextColor 
                  : colorPalette.lightColors.pickerTextColor}/>
              ))
            :
              <Picker.Item label="Loading..." value="Loading..." color={isDarkModeEnabled 
                ? colorPalette.darkColors.pickerTextColor 
                : colorPalette.lightColors.pickerTextColor} />
          }
        </Picker>
        <TouchableOpacity style={styles.button} onPress={() => {
          if (teams != [] && selectedTeam != selectedTeam2) {
            stopTimerAndLog();
            const url = `/win/Wins?darkmode=${isDarkModeEnabled}&team1=${selectedTeam}&team2=${selectedTeam2}`
            console.log(url)
            router.push(url)
            //router.push(`/win/AltWins`)
          }
        }}>
          <Text style={styles.buttonText}>GO</Text>
        </TouchableOpacity>
      </View>


      
      <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginBottom: 10 }}>Enable Dark Mode</Text>
          <Switch
            style={{
              display: 'flex',
            }}
            onValueChange={() => {
              setIsDarkModeEnabled(!isDarkModeEnabled);
            }}
            value={isDarkModeEnabled}
          />
        </View>
      </View>
      </SafeAreaView>
       );
      }


export default Home;

