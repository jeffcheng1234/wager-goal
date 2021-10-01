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
import { UserModel } from "../../../../models/user";
import { BetModel } from "../../../../models/bet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AccountScreenStyles } from "./AccountScreen.styles";
import { BetView } from "../../../../components/BetViewComponent/BetViewComponent.main";

export default function AccountScreen({ navigation }: any) {
  const [bets, setBets] = useState<BetModel[]>([]);
  const [userPics, setUserPics] = useState<
    Map<string, { pic: string; name: string }>
  >();

  const currentUserId = firebase.auth().currentUser!.uid;

  const [currentUserInfo, setCurrentUserInfo] = useState<
    UserModel | undefined
  >();

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

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserId)
      .get()
      .then((doc) => {
        const currentUser = doc.data() as UserModel;
        setCurrentUserInfo(currentUser);
      });
  }, []);

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Account" />
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

  const title: string = "Account Details";

  return (
    <>
      <Bar />
      <View style={{ flex: 1 }}>
        <Card style={{ margin: 8 }}>
          <Card.Title title={title} titleStyle={{ alignSelf: "center" }} />
          <Card.Content>
            <Avatar.Image
              size={75}
              source={{ uri: userPics?.get(currentUserId)?.pic }}
              style={{ alignSelf: "center" }}
            />
            <Paragraph style={{ fontSize: 18, alignSelf: "center" }}>
              Name:{" "}
              {currentUserInfo?.firstName + " " + currentUserInfo?.lastName}
            </Paragraph>
            <Paragraph style={{ fontSize: 18, alignSelf: "center" }}>
              Email: {currentUserInfo?.email}
            </Paragraph>
          </Card.Content>
        </Card>
        <Headline style={{ alignSelf: "center" }}>Your Bets</Headline>
        <FlatList
          data={bets.filter((bet) => bet.creator === currentUserId)}
          renderItem={BetView({ navigation, userPics })}
          keyExtractor={(_: any, index: number) => "key-" + index}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
