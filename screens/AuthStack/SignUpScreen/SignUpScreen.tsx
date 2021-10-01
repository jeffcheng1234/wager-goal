import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Platform } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./../AuthStackScreen";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";

import { AuthScreenStyles } from "./../AuthStackScreen.styles";
import { UserModel } from "./../../../models/user";
import { getFileObjectAsync } from "./../../../utils";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

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

  // Code for ImagePicker (from docs)
  const pickImage = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log("done");
    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  };

  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const createAccount = async () => {
    if (firstName == "") {
      showError("Add a first name.");
      return;
    } else if (lastName === "") {
      showError("Add a last name.");
      return;
    } else if (email === "") {
      showError("Add an email.");
      return;
    } else if (password === "") {
      showError("Add a password.");
      return;
    } else if (profilePic === undefined) {
      showError("Add a profile picture.");
      return;
    }
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const object: Blob = (await getFileObjectAsync(profilePic)) as Blob;
    const socialRef = firebase.firestore().collection("profilePics").doc();
    const result = await firebase
        .storage()
        .ref()
        .child(socialRef.id + ".jpg")
        .put(object);
    const downloadURL = await result.ref.getDownloadURL();
    const userObject: UserModel = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePic: downloadURL,
      bets: [],
      friends: [],
    };
    return await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser?.uid)
      .set(userObject)
      .catch((error: any) => showError(error.message));
  };

  return (
    <>
      <SafeAreaView style={AuthScreenStyles.container}>
        <Appbar.Header style={AuthScreenStyles.header}>
          <Appbar.Content title="Sign Up" style={AuthScreenStyles.title} />
        </Appbar.Header>
        <View style={AuthScreenStyles.wrapperView}>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={(firstName: string) => setFirstName(firstName)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={(lastName: string) => setLastName(lastName)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={(email: string) => setEmail(email)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(password: string) => setPassword(password)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
            secureTextEntry={true}
          />
          <Button
            mode="text"
            onPress={pickImage}
            style={{ marginTop: 20 }}
          >
            {profilePic ? "Change Image" : "Pick an image"}
          </Button>
          <Button
            mode="contained"
            onPress={createAccount}
            style={{ marginTop: 20 }}
          >
            Create An Account
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("SignInScreen")}
            style={{ marginTop: 20 }}
          >
            Or, Sign In Instead
          </Button>
        </View>
        <Snackbar
            duration={3000}
            visible={visible}
            onDismiss={onDismissSnackBar}
            style={{ marginBottom: 50 }}
            action={{label: 'Dismiss', onPress: onDismissSnackBar
            }}
          >
            {message}
          </Snackbar>
      </SafeAreaView>
    </>
  );
}
