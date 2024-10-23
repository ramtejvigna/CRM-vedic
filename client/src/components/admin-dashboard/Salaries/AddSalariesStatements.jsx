import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon, } from 'lucide-react';
import { TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const AddSalariesStatements = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    employee: "",
    amountPaid: "",
    year: "",
    month: '',
    bankStatement: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://vedic-backend-neon.vercel.app/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    const formErrors = {};
    if (!formData.employee || formData.employee === "select employee") formErrors.employee = "Select employee";
    if (!formData.amountPaid || formData.amountPaid <= 0) formErrors.amountPaid = "Amount paid is required";
    if (!formData.year || formData.year === "select year") formErrors.year = "Please select year";
    if (!formData.month || formData.month === "select month") formErrors.month = "Please select month";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      try {
        const response = await axios.post('https://vedic-backend-neon.vercel.app/salaries/', formDataToSend);
        if (response.status === 200) {
          toast.success("Salary added successfully");
          navigate("/admin-dashboard/salaries");
        }
      } catch (error) {
        toast.error("Error adding salary statement");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <motion.h1 
            className="text-2xl font-bold mb-8 text-gray-800"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            Add Salary Statement
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {/* <UserIcon size={16} /> */}
                  Employee
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  className={`w-full p-3 rounded-lg border ${errors.employee ? 'border-red-500' : 'border-gray-300'} 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="select employee">Select Employee</option>
                  {employees.map((employee, index) => (
                    <option key={index} value={employee._id}>
                      {employee.firstName || employee?.name}
                    </option>
                  ))}
                </select>
                {errors.employee && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.employee}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {/* <BanknotesIcon size={16} /> */}
                  Amount Paid
                </label>
                <TextField
                  name="amountPaid"
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  error={!!errors.amountPaid}
                  helperText={errors.amountPaid}
                  className="w-full"
                  InputProps={{
                    className: 'rounded-lg'
                  }}
                />
              </motion.div>

              <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {/* <CalendarIcon size={16} /> */}
                  Month
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className={`w-full p-3 rounded-lg border ${errors.month ? 'border-red-500' : 'border-gray-300'} 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="select month">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
                {errors.month && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.month}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {/* <CalendarIcon size={16} /> */}
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className={`w-full p-3 rounded-lg border ${errors.year ? 'border-red-500' : 'border-gray-300'} 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="select year">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.year}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div 
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-6"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {/* <DocumentArrowUpIcon size={16} /> */}
                Bank Statement
              </label>
              {!formData.bankStatement ? (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-2 p-8 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 cursor-pointer"
                >
                  <label className="w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-4">
                      {/* <DocumentArrowUpIcon size={48} className="text-blue-500" /> */}
                      <p className="text-sm font-medium text-gray-600">Click or drag file to upload</p>
                      <p className="text-xs text-gray-500">Supported formats: JPG, PNG, JPEG</p>
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) => setFormData({ ...formData, bankStatement: e.target.files[0] })}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2"
                >
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(formData.bankStatement)}
                      alt="Bank Statement"
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({ ...formData, bankStatement: null })}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <XCircleIcon size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="flex justify-end gap-4 mt-8"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Link
                to="/admin-dashboard/salaries"
                className="flex items-center px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {/* <ArrowLeftIcon size={16} className="mr-2" /> */}
                Cancel
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-6 py-2 text-white bg-blue-500 rounded-lg 
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'} 
                  transition-colors`}
              >
                {isSubmitting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Add Salary'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddSalariesStatements;