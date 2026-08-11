import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  SafeAreaView, 
  useWindowDimensions 
} from 'react-native';

// A custom component for each individual digit or colon
const Digit = ({ char, fontSize, showColon }: { char: string; fontSize: number; showColon: boolean }) => {
  const isColon = char === ':';
  
  return (
    <View style={[styles.digitContainer, isColon && styles.colonContainer]}>
      {/* Background: The "unlit" 7 segments (shows as a dim '8' or dim colon) */}
      <Text style={[styles.unlitText, { fontSize }]}>
        {isColon ? ':' : '8'}
      </Text>
      
      {/* Foreground: The active, glowing digit or blinking colon */}
      <Text 
        style={[
          styles.litText, 
          { fontSize },
          isColon && !showColon && { opacity: 0 } // Hide glowing colon when showColon is false
        ]}
      >
        {char}
      </Text>
    </View>
  );
};

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { width } = useWindowDimensions(); // Dynamically track screen width
  const [showColon, setShowColon] = useState(true);

  // Dynamically size the font based on whether the phone is rotated
  const isLandscape = width > 500;
  const dynamicFontSize = isLandscape ? 400 : 130; 

  useEffect(() => {
    // Update the time every 1000ms (1 second)
    const timeTimer = setInterval(() => setCurrentDate(new Date()), 1000);
    
    // Toggle the colon visibility every 500ms (half a second)
    const blinkTimer = setInterval(() => setShowColon(prev => !prev), 500);

    return () => {
      clearInterval(timeTimer);
      clearInterval(blinkTimer);
    };
  }, []);

  // Return the time as an array of characters: e.g., ['1', '0', ':', '4', '8']
  const getTimeArray = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    if (hours > 12) {
      hours = hours - 12;
    } else if (hours === 0) {
      hours = 12; // Handle midnight in 12-hour format
    }

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
    return `${formattedHours}:${formattedMinutes}`.split('');
  };

  const formatDay = (date: Date) => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  };

  const formatDateString = (date: Date) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${month} ${formattedDay}, ${year}`;
  };

  const timeArray = getTimeArray(currentDate);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Render the row of individual digits */}
      <View style={styles.clockRow}>
        {timeArray.map((char, index) => (
          <Digit key={index} char={char} fontSize={dynamicFontSize} showColon={showColon} />
        ))}
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{formatDay(currentDate)}</Text>
        <Text style={styles.dateText}>{formatDateString(currentDate)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockRow: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitContainer: {
    width: '20%', 
    justifyContent: 'center',
  },
  colonContainer: {
    width: '10%', 
    alignItems: 'center',
  },
  unlitText: {
    position: 'absolute', 
    fontFamily: 'digital-7',
    color: '#2A1F00', 
    width: '100%',       
    textAlign: 'right',  
  },
  litText: {
    fontFamily: 'digital-7',
    color: '#FFE270',
    textShadowColor: '#FF9900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    width: '100%',       
    textAlign: 'right',  
  },
  dateContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    alignItems: 'flex-end',
  },
  dayText: {
    color: '#E0E0E0',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '600',
  },
  dateText: {
    color: '#E0E0E0',
    fontSize: 20,
    letterSpacing: 1,
    fontWeight: '600',
  },
});