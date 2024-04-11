import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "./src/components/Header";
import Timer from "./src/components/Timer";
import { Audio } from "expo-av";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

export default function App() {
  const [isWorking, setIsWorking] = useState(false); // establecido en false para activar la cuenta con un boton
  const [time, setTime] = useState(25 * 60); // 25min * 60Seg
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORTB" | "BREAK"); // Estados con los que cuenta la app (25min | 5min | 15min).. toma el valor "POMO" por default
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      // run timer
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      //Clear interval
      clearInterval(interval);
    }

    if(time === 0){
      setIsActive(false);
      setIsWorking((prev) => !prev);
      setTime(isWorking ? 300 : 1500)
    }

    return () => clearInterval(interval);

  }, [isActive, time]);

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/sounds/click.wav")
    );

    await sound.playAsync();
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[currentTime] }]}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: Platform.OS === "android" && 21,
          paddingLeft: 9,
        }}
      >
        <Text style={styles.text}>Pomodoro</Text>
        <Header
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setTime={setTime}
        />
        <Timer time={time} />
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isActive ? "STOP" : "START"}
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: { fontSize: 32, fontWeight: "bold" },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
});
