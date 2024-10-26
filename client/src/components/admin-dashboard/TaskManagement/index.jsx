import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Send } from "lucide-react";
import { useStore } from "../../../store"; // Custom hook for dark mode
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { isDarkMode } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(5);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTasks = async (page = 1) => {
    setIsLoadingTasks(true);
    try {
      const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/tasks?page=${page}&limit=${tasksPerPage}`);
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const response = await axios.get("https://vedic-backend-neon.vercel.app/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoadingEmployees(false);
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
          `https://vedic-backend-neon.vercel.app/api/tasks/${selectedTask._id}`,
          newTask
        );
        toast.success("Task updated successfully");
      } else {
        await axios.post("https://vedic-backend-neon.vercel.app/api/tasks", newTask);
        toast.success("Task created successfully");
      }
      fetchTasks(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://vedic-backend-neon.vercel.app/api/tasks/${taskToDelete}`);
      fetchTasks(currentPage);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleAddComment = async (id) => {
    setIsAddingComment(true);
    try {
      await axios.post(`https://vedic-backend-neon.vercel.app/api/admin/tasks/${id}/comments`, {
        text: newComment,
        createdBy: "Admin",
      });
      setSelectedTask((prevTask) => ({
        ...prevTask,
        comments: [
          ...prevTask.comments,
          { text: newComment, createdBy: "User" },
        ],
      }));
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Error adding comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return isDarkMode ? "text-green-400" : "text-slate-100 bg-green-500";
      case "In Progress":
        return isDarkMode ? "text-yellow-400" : "text-slate-100 bg-yellow-500";
      default:
        return isDarkMode ? "text-red-400" : "text-slate-100 bg-red-500";
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDarkMode ? "dark bg-gray-900" : ""
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
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
        {isLoadingTasks || isLoadingEmployees ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress size={64} />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            isMobile={isMobile}
            handleOpenDetailModal={handleOpenDetailModal}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
            getStatusColor={getStatusColor}
            currentPage={currentPage}
            tasksPerPage={tasksPerPage}
            fetchTasks={fetchTasks}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            isDarkMode={isDarkMode}
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

        <Dialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Task"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskManagement;
