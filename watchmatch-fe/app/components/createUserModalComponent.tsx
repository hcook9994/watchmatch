import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TextInput,
} from "react-native";
import { createUser } from "../api";
import { useState } from "react";

type Props = {
  createUserInProgress: boolean;
  exitUserCreationsScreen: () => void;
};

const CreateUserModal = (props: Props) => {
  const { createUserInProgress, exitUserCreationsScreen } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validatePassword, setValidatePassword] = useState("");
  const [email, setEmail] = useState("");

  const createUserHandler = async () => {
    if (password !== validatePassword) {
      console.error("Passwords do not match");
      return;
    }
    if (username.length === 0 || password.length === 0 || email.length === 0) {
      console.error("All fields are required");
      return;
    }
    try {
      const response = await createUser(username, password, email);
      console.log("User creation response:", response);
      exitUserCreationsScreen();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Modal visible={createUserInProgress} transparent={false}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Create User</Text>
        <View style={styles.textInputView}>
          <Text style={styles.text}>Username: </Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          ></TextInput>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.text}>Email: </Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.text}>Password: </Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
          ></TextInput>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.text}>Validate Password: </Text>
          <TextInput
            style={styles.textInput}
            value={validatePassword}
            onChangeText={setValidatePassword}
          ></TextInput>
        </View>
        <TouchableHighlight
          onPress={async () => await createUserHandler()}
          style={{ ...styles.button, marginTop: 20 }}
        >
          {/* Async considerations */}
          <Text>Create User</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={exitUserCreationsScreen}
          style={styles.button}
        >
          <Text>Cancel</Text>
        </TouchableHighlight>
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
  text: {
    width: 120,
  },
  textInput: {
    borderRadius: 20,
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  textInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { CreateUserModal };
