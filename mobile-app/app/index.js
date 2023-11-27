import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import StatsAPI from '../lib/connect/statsApi'


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
  const getTeams = async() => {
    try {
      const teamsResp = await statsAPI.getTeams();
      setTeams(teamsResp);
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
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(true);


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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerTitle: "At Bet",
          headerTitleStyle: {
            fontSize: 26
          }

        }}
      />
      
      <View style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 100, width: '100%' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>Advertisement</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 50, color: 'blue', paddingTop: 0, paddingBottom: 0, width: "100%", alignItems:"center", paddingLeft: "10%"}}>Select Matchup</Text>
        <Picker style={{ height: 40, width: 700, paddingBottom: 200 }}
          selectedValue={selectedTeam} onValueChange={(itemValue) => setSelectedTeam(itemValue)}>
          {teams.map((team, index) => (
            <Picker.Item key={index} label={team} value={team} />
          ))}
        </Picker>
        <Text style={{ fontSize: 50, color: 'blue', paddingBottom: 0 }}>vs</Text>
        <Picker style={{ height: 40, width: 700, paddingBottom: 200 }}
          selectedValue={selectedTeam2} onValueChange={(itemValue) => setSelectedTeam2(itemValue)}>
          {teams.map((team, index) => (
            <Picker.Item key={index} label={team} value={team} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.button} onPress={() => {
          if (selectedTeam != selectedTeam2) {
            stopTimerAndLog();
            router.push(`/win/Wins?team1=${selectedTeam}&team2=${selectedTeam2}`)
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

