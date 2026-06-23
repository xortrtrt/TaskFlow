import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AddTaskModal from "../../components/AddTaskModal"; // Import the new modal
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // Controls the modal

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.log("Error loading tasks:", error.message);
    setTasks(data || []);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Updated to receive text from the modal and show a toast
  async function handleSubmitTask(title: string) {
    const { error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false }]);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not add task",
        text2: error.message,
      });
      return;
    }

    setModalVisible(false); // Hide the modal on success
    loadTasks();
    Toast.show({ type: "success", text1: "Task added" });
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) return console.log("Error updating task:", error.message);
    loadTasks();
  }

  // Updated to show a toast on deletion
  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      Toast.show({ type: "error", text1: "Could not delete task" });
      return;
    }

    loadTasks();
    Toast.show({ type: "success", text1: "Task deleted" });
  }

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      {/* Floating Add FAB (bottom-right) */}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item)}
            onLongPress={() => deleteTask(item.id)}
          >
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
          </TouchableOpacity>
        )}
      />
      {/* Floating FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Render the modal component, hidden by default */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
}

// --- STYLES ---

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  openModalButton: {
    flexDirection: "row",
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  openModalText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E5BBA",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: {
    fontSize: 15,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6b6b6b",
  },
});
