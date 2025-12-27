import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import { LoginModal } from "./components/loginModalComponent";
import { AuthProvider } from "./contexts/authContext";

export default function RootLayout() {
  // State to manage the login modal visibility
  const [loginScreen, setLoginScreen] = useState(false);

  // TODO: consider making this a global variable
  const [loggedIn, setLoggedIn] = useState(false);

  const [username, setUsername] = useState("");

  return (
    <AuthProvider>
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
                />
              </View>
            ),
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
