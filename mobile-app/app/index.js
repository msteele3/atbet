import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';


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
    fontSize: 40,
    fontWeight: 'bold',
  },
});


const Home = () => {
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const startTimer = () => {
    startTimeRef.current = new Date(); // Record the start time
  };

  const stopTimerAndLog = () => {
    if (startTimeRef.current) {
      const endTime = new Date();
      const duration = endTime - startTimeRef.current; // Calculate the duration
      console.log(`Time on main page ${duration} milliseconds`);
      startTimeRef.current = null;
    }
  };
  
  const teams = ['Atlanta Braves', 'Philidelphia Phillies', 'Chicago Bears', 'Pittsburgh Pirates', 'Orlando Blazers']; // The idea would be to pull a team list of all teams for this
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
            fontSize: 32
          }

        }}
      />

      <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 60, color: 'blue', paddingTop: 60, paddingBottom: 0 }}>Select Matchup</Text>
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
          stopTimerAndLog();
          router.push(`/win/Wins?team1=${selectedTeam}&team2=${selectedTeam2}`)
          //router.push(`/win/AltWins`)
        }}>
          <Text style={styles.buttonText}>GO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  )
}


export default Home;

