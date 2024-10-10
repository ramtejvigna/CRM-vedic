import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "../../../store"; // Custom hook for dark mode
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Backdrop,
  Fade,
} from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    endTime: new Date(),
    status: "Pending",
  });
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { isDarkMode } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employees");
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    if (task) {
      setNewTask({
        ...task,
        assignedTo: task.assignedTo._id,
        endTime: new Date(task.endTime),
      });
    } else {
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        endTime: new Date(),
        status: "Pending",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleOpenDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewTask((prev) => ({ ...prev, endTime: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await axios.put(
          `http://localhost:3000/api/tasks/${selectedTask._id}`,
          newTask
        );
      } else {
        await axios.post("http://localhost:3000/api/tasks", newTask);
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddComment = async (id) => {
    setIsAddingComment(true);
    try {
      await axios.post(`http://localhost:3000/api/tasks/${id}/comment`, {
        text: newComment,
        createdBy: "Admin", // Example user ID
      });
      setSelectedTask((prevTask) => ({
        ...prevTask,
        comments: [
          ...prevTask.comments,
          { text: newComment, createdBy: "User" },
        ],
      }));
      setNewComment("");
      enqueueSnackbar("Comment added successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error adding comment", { variant: "error" });
    } finally {
      setIsAddingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "In Progress":
        return isDarkMode ? "text-yellow-400" : "text-yellow-600";
      default:
        return isDarkMode ? "text-red-400" : "text-red-600";
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Task Management
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Plus size={20} />
          Assign New Task
        </motion.button>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            isMobile={isMobile}
            handleOpenDetailModal={handleOpenDetailModal}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
            getStatusColor={getStatusColor}
          />
        )}

        <TaskModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          selectedTask={selectedTask}
          newTask={newTask}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          employees={employees}
          isDarkMode={isDarkMode}
        />

        {selectedTask && (
          <TaskModal
            isModalOpen={isDetailModalOpen}
            handleCloseModal={handleCloseDetailModal}
            selectedTask={selectedTask}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            isAddingComment={isAddingComment}
            getStatusColor={getStatusColor}
            isDarkMode={isDarkMode}
            isDetailModal={true}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
