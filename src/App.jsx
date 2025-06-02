import { useState, useEffect } from "react";

function App() {
  // 1. State: tasks = array of { id, text, done, isEditing }
  const [tasks, setTasks] = useState([]);

  // 2. State: newTaskText for the “Add” input field
  const [newTaskText, setNewTaskText] = useState("");

  // 3. On page load, read tasks from localStorage (if any)
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // 4. Whenever tasks change, write them to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 5. Handler: Add a new task
  function handleAddTask() {
    const trimmed = newTaskText.trim();
    if (trimmed === "") return;
    const newTask = {
      id: Date.now(),
      text: trimmed,
      done: false,
      isEditing: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText(""); // clear input
  }

  // 6. Handler: Toggle “done” checkbox
  function toggleDone(id) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // 7. Handler: Delete a task
  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  // 8. Handler: Start editing a task
  function startEditing(id) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, isEditing: true } : t)));
  }

  // 9. Handler: Save edited text
  function saveEdit(id, newText) {
    const trimmed = newText.trim();
    if (trimmed === "") return; // do not allow empty
    setTasks(
      tasks.map(t =>
        t.id === id
          ? { ...t, text: trimmed, isEditing: false }
          : t
      )
    );
  }

  // 10. Handler: Cancel editing
  function cancelEdit(id) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, isEditing: false } : t)));
  }

  return (
    <div style={{ maxWidth: 400, margin: "1rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>To-Do List</h1>

      {/* INPUT + ADD BUTTON */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleAddTask();
          }}
          style={{ flexGrow: 1, padding: "0.5rem" }}
        />
        <button
          onClick={handleAddTask}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Add
        </button>
      </div>

      {/* TASK LIST */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
              background: "#f9f9f9",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          >
            {/* Checkbox to toggle done */}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task.id)}
              style={{ marginRight: "0.5rem" }}
            />

            {/* If editing, show an input; otherwise show text */}
            {task.isEditing ? (
              <EditingRow
                task={task}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
              />
            ) : (
              <>
                <span
                  style={{
                    flexGrow: 1,
                    textDecoration: task.done ? "line-through" : "none",
                  }}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => startEditing(task.id)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
        {tasks.length === 0 && <li>No tasks yet.</li>}
      </ul>
    </div>
  );
}

// A small component for the “editing” row
function EditingRow({ task, saveEdit, cancelEdit }) {
  const [tempText, setTempText] = useState(task.text);

  return (
    <>
      <input
        type="text"
        value={tempText}
        onChange={e => setTempText(e.target.value)}
        style={{ flexGrow: 1, marginRight: "0.5rem", padding: "0.3rem" }}
      />
      <button
        onClick={() => saveEdit(task.id, tempText)}
        style={{ marginRight: "0.5rem" }}
      >
        Save
      </button>
      <button onClick={() => cancelEdit(task.id)}>Cancel</button>
    </>
  );
}

export default App;
