import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "firebase";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { EntryStackScreen } from "./screens/EntryStackScreen";

const firebaseConfig = require("./keys.json");

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#c36902",
      accent: "#ff2746",
    },
  };

const App = () => {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <EntryStackScreen />
            </PaperProvider>
        </SafeAreaProvider>
    );
}

export default App;