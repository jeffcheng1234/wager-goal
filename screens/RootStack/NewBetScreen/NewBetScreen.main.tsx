import React, { useState, useEffect } from "react";
import { Platform, SafeAreaView, Text, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
import SearchableDropdown from "react-native-searchable-dropdown";
// import { styles } from "../NewBetScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { BetModel } from "../../../models/bet";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewBetScreen">;
}

export default function NewBetScreen() {
  const currentUserId = firebase.auth().currentUser!.uid;
  const [bet_name, setBetName] = useState("");
  const [bet_desc, setBetDesc] = useState("");
  const [bet_type, setBetType] = useState("");
  const creator = currentUserId;
  const [friends, setFriends] = useState([]);
  const [friendsMap, setFriendsMap] = useState<any>([]);
  const [date_start, setDateStart] = useState("");
  const [date_end, setDateEnd] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [invited_users, setInvitedUsers] = useState<any[]>([]);
  const [status, setStatus] = useState("Pending");
  const [wager, setWager] = useState("");
  const [wager_quan, setWagerQuan] = useState("");

  useEffect(() => {
    const obj = firebase.firestore().collection("users").doc(currentUserId);
    obj.get().then((doc: any) => {
      // console.log(doc.data().friends);
      setFriends(doc.data().friends);
    });
  }, []);
  // console.log(friends);
  // Date picker.
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [visible, setVisible] = useState(false);
  // Snackbar.
  const [message, setMessage] = useState("");
  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="New Bets" />
      </Appbar.Header>
    );
  };
  // Code for DatePicker (from docs)
  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  // Code for DatePicker (from docs)
  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };
  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  // Code for DatePicker (from docs)
  const handleConfirmStart = (date: Date) => {
    date.setSeconds(0);
    setDateStart(date);
    hideDatePicker1();
  };

  // Code for DatePicker (from docs)
  const handleConfirmEnd = (date: Date) => {
    date.setSeconds(0);
    setDateEnd(date);
    hideDatePicker2();
  };

  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const saveEvent = async () => {
    // if (!eventName) {
    //   showError("Please enter an event name.");
    //   return;
    // } else if (!eventDate) {
    //   showError("Please choose an event date.");
    //   return;
    // } else if (!eventLocation) {
    //   showError("Please enter an event location.");
    //   return;
    // } else if (!eventDescription) {
    //   showError("Please enter an event description.");
    //   return;
    // } else if (!eventImage) {
    //   showError("Please choose an event image.");
    //   return;
    // } else {
    //   setLoading(true);
    // }

    try {
      // Firestore wants a File Object, so we first convert the file path
      // saved in eventImage to a file object.
      console.log("getting file object");
      //   const object: Blob = (await getFileObjectAsync(eventImage)) as Blob;
      // Generate a brand new doc ID by calling .doc() on the socials node.
      const betRef = firebase.firestore().collection("Bets").doc();
      //   console.log("putting file object");
      //   const result = await firebase
      //     .storage()
      //     .ref()
      //     .child(betRef.id + ".jpg")
      //     .put(object);
      //   console.log("getting download url");
      //   const downloadURL = await result.ref.getDownloadURL();
      // TODO: You may want to update this SocialModel's default
      // fields by adding one or two attributes to help you with
      // interested/likes & deletes
      const doc: BetModel = {
        bet_name: bet_name,
        bet_desc: bet_desc,
        bet_type: bet_type,
        creator: creator,
        date_start: date_start,
        date_end: date_end,
        evidence: evidence,
        invited_users: invited_users,
        status: status,
        wager: wager,
        wager_quan: wager_quan,
      };
      console.log("setting download url");
      await betRef.set(doc);
      setLoading(false);
      // navigation.goBack();
    } catch (error) {
      setLoading(false);
      showError(error.toString());
    }
  };

  var sampleitems = [
    {
      id: 1,
      name: "JavaScript",
    },
    {
      id: 2,
      name: "Java",
    },
    {
      id: 3,
      name: "Ruby",
    },
    {
      id: 4,
      name: "React Native",
    },
    {
      id: 5,
      name: "PHP",
    },
    {
      id: 6,
      name: "Python",
    },
    {
      id: 7,
      name: "Go",
    },
    {
      id: 8,
      name: "Swift",
    },
  ];

  const getDict = async () => {
    const fMap = [];
    for (var i = 0; i < friends.length; i++) {
      console.log(i);
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(friends[i])
        .get();
      const friend = doc.data();
      const frdname = friend?.firstName + " " + friend?.lastName;
      const obj = { id: i, name: frdname };
      console.log(obj);
      fMap.push(obj);
    }
    setFriendsMap(fMap);
    console.log("fmap: ", fMap);
  };
  useEffect(() => {
    getDict();
  }, []);

  // console.log("this is friend" + friends + "yay");
  // console.log(friendsMap);

  // for (var i = 0; i < friends.length; i++) {
  //   const fMap = friendsMap;
  //   var fDict =
  //   fMap.push(user);
  //   setInvitedUsers(users);

  // }

  return (
    <>
      <Bar />
      <ScrollView
        style={{ padding: 20, paddingBottom: 500 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text> What's your bet name?</Text>
        <TextInput
          label="e.g. Fixing my bad sleeping schedule!"
          value={bet_name}
          onChangeText={(bet_name: any) => setBetName(bet_name)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <Text> Add your goal description </Text>
        <TextInput
          label="e.g. I will sleep before midnight everyday this week ... "
          value={bet_desc}
          onChangeText={(bet_desc: any) => setBetDesc(bet_desc)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <Text> Add friends to the bet </Text>
        <SearchableDropdown
          multi={true}
          selectedItems={invited_users}
          onItemSelect={(user: String) => {
            const users = invited_users.slice();
            users.push({ id: user, status: "pending" });
            setInvitedUsers(users);
          }}
          containerStyle={{ padding: 5 }}
          onRemoveItem={(user, index) => {
            const users = invited_users.filter(
              (suser) => suser.uid !== user.uid
            );
            setInvitedUsers(users);
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "#ddd",
            borderColor: "#bbb",
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{ color: "#222" }}
          itemsContainerStyle={{ maxHeight: 140 }}
          items={friendsMap}
          // defaultIndex={2}
          chip={true}
          resetValue={true}
          textInputProps={{
            placeholder: "search for friends",
            underlineColorAndroid: "transparent",
            style: {
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
            },
            // onTextChange: (text) => alert(text),
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
        <Text> What's your wager? </Text>
        <TextInput
          label="e.g. Treating my friends a dinner at ..."
          value={wager}
          onChangeText={(wager: any) => setWager(wager)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <Text> How much is your wager? </Text>
        <TextInput
          label="e.g. Max 50 Dollars"
          value={wager_quan}
          onChangeText={(wager_quan: any) => setWagerQuan(wager_quan)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <Button
          mode="outlined"
          onPress={showDatePicker1}
          style={{ marginTop: 20 }}
        >
          {date_start ? date_start.toLocaleString() : "Choose Start Date"}
        </Button>

        <Button
          mode="outlined"
          onPress={showDatePicker2}
          style={{ marginTop: 20 }}
        >
          {date_end ? date_end.toLocaleString() : "Choose End Date"}
        </Button>

        <Button
          mode="contained"
          onPress={saveEvent}
          style={{ marginTop: 20 }}
          loading={loading}
        >
          Save Event
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible1}
          mode="datetime"
          onConfirm={handleConfirmStart}
          onCancel={hideDatePicker1}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible2}
          mode="datetime"
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePicker2}
        />
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {message}
        </Snackbar>
      </ScrollView>
    </>
  );
}
