import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash, MessageCircle } from "lucide-react";

const TaskCard = ({ task, onView, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
  >
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
      {task.title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
      Assigned to: {task.assignedTo.name}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
      Status: {task.status}
    </p>
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

export default TaskCard;
