import React from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";

const TaskModal = ({
  isModalOpen,
  handleCloseModal,
  selectedTask,
  newTask,
  handleInputChange,
  handleDateChange,
  handleSubmit,
  employees,
  isDarkMode,
  newComment,
  setNewComment,
  handleAddComment,
  isAddingComment,
  getStatusColor,
  isDetailModal = false,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "60%", md: "40%" },
            bgcolor: isDarkMode ? "#1E293B" : "#fff", // Dark slate blue for background
            color: isDarkMode ? "#E5E7EB" : "#000", // Light gray text color for visibility
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <button
            onClick={handleCloseModal}
            className={`absolute top-2 right-2 ${
              isDarkMode
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <X size={24} />
          </button>
          {isDetailModal ? (
            <>
              <Typography
                id="detail-modal-title"
                variant="h6"
                component="h2"
                className="mb-4"
              >
                {selectedTask.title}
              </Typography>
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle1">Description</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }} // Muted color for less important text
                  >
                    {selectedTask.description}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Assigned To</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }}
                  >
                    {selectedTask.assignedTo.name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">End Time</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }}
                  >
                    {new Date(selectedTask.endTime).toLocaleString()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Status</Typography>
                  <Typography
                    variant="body2"
                    className={`font-semibold ${getStatusColor(
                      selectedTask.status
                    )}`}
                  >
                    {selectedTask.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Comments</Typography>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedTask.comments.map((comment, index) => (
                      <div
                        key={index}
                        className={`${
                          isDarkMode ? "bg-gray-800" : "bg-slate-200"
                        } p-2 rounded`}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? "#D1D5DB" : "#4B5563", // Soft gray for comments
                          }}
                        >
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
                      rows={1}
                      fullWidth
                      sx={{
                        backgroundColor: isDarkMode ? "#2D3748" : "#fff",
                        color: isDarkMode ? "#E5E7EB" : "#000",
                        "& .MuiInputBase-input": {
                          color: isDarkMode ? "#E5E7EB" : "#000", // Text color inside the input
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode ? "#9CA3AF" : "#000", // Border color for the input
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#6366F1",
                        color: "#fff",
                      }} // Vibrant color for the comment button
                      disabled={isAddingComment}
                    >
                      {isAddingComment ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Add Comment"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                className="mb-4"
                sx={{ mb: 3 }}
              >
                {selectedTask ? "Edit Task" : "New Task"}
              </Typography>
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  label="Task Title"
                  name="title"
                  sx={{
                    backgroundColor: isDarkMode ? "#2D3748" : "#f7f7f7",
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "#fff" : "#000", // Text color
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#E5E7EB" : "#000", // Label color
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#9CA3AF" : "#000", // Border color
                    },
                  }}
                  value={newTask.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: isDarkMode ? "#E5E7EB" : "#000" }, // Input label color
                  }}
                />
                <TextField
                  label="Description"
                  name="description"
                  sx={{
                    backgroundColor: isDarkMode ? "#374151" : "#f7f7f7",
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "#fff" : "#000",
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#E5E7EB" : "#000",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#9CA3AF" : "#000",
                    },
                  }}
                  value={newTask.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                />
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      color: isDarkMode ? "#E5E7EB" : "#000",
                     
                    }}
                  >
                    Assign To
                  </InputLabel>
                  <Select
                    name="assignedTo"
                    sx={{
                      backgroundColor: isDarkMode ? "#374151" : "#f7f7f7",
                      color: isDarkMode ? "#E5E7EB" : "#000",
                      "& .MuiSelect-icon": {
                        color: isDarkMode ? "#E5E7EB" : "#000",
                      },
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
                <DatePicker
                  selected={newTask.endTime}
                  onChange={(date) => handleDateChange(date)}
                  showTimeSelect
                  label ="Due"
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="time"
                  customInput={
                    <TextField
                      fullWidth
                      sx={{
                        backgroundColor: isDarkMode ? "#374151" : "#f7f7f7",
                        "& .MuiInputBase-input": {
                          color: isDarkMode ? "#fff" : "#000",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode ? "#9CA3AF" : "#000",
                        },
                        "& .MuiInputLabel-root": {
                          color: isDarkMode ? "#E5E7EB" : "#000",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: isDarkMode ? "#E5E7EB" : "#000",
                        },
                      }}
                    />
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    display: "block",
                  }}
                >
                  {selectedTask ? "Update Task" : "Create Task"}
                </Button>
              </form>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
