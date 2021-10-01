import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BetDetailScreen from "../BetDetailScreen/BetDetailScreen.main";
import AccountScreen from "./AccountScreen/AccountScreen.main";

// This is a TypeScript Type that defines the parameters of this stack.
// Read More: https://reactnavigation.org/docs/typescript/
export type AccountStackParamList = {
  AccountScreen: undefined;
  BetDetailScreen: undefined;
};

const AccountStack = createStackNavigator<AccountStackParamList>();

export function AccountStackScreen() {
  const options = { headerShown: false };
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AccountScreen"
        options={options}
        component={AccountScreen}
      />
      <AccountStack.Screen
        name="BetDetailScreen"
        options={options}
        component={BetDetailScreen}
      />
    </AccountStack.Navigator>
  );
}
