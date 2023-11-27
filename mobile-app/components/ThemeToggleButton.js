// ThemeToggleButton.js
import React, { useContext } from 'react';
import { Button } from 'react-native';
import { ThemeContext } from '../app/ThemeContext'; // adjust the path as necessary

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <Button 
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      onPress={toggleTheme}
    />
  );
};

export default ThemeToggleButton;
