import { useState } from "react";
import {
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

type Props = {
  login: boolean;
  exitLoginScreen: () => void;
  setLoggedIn: (loggedIn: boolean) => void;
};

type LoginStatus = "true" | "false" | "error";

// Dummy authentication function
function loginAuthentication(
  username: string,
  password: string,
  setLoginStatus: (status: LoginStatus) => void,
  exitLoginScreen: () => void,
  setLoggedIn: (loggedIn: boolean) => void
) {
  // Placeholder for actual authentication logic
  setLoginStatus(username === "user" && password === "pass" ? "true" : "error");
  if (username === "user" && password === "pass") {
    // After 1 second, run your function
    setTimeout(() => {
      exitLoginScreen();
      setLoggedIn(true);
    }, 1000);
  }
  return;
}

const LoginModal = (props: Props) => {
  const { login, exitLoginScreen, setLoggedIn } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("false");

  return (
    <Modal visible={login} transparent={false}>
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
          onPress={() => {
            loginAuthentication(
              username,
              password,
              setLoginStatus,
              exitLoginScreen,
              setLoggedIn
            );
          }}
          style={styles.button}
        >
          <Text>Submit</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={exitLoginScreen} style={styles.button}>
          <Text>Cancel</Text>
        </TouchableHighlight>
        {loginStatus === "true" && (
          <Text style={{ color: "green", marginBottom: 10, marginTop: 10 }}>
            Successfully logged in!
          </Text>
        )}
      </View>
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
