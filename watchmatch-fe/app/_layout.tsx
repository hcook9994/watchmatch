import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import { LoginModal } from "./components/loginModalComponent";

export default function RootLayout() {
  // State to manage the login modal visibility
  const [login, setLogin] = useState(false);
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerRight: () => (
            <View>
              <TouchableHighlight
                onPress={() => setLogin(true)}
                style={{
                  marginRight: 15,
                  backgroundColor: "lightgreen",
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
                  Login
                </Text>
              </TouchableHighlight>
              <LoginModal login={login} onPress={() => setLogin(false)} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
