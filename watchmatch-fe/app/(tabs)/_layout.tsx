import { Tabs } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable, Modal, Button } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Movie Search",
        }}
      />
      <Tabs.Screen
        name="reccomendationScreen"
        options={{
          title: "Reccomendations",
        }}
      />
    </Tabs>
  );
}
