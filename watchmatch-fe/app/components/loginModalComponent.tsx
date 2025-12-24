import { useState } from "react";
import {
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { login } from "../api";
import { CreateUserModal } from "./createUserModalComponent";

type Props = {
  loginScreen: boolean;
  exitLoginScreen: () => void;
  setLoggedIn: (loggedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  setUserId: (userId: string) => void;
};

const LoginModal = (props: Props) => {
  const {
    loginScreen,
    exitLoginScreen,
    setLoggedIn,
    username,
    setUsername,
    setUserId,
  } = props;

  const [password, setPassword] = useState("");

  // Set variables to track login status
  const [createUserInProgress, setCreateUserInProgress] = useState(false);
  const [loginStatus, setLoginStatus] = useState("false");

  async function loginAuthentication() {
    const response = await login(username, password);
    if (response.status === 200) {
      setLoginStatus("true");
      // TODO: remove time delay
      setTimeout(() => {
        exitLoginScreen();
        setLoggedIn(true);
        setUserId(response.data.userId);
      }, 1000);
    } else {
      setLoginStatus("error");
    }
    return;
  }

  return (
    <Modal visible={loginScreen} transparent={false}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            margin: 50,
          }}
        >
          Login To Your Account!
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Username: </Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          ></TextInput>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Password: </Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
          ></TextInput>
        </View>
        {loginStatus === "error" && (
          <Text style={{ color: "red", marginBottom: 10, marginTop: 10 }}>
            Incorrect username or password.
          </Text>
        )}
        <TouchableHighlight
          onPress={async () => {
            await loginAuthentication();
          }}
          style={styles.button}
        >
          <Text>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={exitLoginScreen} style={styles.button}>
          <Text>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => setCreateUserInProgress(true)}
          style={styles.button}
        >
          <Text>Create New User</Text>
        </TouchableHighlight>
        {loginStatus === "true" && (
          <Text style={{ color: "green", marginBottom: 10, marginTop: 10 }}>
            Successfully logged in!
          </Text>
        )}
      </View>
      <CreateUserModal
        createUserInProgress={createUserInProgress}
        exitUserCreationsScreen={() => setCreateUserInProgress(false)}
      />
    </Modal>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: "lightgreen",
    marginTop: 10,
    width: "15%",
    alignItems: "center",
  },
  textInput: {
    borderRadius: 20,
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
  },
});

export { LoginModal };
