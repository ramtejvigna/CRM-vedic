import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add, Close, Comment } from "@mui/icons-material";
import axios from "axios";
import { useStore } from "../../../store";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    endTime: "",
    status: "Pending",
  });
  const [newComment, setNewComment] = useState("");
  const { isDarkMode } = useStore();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employees");

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setOpenModal(true);
    if (!task) {
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        endTime: "",
        status: "Pending",
      });
    } else {
      setNewTask({ ...task, assignedTo: task.assignedTo._id });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
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
    try {
      await axios.post(`http://localhost:3000/api/tasks/${id}/comment`, {
        text: newComment,
        createdBy: "66ff54863b2d6f0e00bdc1a2", // Change this accordingly if user data is available
      });
      setNewComment("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleTaskTitleClick = (task) => {
    setSelectedTask(task);
    setDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setDescriptionModal(false);
    setSelectedTask(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "In Progress":
        return "orange";
      default:
        return "red";
    }
  };

  return (
    <div
      className={`p-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenModal()}
        className="mb-4"
        sx={{m:3}}
      >
        Assign New Task
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Title</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks &&
              tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell
                    onClick={() => handleTaskTitleClick(task)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {task.title}
                  </TableCell>
                  <TableCell>{task.assignedTo.name}</TableCell>
                  <TableCell>
                    {new Date(task.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(task.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: getStatusColor(task.status) }}>
                    {task.status}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(task._id)}>
                      <Delete />
                    </IconButton>
                    <IconButton onClick={() => handleTaskTitleClick(task)}>
                      <Comment />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-md`}
        >
          <Typography variant="h6" className="m-4"   sx={{my:4}}>
            {selectedTask ? "Edit Task" : "Assign New Task"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Task Title"
              fullWidth
              sx={{mb:2}}
              value={newTask.title}
              onChange={handleInputChange}
              className="mb-8 mt-2"
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newTask.description}
              onChange={handleInputChange}
              sx={{mb:2}}            />
            <FormControl fullWidth className="mb-4 mt-4"   sx={{mb:2}}>
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleInputChange}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="endTime"
              label="End Time"
              type="datetime-local"
              fullWidth
              value={newTask.endTime}
              onChange={handleInputChange}
              sx={{mb:4}}              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {selectedTask ? "Update Task" : "Assign Task"}
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={descriptionModal} onClose={handleCloseDescriptionModal}>
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-md`}
        >
          <Typography variant="h6" className="mb-4"   sx={{mb:2}}>
            Task Details
          </Typography>
          <Typography className="mb-4" sx={{mb:2}}>{selectedTask?.description}</Typography>
          <Typography variant="h6">Comments</Typography>
          {selectedTask &&
            selectedTask.comments.map((comment) => (
              <Typography sx={{my:2}} key={comment._id}>
                {comment.text} - {comment.createdBy}
              </Typography>
            ))}

          <TextField
            label="Comment"
            fullWidth
            value={newComment}
            onChange={handleCommentChange}
            className="mb-4"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddComment(selectedTask._id)}
            fullWidth
          >
            Add Comment
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TaskManagement;
