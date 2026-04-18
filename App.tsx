import Navigation from "@/navigation";
import { colors } from "@/theme";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDb, cleanOldProgress } from "@/services/progressDb";


export default function App() {

  useEffect(() =>  {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent', false);
    StatusBar.setBarStyle('light-content');
    NavigationBar.setButtonStyleAsync('light');
  }, [])

  useEffect(() => {
    initDb();
    cleanOldProgress();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <Navigation />
    </GestureHandlerRootView>
  );
}