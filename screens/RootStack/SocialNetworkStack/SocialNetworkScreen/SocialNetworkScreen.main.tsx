import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Dimensions } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Avatar,
  Text,
  Paragraph,
  Title,
  Headline,
  Subheading,
  Caption,
} from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserModel } from "../../../../models/user";
import { BetModel } from "../../../../models/bet";
import SearchableDropdown from "react-native-searchable-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SocialNetworkScreenStyles } from "./SocialNetworkScreen.styles";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BetView } from "../../../../components/BetViewComponent/BetViewComponent.main";

export default function SocialNetworkScreen({ navigation }: any) {
  const [bets, setBets] = useState<BetModel[]>([]);
  const [userPics, setUserPics] = useState<
    Map<string, { pic: string; name: string }>
  >();

  const currentUserId = firebase.auth().currentUser!.uid;

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("users")
      .onSnapshot((querySnapshot: any) => {
        var dict: Map<string, { pic: string; name: string }> = new Map();
        querySnapshot.forEach((user: any) => {
          const newUser = user.data() as UserModel;
          newUser.id = user.id;
          if (newUser.id !== undefined) {
            dict.set(newUser.id, {
              pic: newUser.profilePic,
              name: newUser.firstName + " " + newUser.lastName,
            });
          }
        });
        setUserPics(dict);
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("Bets")
      .orderBy("date_end", "asc")
      .onSnapshot((querySnapshot: any) => {
        var newBets: BetModel[] = [];
        querySnapshot.forEach((bet: any) => {
          const newBet = bet.data() as BetModel;
          newBet.id = bet.id;
          newBets.push(newBet);
        });
        setBets(newBets);
      });
    return unsubscribe;
  }, []);

  //old way of doing things before using the dictionary
  const getUserImage = async (uid: string) => {
    const doc = await firebase.firestore().collection("users").doc(uid).get();
    console.log(doc?.data()?.profilePic);
    // const data: UserModel = doc.data();
    const profilePic: string = doc?.data()?.profilePic.profilePic;
    return profilePic;
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Social Network">
          <SearchableDropdown></SearchableDropdown>
        </Appbar.Content>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AccountScreen");
          }}
        >
          <Avatar.Image
            size={50}
            source={{ uri: userPics?.get(currentUserId)?.pic }}
          />
        </TouchableOpacity>
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={{ fontSize: 32, padding: 32 }}>
        Welcome! Add a new bet by pressing the plus button!
      </Text>
    );
  };

  //probably needs to be replaced
  const height = Dimensions.get("window").height - 2 * tabBarHeight;

  return (
    <>
      <Bar />
      <View style={{ height: height }}>
        <FlatList
          data={bets}
          renderItem={BetView({ navigation, userPics })}
          keyExtractor={(_: any, index: number) => "key-" + index}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
