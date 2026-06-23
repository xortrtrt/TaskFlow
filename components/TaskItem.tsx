import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: string) => void;
};

const TaskItem: React.FC<Props> = ({ item, onToggle, onDelete }) => {
  const renderRightActions = () => (
    <RectButton style={styles.deleteAction} onPress={() => onDelete(item.id)}>
      <MaterialIcons name="delete" size={20} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <RectButton onPress={() => onToggle(item)}>
        <View style={styles.taskRow}>
          <MaterialIcons
            name={item.completed ? "check-box" : "check-box-outline-blank"}
            size={20}
            color={item.completed ? "#2E5BBA" : "#5A6472"}
          />
          <Text
            style={[
              styles.taskText,
              item.completed && styles.taskTextCompleted,
            ]}
          >
            {item.title}
          </Text>
        </View>
      </RectButton>
    </Swipeable>
  );
};

export default TaskItem;

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
  deleteAction: {
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    width: 96,
  },
  deleteText: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "600",
  },
});
