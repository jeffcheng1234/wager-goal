// import React, { useState, useEffect } from "react";
// import { Platform, View, Text } from "react-native";
// import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
// import firebase from "firebase/app";
// import "firebase/firestore";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import * as SearchableDropdown from "react-native-searchable-dropdown";

// // use bottom tab navigator here

// export default function RootStackScreen() {
//   const currentUserId = firebase.auth().currentUser!.uid;
//   //   const [bet_name, setBetName] = useState("");

//   const Bar = () => {
//     return (
//       <Appbar.Header>
//         <Appbar.Action
//           icon="exit-to-app"
//           onPress={() => firebase.auth().signOut()}
//         />
//         <Appbar.Content title="New Bets" />
//       </Appbar.Header>
//     );
//   };

//   return (
//     <>
//       <Bar />
//       <View style={{ padding: 20 }}>
//         <Text> Hello! </Text>
//         <Text> {currentUserId}</Text>
//       </View>
//     </>
//   );
// }

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
// import { MainStackScreen } from "./MainStack/MainStackScreen";
import NewBetScreen from "./NewBetScreen/NewBetScreen.main";
import { NavigationContainer } from "@react-navigation/native";
import BetDetailScreen from "./BetDetailScreen/BetDetailScreen.main";
import SocialNetworkScreen from "./SocialNetworkStack/SocialNetworkScreen/SocialNetworkScreen.main";
import AccountScreen from "./AccountStack/AccountScreen/AccountScreen.main";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AccountStackScreen } from "./AccountStack/AccountStackScreen";
import { SocialNetworkStackScreen } from "./SocialNetworkStack/SocialNetworkStackScreen";
const BottomTab = createBottomTabNavigator<RootStackParamList>();

export type RootStackParamList = {
  "New Bet": undefined;
  "Social Feed": undefined;
  "Account": undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
  }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        initialRouteName="New Bet"
        tabBarOptions={{ activeTintColor: "#c36902" }}
      >
        {/* <BottomTab.Screen
          name="BetDetailScreen"
          component={BetDetailScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="newspaper-outline" color={color} />
            ),
          }}
        /> */}
        <BottomTab.Screen
          name="Social Feed"
          component={SocialNetworkStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="home-outline" color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="New Bet"
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="add" color={color} />,
          }}
          component={NewBetScreen}
        />
        <BottomTab.Screen
          name="Account"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="person-circle-outline" color={color} />
            ),
          }}
          component={AccountStackScreen}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
