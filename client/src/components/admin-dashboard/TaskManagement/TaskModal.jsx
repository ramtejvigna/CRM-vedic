import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Send, Calendar, User2 } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const TaskModal = ({
  isModalOpen,
  handleCloseModal,
  selectedTask,
  newTask,
  handleInputChange,
  handleDateChange,
  handleSubmit,
  employees = [],
  isDarkMode,
  newComment,
  setNewComment,
  handleAddComment,
  isAddingComment,
  getStatusColor,
  isDetailModal = false,
}) => {
  console.log(selectedTask);
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-md transform overflow-hidden rounded-2xl ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                } p-6 shadow-xl transition-all`}
              >
                <div className="relative">
                  <button
                    onClick={handleCloseModal}
                    className={`absolute right-0 top-0 p-1 rounded-full ${
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    } transition-colors`}
                  >
                    <X size={20} />
                  </button>

                  {isDetailModal ? (
                    <div className="space-y-4">
                      <Dialog.Title
                        className={`text-lg font-medium ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedTask.title}
                      </Dialog.Title>

                      <div className="space-y-3">
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Description
                          </h4>
                          <p
                            className={`mt-1 text-sm ${
                              isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {selectedTask.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <User2
                            size={16}
                            className={
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }
                          />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {selectedTask.assignedTo.firstName ||
                              "Not assigned"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar
                            size={16}
                            className={
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }
                          />
                          <p className="text-sm font-sans">Deadline : </p>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {new Date(selectedTask.endTime).toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              selectedTask.status
                            )}`}
                          >
                            {selectedTask.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Comments
                          </h4>
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {(selectedTask.comments || []).map(
                              (comment, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-lg ${
                                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                  }`}
                                >
                                  <p className="font-medium">
                                    {comment.createdBy}
                                  </p>
                                  <p
                                    className={`mt-1 ${
                                      isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {comment.text}
                                  </p>
                                </div>
                              )
                            )}
                          </div>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddComment(selectedTask._id);
                            }}
                          >
                            <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className={`w-full px-3 py-2 rounded-lg border ${
                                isDarkMode
                                  ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            <button
                              type="submit"
                              disabled={isAddingComment}
                              className="justify-center items-center px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingComment ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Send size={20} className="mr-2" />
                                </>
                              )}
                            </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Dialog.Title
                        className={`text-lg font-medium ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedTask ? "Edit Task" : "New Task"}
                      </Dialog.Title>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            name="title"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>

                        <div>
                          <textarea
                            name="description"
                            placeholder="Description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>

                        <div>
                          <select
                            name="assignedTo"
                            value={newTask.assignedTo}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? "bg-slate-700 border-slate-600 text-slate-200"
                                : "bg-white border-slate-200 text-slate-900"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          >
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                              <option key={employee._id} value={employee._id}>
                                {employee.firstName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Deadline"
                            value={newTask.endTime}
                            onChange={handleDateChange}
                            renderInput={(params) => (
                              <input
                                {...params}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  isDarkMode
                                    ? "bg-slate-700 border-slate-600 text-slate-200"
                                    : "bg-white border-slate-200 text-slate-900"
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                              />
                            )}
                          />
                        </LocalizationProvider>

                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className={`px-4 py-2 rounded-lg border ${
                              isDarkMode
                                ? "border-slate-600 text-slate-200 hover:bg-slate-700"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            } transition-colors`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-1 py-1 rounded-2xl bg-blue-500 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <Send size={14} className="mr-2" />
                            {selectedTask ? "Update Task" : "Create Task"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskModal;
