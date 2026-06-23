import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.completed ? "check-box" : "check-box-outline-blank"}
          size={20}
          color={item.completed ? "#2E5BBA" : "#5A6472"}
        />
        <Text
          style={[styles.taskText, item.completed && styles.taskTextCompleted]}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: {
    fontSize: 15,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6b6b6b",
  },
});
