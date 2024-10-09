import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash, MessageCircle, X } from 'lucide-react';
import { useStore } from '../../../store'; // Custom hook for dark mode
import { Modal, Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    endTime: '',
    status: 'Pending',
  });
  const [newComment, setNewComment] = useState('');
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    if (task) {
      setNewTask({ ...task, assignedTo: task.assignedTo._id });
    } else {
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        endTime: '',
        status: 'Pending',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await axios.put(`http://localhost:3000/api/tasks/${selectedTask._id}`, newTask);
      } else {
        await axios.post('http://localhost:3000/api/tasks', newTask);
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddComment = async (id) => {
    setIsAddingComment(true);
    try {
      await axios.post(`http://localhost:3000/api/tasks/${id}/comment`, {
        text: newComment,
        createdBy: 'Admin', // Example user ID
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id
            ? { ...task, comments: [...task.comments, { text: newComment, createdBy: 'User' }] }
            : task
        )
      );
      setNewComment('');
      enqueueSnackbar('Comment added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error adding comment', { variant: 'error' });
    } finally {
      setIsAddingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'In Progress':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDarkMode ? 'text-red-400' : 'text-red-600';
    }
  };

  const TaskCard = ({ task, onView, onEdit, onDelete }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Assigned to: {task.assignedTo.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Status: {task.status}</p>
      <div className="flex justify-between">
        <button
          onClick={() => onView(task)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
          View Details
        </button>
        <div>
          <button
            onClick={() => onEdit(task)}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Task Management</h1>
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
        ) : isMobile ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onView={handleOpenDetailModal}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.tr
                      key={task._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                          onClick={() => handleOpenDetailModal(task)}
                        >
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">{task.assignedTo.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(task.startTime).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(task.endTime).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 mr-4"
                        >
                          <Trash size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDetailModal(task)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                        >
                          <MessageCircle size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

<Modal
  open={isModalOpen}
  onClose={handleCloseModal}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: isDarkMode ? '#1e1e1e' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      borderRadius: '10px',
      boxShadow: 24,
      p: 4,
    }}
  >
    <button
      onClick={handleCloseModal}
      className={`absolute top-2 right-2 ${isDarkMode ? 'text-gray-100 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
    >
      <X size={24} />
    </button>
    <Typography id="modal-title" variant="h6" component="h2" className="mb-4">
      {selectedTask ? 'Edit Task' : 'New Task'}
    </Typography>
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Task Title"
        name="title"
        sx={{
          backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
          borderColor: isDarkMode ? '#555' : '#ccc',
          color: isDarkMode ? '#fff' : '#000',
        }}
        value={newTask.title}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Description"
        name="description"
        sx={{
          backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
          borderColor: isDarkMode ? '#555' : '#ccc',
          color: isDarkMode ? '#fff' : '#000',
        }}
        value={newTask.description}
        onChange={handleInputChange}
        multiline
        rows={3}
        fullWidth
        required
      />
      <FormControl fullWidth>
        <InputLabel>Assign To</InputLabel>
        <Select
          name="assignedTo"
          sx={{
            backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
            borderColor: isDarkMode ? '#555' : '#ccc',
            color: isDarkMode ? '#fff' : '#000',
          }}
          value={newTask.assignedTo}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="">Select an employee</MenuItem>
          {employees.map((employee) => (
            <MenuItem key={employee._id} value={employee._id}>
              {employee.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="End Time"
        name="endTime"
        type="datetime-local"
        sx={{
          backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
          borderColor: isDarkMode ? '#555' : '#ccc',
          color: isDarkMode ? '#fff' : '#000',
        }}
        value={newTask.endTime}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          sx={{
            backgroundColor: isDarkMode ? '#333' : '#f7f7f7',
            borderColor: isDarkMode ? '#555' : '#ccc',
            color: isDarkMode ? '#fff' : '#000',
          }}
          value={newTask.status}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <div className="flex justify-end space-x-2">
        <Button onClick={handleCloseModal} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: isDarkMode ? '#bb86fc' : '#1976d2', color: '#fff' }}>
          {selectedTask ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  </Box>
</Modal>

        {selectedTask && (
          <Modal
            open={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            aria-labelledby="detail-modal-title"
            aria-describedby="detail-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: isDarkMode ? '#1e1e1e' : 'background.paper',
                color : isDarkMode ? '#fff' : '#000',
                borderRadius: '10px',
                boxShadow: 24,
                p: 4,
              }}
            >
              <button
                onClick={handleCloseDetailModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
              <Typography id="detail-modal-title" variant="h6" component="h2" className="mb-4 dark:text-white">
                {selectedTask.title}
              </Typography>
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle1" className="dark:text-white">
                    Description
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    {selectedTask.description}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" className="dark:text-white">
                    Assigned To
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    {selectedTask.assignedTo.name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" className="dark:text-white">
                    End Time
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    {new Date(selectedTask.endTime).toLocaleString()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" className="dark:text-white">
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    className={`font-semibold ${getStatusColor(selectedTask.status)}`}
                  >
                    {selectedTask.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" className="dark:text-white">
                    Comments
                  </Typography>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedTask.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <Typography variant="body2" className="text-gray-800 dark:text-gray-200">
                          {comment.text}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddComment(selectedTask._id);
                    }}
                    className="mt-4"
                  >
                    <TextField
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mt-2"
                      disabled={isAddingComment}
                    >
                      {isAddingComment ? <CircularProgress size={24} /> : 'Add Comment'}
                    </Button>
                  </form>
                </div>
              </div>
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;