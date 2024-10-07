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
  CircularProgress,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { Edit, Delete, Add, Comment } from "@mui/icons-material";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light', // You can toggle this between 'light' and 'dark'
  },
});

const TaskManagementChild = () => {
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
  const { enqueueSnackbar } = useSnackbar();
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      enqueueSnackbar("Error fetching tasks", { variant: "error" });
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await axios.get("http://localhost:3000/api/employees");
      console.log(response.data.employees)
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      enqueueSnackbar("Error fetching employees", { variant: "error" });
    } finally {
      setLoadingEmployees(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo || !newTask.endTime) {
      enqueueSnackbar("Please fill out all required fields", { variant: "error" });
      return;
    }
    try {
      if (selectedTask) {
        await axios.put(`http://localhost:3000/api/tasks/${selectedTask._id}`, newTask);
      } else {
        await axios.post("http://localhost:3000/api/tasks", newTask);
      }
      fetchTasks();
      handleCloseModal();
      enqueueSnackbar("Task saved successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error saving task", { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      fetchTasks();
      enqueueSnackbar("Task deleted", { variant: "warning" });
    } catch (error) {
      enqueueSnackbar("Error deleting task", { variant: "error" });
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

  const handleAddComment = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/tasks/${id}/comment`, {
        text: newComment,
        createdBy: "66ff54863b2d6f0e00bdc1a2", // Example user ID
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id
            ? { ...task, comments: [...task.comments, { text: newComment, createdBy: "User" }] }
            : task
        )
      );
      setNewComment("");
      enqueueSnackbar("Comment added successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error adding comment", { variant: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return theme.palette.success.main;
      case "In Progress":
        return theme.palette.warning.main;
      default:
        return theme.palette.error.main;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenModal()}
        sx={{ mb: 4 }}
      >
        Assign New Task
      </Button>
      {loadingTasks ? (
        <CircularProgress />
      ) : isMobile ? (
        <Box>
          {tasks.map((task) => (
            <Paper key={task._id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" onClick={() => handleTaskTitleClick(task)} sx={{ cursor: "pointer", color: "primary.main" }}>
                {task.title}
              </Typography>
              <Typography>Assigned To: {task.assignedTo.name}</Typography>
              <Typography>Start Time: {new Date(task.startTime).toLocaleString()}</Typography>
              <Typography>End Time: {new Date(task.endTime).toLocaleString()}</Typography>
              <Typography sx={{ color: getStatusColor(task.status) }}>Status: {task.status}</Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton onClick={() => handleOpenModal(task)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(task._id)} color="error">
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleTaskTitleClick(task)} color="info">
                  <Comment />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
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
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell
                    onClick={() => handleTaskTitleClick(task)}
                    sx={{ cursor: "pointer", color: "primary.main" }}
                  >
                    {task.title}
                  </TableCell>
                  <TableCell>{task.assignedTo.name}</TableCell>
                  <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                  <TableCell sx={{ color: getStatusColor(task.status) }}>{task.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(task)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(task._id)} color="error">
                      <Delete />
                    </IconButton>
                    <IconButton onClick={() => handleTaskTitleClick(task)} color="info">
                      <Comment />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedTask ? "Edit Task" : "Assign New Task"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newTask.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleInputChange}
              >
                {employees?.map((employee) => (
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
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {selectedTask ? "Update Task" : "Assign Task"}
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={descriptionModal} onClose={handleCloseDescriptionModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Task Details
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {selectedTask?.description}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Comments
          </Typography>
          <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            {selectedTask && selectedTask.comments.map((comment, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.200', borderRadius: 1 }}>
                <Typography variant="body2">
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  by {comment.createdBy}
                </Typography>
              </Box>
            ))}
          </Box>
          <TextField
            label="Comment"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
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
    </Box>
  );
};

const TaskManagement = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider maxSnack={3}>
      <TaskManagementChild />
    </SnackbarProvider>
  </ThemeProvider>
);

export default TaskManagement;