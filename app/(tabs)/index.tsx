import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase"; // Adjusted path for your folder structure

// 1. Define the shape of a Task for TypeScript
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [task, setTask] = useState("");

  // 2. Explicitly type the state array as an array of Task objects
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- CRUD OPERATIONS ---

  // Read: Fetch tasks on startup
  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading tasks:", error.message);
      return;
    }

    // Fallback to empty array if data is null to prevent mapping errors
    setTasks(data || []);
  }

  // Load exactly once when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Create: Add a new task
  async function addTask() {
    if (task.trim() === "") return;

    const { error } = await supabase
      .from("tasks")
      .insert([{ title: task, completed: false }]);

    if (error) {
      console.log("Error adding task:", error.message);
      return;
    }

    setTask(""); // Clear input
    loadTasks(); // Refresh list
  }

  // Update: Flip the completed status (Note the 'item' parameter type)
  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      console.log("Error updating task:", error.message);
      return;
    }

    loadTasks();
  }

  // Delete: Remove a task entirely (Note the 'id' parameter type)
  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log("Error deleting task:", error.message);
      return;
    }

    loadTasks();
  }

  // --- UI RENDERING ---
  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {tasks.map((item) => (
        <TouchableOpacity
          key={item.id}
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
      ))}
    </View>
  );
}

// --- STYLES ---

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
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
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
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
  },

  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6b6b6b",
  },
});
