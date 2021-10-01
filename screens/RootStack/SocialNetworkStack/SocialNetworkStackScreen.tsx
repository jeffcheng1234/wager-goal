import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BetDetailScreen from "../BetDetailScreen/BetDetailScreen.main";
import SocialNetworkScreen from "./SocialNetworkScreen/SocialNetworkScreen.main";

// This is a TypeScript Type that defines the parameters of this stack.
// Read More: https://reactnavigation.org/docs/typescript/
export type SocialNetworkStackParamList = {
  SocialNetworkScreen: undefined;
  BetDetailScreen: undefined;
};

const SocialNetworkStack = createStackNavigator<SocialNetworkStackParamList>();

export function SocialNetworkStackScreen() {
  const options = { headerShown: false };
  return (
    <SocialNetworkStack.Navigator>
      <SocialNetworkStack.Screen
        name="SocialNetworkScreen"
        options={options}
        component={SocialNetworkScreen}
      />
      <SocialNetworkStack.Screen
        name="BetDetailScreen"
        options={options}
        component={BetDetailScreen}
      />
    </SocialNetworkStack.Navigator>
  );
}
