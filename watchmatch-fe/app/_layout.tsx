import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import { LoginModal } from "./components/loginModalComponent";

export default function RootLayout() {
  // State to manage the login modal visibility
  const [loginScreen, setLoginScreen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerRight: () => (
            <View>
              <TouchableHighlight
                onPress={() => {
                  setLoginScreen(true);
                }}
                disabled={loggedIn}
                style={{
                  marginRight: 15,
                  backgroundColor: loggedIn ? "grey" : "lightgreen",
                  borderRadius: 20,
                  padding: 10,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {loggedIn ? "Logged in" : "Login"}
                </Text>
              </TouchableHighlight>
              <LoginModal
                loginScreen={loginScreen}
                exitLoginScreen={() => setLoginScreen(false)}
                setLoggedIn={setLoggedIn}
                username={username}
                setUsername={setUsername}
                setUserId={setUserId}
              />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
