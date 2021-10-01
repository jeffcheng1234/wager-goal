import React, { useState, useEffect, useReducer } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  FlatList,
} from "react-native";
import {
  Appbar,
  TextInput,
  Snackbar,
  Button,
  Avatar,
  Drawer,
} from "react-native-paper";
import { getFileObjectAsync } from "./../../../utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
// import { styles } from "../NewBetScreen.styles";

import { SliderBox } from "react-native-image-slider-box";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase/app";
import "firebase/firestore";
import { BetModel } from "../../../models/bet";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import { UserModel } from "../../../models/user";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewBetScreen">;
}

export default function BetDetailScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [bet, setBet] = useState<BetModel | null>(route.params.bet);
  const [user, setUser] = useState(null);
  const [evidence, setEvidence] = useState<string[]>(route.params.bet.evidence);
  const [inviteeStatuses, setInviteeStatuses] = useState<any[]>([]);
  // const currentUserId = "p0vS2XI7u2PXXCIAo87OQ126g1H3";
  const currentUserId = firebase.auth().currentUser!.uid;
  const [inviteeIndex, setInviteeIndex] = useState<number>(-1);
  const [permission, setPermission] = useState<String>("");
  const [visible, setVisible] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [betStatus, setBetStatus] = useState(route.params.bet.status);

  useEffect(() => {
    (async () => {
      console.log("bet: ", bet);
      const obj = firebase.firestore().collection("users").doc(currentUserId);
      obj.get().then((doc: any) => {
        // console.log(doc.data().friends);
        setUser(doc.data());
        console.log(doc.data());
      });

      let invitedUsers = bet?.invited_users;
      console.log("invitedUsers: ", invitedUsers);
      let temp = [];
      let invitedUser;
      let invUser;
      for (let i = 0; i < invitedUsers!.length; i++) {
        invitedUser = firebase
          .firestore()
          .collection("users")
          .doc(invitedUsers![i].id);
        invUser = (await invitedUser.get()).data();
        temp.push({ user: invUser, status: invitedUsers![i].status });
      }
      setInviteeStatuses(temp);
      console.log("inviteeStatuses: ", temp);
    })();
  }, []);
  // console.log("permission: ", permission, inviteeIndex);

  // Code for ImagePicker (from docs)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (bet) {
      const betRef = firebase.firestore().collection("Bets").doc(bet.id);
      betRef.set(bet);
    }
  }, [bet]);

  useEffect(() => {
    let invitedUsers = bet?.invited_users;

    if (currentUserId == bet?.creator) {
      setPermission("creator");
    } else {
      for (let j = 0; j < invitedUsers.length; j++) {
        if (invitedUsers[j].id == currentUserId) {
          setInviteeIndex(j);
          setPermission("invitee");
        }
      }
      if (inviteeIndex == -1) {
        setPermission("guest");
      }
    }
    console.log("permission: ", permission, inviteeIndex);

    if (bet?.date_end.toMillis()! < Date.now()) {
      setBetStatus("Bet Expired");
      setBet({ ...bet, status: "Bet Expired" } as BetModel);
    } else {
      let total = bet?.invited_users.length!;
      let approved = 0;
      let rejected = 0;
      for (let i = 0; i < total; i++) {
        if (bet?.invited_users[i].status === "approved") approved += 1;
        else if (bet?.invited_users[i].status === "rejected") rejected += 1;
      }
      console.log(total, approved, rejected);
      if (approved > 0.75 * total) {
        setBetStatus("Completed");
        setBet({ ...bet, status: "Completed" } as BetModel);
      } else if (rejected > 0.25 * total) {
        setBetStatus("Failed");
        setBet({ ...bet, status: "Failed" } as BetModel);
      } else {
        setBetStatus("In Progress");
        setBet({ ...bet, status: "In Progress" } as BetModel);
      }
    }
  }, [inviteeStatuses]);

  const addImageEvidence = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log("done");
    if (!result.cancelled) {
      const object: Blob = (await getFileObjectAsync(result.uri)) as Blob;
      const socialRef = firebase.firestore().collection("evidencePics").doc();
      const res = await firebase
        .storage()
        .ref()
        .child(socialRef.id + ".jpg")
        .put(object);
      const downloadURL = await res.ref.getDownloadURL();
      setEvidence([...evidence, downloadURL]);
      console.log("evidence: ", evidence);

      setBet({ ...bet, evidence: evidence } as BetModel);
      console.log("bet: ", bet);
    }
  };

  // Snackbar.
  const [message, setMessage] = useState("");

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="New Bets" />
      </Appbar.Header>
    );
  };

  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);

  const removePhotoEvidence = () => {
    console.log(evidence);
    setEvidence([
      ...evidence.slice(0, sliderIndex),
      ...evidence.slice(sliderIndex + 1),
    ]);
    console.log(evidence);
  };

  const renderInvitedStatus = ({ item }: { item: any }) => {
    let color;
    if (item.status == "approved") {
      color = "#98D429";
    } else if (item.status == "pending") {
      color = "#FDC129";
    } else {
      color = "#FF4842";
    }
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          width: "100%",
          marginLeft: "16%",
        }}
      >
        <Avatar.Image
          size={72}
          source={{ uri: item.user.profilePic }}
          style={{
            marginTop: 15,
            // marginLeft: 15,
            marginRight: 10,
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <Text
            style={{ textAlign: "left" }}
          >{`${item.user.firstName} ${item.user.lastName}`}</Text>
          <View
            style={{
              backgroundColor: color,
              width: "60%",
              height: 40,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                lineHeight: 40,
                textTransform: "capitalize",
                fontWeight: "600",
                fontSize: 20,
              }}
            >{`${item.status}`}</Text>
          </View>
        </View>
      </View>
    );
  };

  const approve = () => {
    let temp = inviteeStatuses.slice();
    temp[inviteeIndex].status = "approved";
    setInviteeStatuses(temp);
    let newStatuses = bet?.invited_users.slice()!;
    newStatuses[inviteeIndex].status = inviteeStatuses[inviteeIndex].status;
    setBet({ ...bet, invited_users: newStatuses } as BetModel);
  };

  const reject = () => {
    let temp = inviteeStatuses.slice();
    temp[inviteeIndex].status = "rejected";
    setInviteeStatuses(temp);
    let newStatuses = bet?.invited_users.slice()!;
    newStatuses[inviteeIndex].status = inviteeStatuses[inviteeIndex].status;
    setBet({ ...bet, invited_users: newStatuses } as BetModel);
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={{ fontSize: 32, padding: 32 }}>
        You have not invited any friends.
      </Text>
    );
  };

  if (user && bet && inviteeStatuses) {
    return (
      <>
        <Bar />

        <ScrollView style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 30,
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            {`Bet: ${bet?.bet_name}`}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              // width: 400,
              marginBottom: 20,
            }}
          >
            <Avatar.Image
              size={72}
              source={{ uri: user.profilePic }}
              style={{
                marginLeft: 10,
                marginRight: 10,
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "space-evenly",
                width: "90%",
                // backgroundColor: "red",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  alignContent: "center",
                  textAlign: "left",
                  // left: "27%",
                  width: "80%",
                  color: "#000000",
                }}
              >
                {bet?.bet_desc}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 3,
                  alignContent: "center",
                  fontWeight: "bold",
                  textAlign: "left",
                  color: "#000000",
                }}
              >
                Wager:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  alignContent: "center",
                  textAlign: "left",
                  left: "7%",
                  width: "60%",
                  color: "#000000",
                }}
              >
                {bet?.wager}
              </Text>
            </View>
          </View>
          {evidence && permission === "creator" && betStatus !== "Bet Expired" && (
            <Button
              mode="text"
              compact={true}
              style={{
                left: "0%",
                width: "30%",
                margin: 0,
                transform: [{ translateY: 5 }],
              }}
              onPress={() => removePhotoEvidence()}
              labelStyle={{ fontSize: 10, color: "#AD9661" }}
            >
              {"Remove"}
            </Button>
          )}
          <SliderBox
            images={evidence}
            sliderBoxHeight={170}
            currentImageEmitter={(index: any) => {
              console.log("index: ", index);
              setSliderIndex(index);
            }}
            dotColor="#FAB72B"
            inactiveDotColor="#C1A977"
            ImageComponentStyle={{
              borderRadius: 15,
              width: "80%",
              alignContent: "center",
              justifyContent: "center",
              left: -10,
            }}
            imageLoadingColor="#2196F3"
            circleLoop
          />
          {permission == "creator" && betStatus !== "Bet Expired" && (
            <Button
              mode="text"
              onPress={addImageEvidence}
              style={{ marginTop: 5 }}
            >
              {"Add Evidence"}
            </Button>
          )}
          <Text
            style={{
              fontSize: 14,
              alignContent: "center",
              justifyContent: "flex-start",
              textAlign: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            {`Bet Ends On ${bet?.date_end?.toDate()?.toLocaleString()}`}
          </Text>

          {permission === "invitee" && betStatus !== "Bet Expired" && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                mode={
                  inviteeStatuses[inviteeIndex].status === "approved"
                    ? "contained"
                    : "outlined"
                }
                onPress={approve}
                style={{ margin: 5 }}
                color="#98D429"
              >
                {inviteeStatuses[inviteeIndex].status === "approved"
                  ? "Approved"
                  : "Approve"}
              </Button>
              <Button
                mode={
                  inviteeStatuses[inviteeIndex].status === "rejected"
                    ? "contained"
                    : "outlined"
                }
                onPress={reject}
                style={{ margin: 5 }}
                color="#FF4842"
              >
                {inviteeStatuses[inviteeIndex].status === "rejected"
                  ? "Rejected"
                  : "Reject"}
              </Button>
            </View>
          )}
          <Text
            style={{
              backgroundColor:
                betStatus === "Completed"
                  ? "#98D429"
                  : betStatus === "In Progress"
                  ? "#FDC129"
                  : "#FF4842",
              marginTop: 15,
              marginBottom: 30,
              fontSize: 34,
              fontWeight: "bold",
              textAlign: "center",
              width: "70%",
              left: "15%",
            }}
          >
            {bet.status}
          </Text>
        </ScrollView>
        <Text
          style={{
            marginTop: 20,
            fontSize: 26,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Invited Users
        </Text>
        <FlatList
          data={inviteeStatuses}
          renderItem={renderInvitedStatus}
          keyExtractor={(_: any, index: number) => `${index}`}
          ListEmptyComponent={ListEmptyComponent}
          style={{ marginTop: "3%" }}
        />
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {message}
        </Snackbar>
      </>
    );
  } else {
    return (
      <View>
        <Text>hello</Text>
      </View>
    );
  }
}
