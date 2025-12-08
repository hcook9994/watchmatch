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
  onPress: () => void;
};

const LoginModal = (props: Props) => {
  const { login, onPress } = props;

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
          <TextInput style={styles.textInput}></TextInput>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Password: </Text>
          <TextInput style={styles.textInput}></TextInput>
        </View>
        <TouchableHighlight onPress={() => () => {}} style={styles.button}>
          <Text>Submit</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onPress} style={styles.button}>
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
