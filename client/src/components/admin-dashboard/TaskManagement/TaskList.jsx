import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash, MessageCircle } from "lucide-react";
import TaskCard from "./TaskCard";

const TaskList = ({
  tasks,
  isMobile,
  handleOpenDetailModal,
  handleOpenModal,
  handleDelete,
  getStatusColor,
  currentPage,
  tasksPerPage,
  setCurrentPage,
  totalPages,
  fetchTasks,
  isDarkMode,
}) => {
  const indexOfLastRecord = currentPage * tasksPerPage;
  const indexOfFirstRecord = indexOfLastRecord - tasksPerPage;
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            fetchTasks(i);
          }}
          className={`relative inline-flex items-center px-4 py-2 border ${
            isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
          } text-sm font-medium ${
            currentPage === i ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      {isMobile ? (
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
                  S.No
                </th>
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
                {tasks.map((task, index) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                        onClick={() => handleOpenDetailModal(task)}
                      >
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {task.assignedTo?.firstName}
                      </div>
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
          <div
            className={`px-4 py-3 flex items-center justify-between border-t ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } sm:px-6`}
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  fetchTasks(Math.max(currentPage - 1, 1));
                }}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  fetchTasks(Math.min(currentPage + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing {indexOfFirstRecord + 1} to {indexOfLastRecord} of {tasks.length} results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      fetchTasks(Math.max(currentPage - 1, 1));
                    }}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                    } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                  >
                    Previous
                  </button>
                  {renderPaginationButtons()}
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      fetchTasks(Math.min(currentPage + 1, totalPages));
                    }}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                    } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;