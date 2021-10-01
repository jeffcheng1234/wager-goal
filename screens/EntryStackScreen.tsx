import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import firebase from "firebase";

import { RootStackScreen } from "./RootStack/RootStackScreen";
import { AuthStackScreen } from "./AuthStack/AuthStackScreen";

export function EntryStackScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((currentUser: any) => {
        setUser(currentUser);
        if (initializing) setInitializing(false);
      });
    return unsubscribe;
  }, [setUser]);

  if (initializing) {
    return <View />;
  } else if (!user) {
    return (
      <NavigationContainer>
        <AuthStackScreen />
      </NavigationContainer>
    );
  } else {
    return <RootStackScreen />;
  }
}
