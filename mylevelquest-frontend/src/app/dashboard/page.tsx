"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "../components/TaskCard";
import UserHeader from "../components/UserHeader";
import { fetchWithAuth } from "../utils/fetchWithAuth";

type TaskType = "side" | "daily" | "weekly" | "monthly" | "yearly";

type Task = {
  id: number;
  title: string;
  description: string;
  type: TaskType;
  isCompleted: boolean;
};

type GroupedTasks = Record<TaskType, Task[]>;

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();
  const [isToken, setIsToken] = useState(false);
  const [grouped, setGrouped] = useState<GroupedTasks>({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    side: [],
  });
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "side" as TaskType,
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    if (!token) {
      router.push("/login");
    } else {
      setIsToken(true);
      setUserName(username || "Hero");
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5163/api/task/user");
      const tasks: Task[] = await res.json();

      const groupedTasks: GroupedTasks = {
        daily: [],
        weekly: [],
        monthly: [],
        yearly: [],
        side: [],
      };

      for (const task of tasks) {
        const type = task.type.toLowerCase() as TaskType;
        if (type in groupedTasks) {
          groupedTasks[type].push(task);
        }
      }

      setGrouped(groupedTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const handleCreateTask = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5163/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        setShowModal(false);
        setNewTask({ title: "", description: "", type: "daily" });
        loadTasks();
      } else {
        console.error("Failed to create task:", await res.text());
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleLogout = () => {
    if (confirm("Hero! Are you sure you want to leave the tavern?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      router.push("/login");
    }
    };
    
  if (!isToken) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-gray-100 to-purple-200 p-6">
      <UserHeader username={userName} level={3} onLogout={handleLogout} />

      {/* Add Quest Button */}
      <div className="flex my-4">
        <button
          className="bg-gray-100 hover:bg-gray-300 text-purple-500 rounded-full px-6 py-3 shadow-lg transition-all"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Quest
        </button>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-purple-700">
              Create New Quest
            </h2>
            <input
              type="text"
              className="w-full border text-black border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <textarea
              className="w-full border text-black border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <select
              className="w-full text-black border border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={newTask.type}
              onChange={(e) =>
                setNewTask({ ...newTask, type: e.target.value as TaskType })
              }
            >
              <option value="side">Side</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                onClick={handleCreateTask}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-purple-700">
              Edit Quest
            </h2>
            <input
              type="text"
              className="w-full text-black border border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />
            <textarea
              className="w-full text-black border border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            />
            <select
              className="w-full text-black border border-gray-300 p-2 rounded focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={editingTask.type.toLowerCase()}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  type: e.target.value as TaskType,
                })
              }
            >
              <option value="side">Side</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <label className="flex text-black font-bold items-center space-x-2">
              <input
                type="checkbox"
                checked={editingTask.isCompleted}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    isCompleted: e.target.checked,
                  })
                }
              />
              <span>Mark as Complete</span>
            </label>

            <div className="flex justify-between">
              <button
                className="text-red-500 hover:text-red-700"
                onClick={async () => {
                  await fetchWithAuth(
                    `http://localhost:5163/api/task/${editingTask.id}`,
                    { method: "DELETE" }
                  );
                  setEditingTask(null);
                  loadTasks();
                }}
              >
                Delete
              </button>

              <div className="space-x-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    await fetchWithAuth(
                      `http://localhost:5163/api/task/${editingTask.id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editingTask),
                      }
                    );
                    setEditingTask(null);
                    loadTasks();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Groups */}
      <div className="grid md:grid-cols-5 gap-6 mt-6">
        {(["side", "daily", "weekly", "monthly", "yearly"] as TaskType[]).map(
          (type) => (
            <div
              key={type}
              className="bg-white rounded-2xl shadow-md p-4 border border-purple-100"
            >
              <h2 className="text-xl font-bold mb-4 capitalize text-purple-700">
                {type} Quests
              </h2>
              <div className="space-y-4">
                {grouped[type].length === 0 ? (
                  <p className="text-gray-400 italic">No {type} quests yet</p>
                ) : (
                  grouped[type].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setEditingTask(task)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
