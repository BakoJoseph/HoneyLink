import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import styles from "@/style";
import { router } from "expo-router";

type Props = {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
};


const Navigation: React.FC<Props> = ({ activeTab, onTabPress }) => {

  return (
    <View style={styles.navigationContainer}>
      {/* Home */}
      <TouchableOpacity onPress={() => {onTabPress?.("home"); router.push("/(tabs)")}}>
        <Octicons
          name="home"
          size={24}
          color={activeTab === "home" ? "#ff4d6d" : "#999"}
        />
      </TouchableOpacity>

      {/* Favorites */}
      <TouchableOpacity onPress={() => {onTabPress?.("favorites")}}>
        <Octicons
          name="heart"
          size={24}
          color={activeTab === "favorites" ? "#ff4d6d" : "#999"}
        />
      </TouchableOpacity>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => onTabPress?.("add")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Messages */}
      <TouchableOpacity onPress={() => onTabPress?.("chatlist")}>
        <Ionicons 
          name="chatbubbles-outline"
          size={28}
          color={activeTab === "chatlist" ? "#ff4d6d" : "#999"}
        />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => {onTabPress?.("profile"); router.push("/(tabs)/ProfileUI")}}>
        <Octicons
          name="person"
          size={24}
          color={activeTab === "profile" ? "#ff4d6d" : "#999"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Navigation;
