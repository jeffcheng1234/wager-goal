import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./../AuthStackScreen";
import firebase from "firebase";

import { AuthScreenStyles } from "./../AuthStackScreen.styles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const trySignIn = async () => {
    if (email === "") {
      showError("Please enter the email.")
    } else if (password === "") {
      showError("Please enter the password.")
    }
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      showError(error.message);
    }
  };

  const resetPassword = async () => {
    try {
      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          showError("Email sent.");
        });
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <>
      <SafeAreaView style={AuthScreenStyles.container}>
        <Appbar.Header style={AuthScreenStyles.header}>
          <Appbar.Content title="Sign In" style={AuthScreenStyles.title} />
        </Appbar.Header>
        <View style={AuthScreenStyles.wrapperView}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(email: any) => setEmail(email)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(password: any) => setPassword(password)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
            secureTextEntry={true}
          />
          <Button mode="contained" onPress={trySignIn} style={{ marginTop: 20 }}>
            Sign In
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("SignUpScreen")}
            style={{ marginTop: 20 }}
          >
            Create An Account
          </Button>
          <Button
            mode="text"
            onPress={resetPassword}
            style={{ marginTop: 20 }}
          >
            Reset Password
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
