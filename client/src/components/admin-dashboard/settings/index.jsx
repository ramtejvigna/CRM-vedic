import {Link, useNavigate} from "react-router-dom"
import { useStore } from "../../../store";
import { useEffect, useState } from "react";
import {toast , ToastContainer} from "react-toastify";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";
import {FaLock} from "react-icons/fa"
import {  Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
import { Edit } from 'lucide-react'
//import EditIcon from '@mui/icons-material/Edit';

function Settings() {
  const {setAdminInfo} = useStore();
  const [showModel , setShowModel] = useState(false);
  const [showModal2 , setShowModal2] = useState(false);
  const [isLoading , setIsLoading] = useState(false); // for employee loading
  const [loading , setLoading] = useState(false); // for changing password 
  const [employees , setEmployees] = useState([]);
  const navigate = useNavigate()
  const [showViewPasswordModal, setShowViewPasswordModal] = useState(false);
  const [adminPasswordForView, setAdminPasswordForView] = useState("");
  const [employeePasswords, setEmployeePasswords] = useState([]);
  const [loadingPasswords, setLoadingPasswords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingAdminPassword, setEditingAdminPassword] = useState('');
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [formData1 , setFormData1] = useState({
    currentPassword : '',
    newPassword : '',
    confirmNewPassword : ''
  })
  const [formData2 , setFormData2] = useState({
    employee : '',
    newPassword : '',
    confirmNewPassword : '',
    adminPassword : ''
  })


  const [showLogOutDailog , setShowLogOutDailog] = useState(false);


  const [adminPassword, setAdminPassword] = useState("");
  const handleEdit = (employee) => {
    // Pre-fill the employee in formData2
    setFormData2({
      employee: employee._id,
      newPassword: '',
      confirmNewPassword: '',
      adminPassword: ''
    });
    // Open the existing update employee password modal
    setShowModal2("section1");
    // Close the view passwords modal
    setShowViewPasswordModal(false);
  };
  const handleViewEmployeePasswords = async (e) => {
    e.preventDefault();
    
    if (!adminPasswordForView) {
      toast.error("Admin password is required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    setLoadingPasswords(true);
    try {
      const response = await axios.post(
        `https://vedic-backend-neon.vercel.app/admin/auth/view-employee-passwords`,
        {
          adminPassword: adminPasswordForView
        },
        { withCredentials: true }
      );
  
      if (!response.data.success) {
        toast.error(response.data.message || "Failed to fetch passwords", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
  
      // Use response.data.data instead of response.data.employees
      setEmployeePasswords(response.data.data);
      setShowViewPasswordModal("showTable");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoadingPasswords(false);
      setAdminPasswordForView("");
    }
  };  
  const handleCloseViewPassword = () => {
    setShowViewPasswordModal(false);
    setEmployeePasswords([]);
    setAdminPasswordForView("");
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${HOST}/admin/auth/logout`, {  }, { withCredentials: true });
      
      if(response.status === 200) {
        setAdminInfo(undefined)
        toast.success('Loged out succfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          navigate(`/login`)
        } , 2000)
      }
      
    } catch (error) {
      // Enhanced error handling based on error type
      if (error.response) {
        // Errors from the server
        if (error.response.status === 401) {
          toast.error('Unauthorized access. Please check your credentials.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error(`Unexpected error: ${error.response.data.message || "Please try again."}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else if (error.request) {
        // Network errors
        toast.error('Network error. Please check your connection.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Other unexpected errors
        toast.error(`An error occurred: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!formData1.currentPassword || !formData1.newPassword || !formData1.confirmNewPassword) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData1.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData1.newPassword === formData1.currentPassword) {
      toast.error("New password cannot be the same as the current password!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData1.newPassword !== formData1.confirmNewPassword) {
      toast.error("Confirm new password doesn't match!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    // Proceed with the API call
    setLoading(true);
    try {
      const response = await axios.post(
        `${HOST}/admin/auth/change-current-password`,
        { currentPassword: formData1.currentPassword, newPassword: formData1.newPassword },
        { withCredentials: true }
      );
  
      if (response.status === 200 && !response.data.success) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }
  
      toast.success("Password changed successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
      setShowModel(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  


  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${HOST}/api/employees`);
      setEmployees(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error occured !");
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const handleMoveNext = () => {
    if (!formData2.employee || !formData2.newPassword || !formData2.confirmNewPassword) {
      toast.error("Please fill in all fields!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData2.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData2.newPassword !== formData2.confirmNewPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    setShowModal2("section2");
  };
  

  const handleClose = () => {
      setFormData2({employee : '' , newPassword : '' , confirmNewPassword : '' , adminPassword : ''})
      setShowModal2(null)
  }


  const handleUpdateEmployeePassword = async () => {
    // Validation
    if (
      !formData2.employee ||
      !formData2.newPassword ||
      !formData2.confirmNewPassword ||
      !formData2.adminPassword
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData2.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (formData2.newPassword !== formData2.confirmNewPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.put(
        `${HOST}/admin/auth/update-employee-password`,
        {
          adminPassword: formData2.adminPassword,
          employeeId: formData2.employee,
          newPassword: formData2.newPassword,
        },
        { withCredentials: true }
      );
  
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }
  
      toast.success("Employee password updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };
  // Function to handle saving the modified password
const handleSavePassword = async (employee) => {
  if (!editingAdminPassword) {
    toast.error("Admin password is required!");
    return;
  }

  try {
    // Find the current employee's updated password from employeePasswords array
    const currentEmployee = employeePasswords.find(emp => emp._id === employee._id);
    if (!currentEmployee) {
      toast.error("Employee not found!");
      return;
    }

    const response = await axios.put(
      `${HOST}/admin/auth/edit-employee-password`,
      {
        employeeId: employee._id,
        newPassword: currentEmployee.password, // Using the password from employeePasswords
        adminPassword: editingAdminPassword
      },
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Password updated successfully");
      setEditingId(null);
      setEditingAdminPassword('');
    } else {
      toast.error(response.data.message || "Failed to update password");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred while updating the password");
  }
};
  const handleChange = (e) => {
    setFormData2((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = () => {
    const password = formData2.newPassword;
    const confirmPassword = formData2.confirmNewPassword;
    const passwordErrors = {};

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Password must have at least 8 chars, a letter, a number, and a special character

    // Validate new password
    if (!password) {
      passwordErrors.newPassword = "Password is required";
    } else if (!passwordRegex.test(password)) {
      passwordErrors.newPassword = "Password must be at least 8 characters, with a letter, number, and special character";
    }

    // Validate confirm password
    if (!confirmPassword) {
      passwordErrors.confirmNewPassword = "Please confirm the password";
    } else if (confirmPassword !== password) {
      passwordErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(passwordErrors);
    setIsPasswordValid(Object.keys(passwordErrors).length === 0);
  };

  // Call this function whenever the user types in the password or confirmPassword fields
  useEffect(() => {
    validatePassword();
  }, [formData2.newPassword, formData2.confirmNewPassword])
  

  return (
    <div className="flex items-center gap-5 md:p-10 w-full flex-col">
      {/* <div className="w-full bg-white shadow-md border border-gray-200 rounded-xl p-5 max-w-4xl flex flex-col gap-3">
        <h1 className="text-xl capitalize text-opacity-70 font-semibold tracking-wider">Profile</h1>
      </div> */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="w-full bg-white shadow-lg border border-gray-300 rounded-2xl p-2 md:p-6 max-w-4xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide  capitalize">
          Security Settings
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Manage your account’s security by updating or resetting your password to ensure optimal protection.
        </p>

        <div className="flex items-center justify-between md:flex-row flex-col md:gap-6 mt-2">
          <Button fullWidth variant="contained" sx={{
              backgroundColor: '#3B82F6',
              borderRadius : "10px"
            }}
          onClick={() => setShowModel((prev) => !prev)}
          >
            {!showModel ? "Change password" : "Cancel"}
          </Button>
          <Button fullWidth onClick={() => setShowModal2("section1")}
          >
            {"Update employee password"}
          </Button>
          <Button 
            fullWidth 
            onClick={() => setShowViewPasswordModal("enterPassword")}
          >
            View Employee Passwords
          </Button>
        </div>
        <Dialog
        open={showViewPasswordModal === "enterPassword"}
        onClose={handleCloseViewPassword}
        aria-labelledby="view-password-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="view-password-dialog-title">
          <div className="flex justify-center flex-col items-center">
            <FaLock size={64} className="text-blue-500" />
            Require Admin Password
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleViewEmployeePasswords}>
            <input
              type="password"
              value={adminPasswordForView}
              onChange={(e) => setAdminPasswordForView(e.target.value)}
              className="w-full p-3 rounded-md mb-5 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-100"
              placeholder="Enter Admin Password"
              required
            />
            <DialogActions>
              <Button type="button" variant="outlined" onClick={handleCloseViewPassword} color="primary">
                Cancel
              </Button>
              {loadingPasswords ? (
                <CircularProgress size={30} />
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  View Passwords
                </Button>
              )}
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
     <Dialog
  open={showViewPasswordModal === "showTable"}
  onClose={handleCloseViewPassword}
  aria-labelledby="password-table-dialog-title"
  fullWidth
  maxWidth="md"
>
  <DialogTitle id="password-table-dialog-title" className="flex justify-between items-center">
    Employee Passwords
    <Button 
      onClick={handleCloseViewPassword} 
      className="absolute right-2 top-2"
      sx={{ minWidth: '40px', padding: '6px' }}
    >
<span className="font-bold text-black hover:text-red-700 text-2xl hover:text-3xl transition-transform">✕</span>
</Button>
  </DialogTitle>
  <DialogContent>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Employee Name</th>
            <th className="py-2 px-4 border-b text-left">Password</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeePasswords.map((employee, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {`${employee.firstName || ''} ${employee.lastName || ''}`}
              </td>
              <td className="py-2 px-4 border-b font-mono">
                {editingId === employee._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      defaultValue={employee.password}
                      onChange={(e) => {
                        const updatedPasswords = employeePasswords.map(emp => 
                          emp._id === employee._id ? {...emp, password: e.target.value} : emp
                        );
                        setEmployeePasswords(updatedPasswords);
                      }}
                      className="w-full p-1 border rounded"
                    />
                    <input
                      type="password"
                      value={editingAdminPassword}
                      onChange={(e) => setEditingAdminPassword(e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="Admin password required"
                    />
                  </div>
                ) : (
                  employee.password
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === employee._id ? (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSavePassword(employee)}
                      color="primary"
                      variant="contained"
                      size="small"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditingId(null);
                        setEditingAdminPassword('');
                        // Revert any changes
                        const originalPasswords = [...employeePasswords];
                        setEmployeePasswords(originalPasswords);
                      }}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      setEditingId(employee._id);
                      setEditingAdminPassword('');
                    }}
                    color="primary"
                    startIcon={<Edit />}
                  >
                    
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DialogContent>
</Dialog>
      </div>

      <div className="w-full bg-white shadow-lg border border-gray-300 rounded-2xl md:p-6 p-2 max-w-4xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide capitalize">
          Account Security
        </h1>
        <p className="text-gray-700 text-base leading-relaxed">
        Ensure the security of your account by accessing key settings. You can update your password or log out safely to maintain full control over your account's protection.
        </p>

        <div className="flex items-center gap-6 mt-4">
          <Button
            sx={{
              color: "red",
              borderColor: "red",
            }}
            variant="outlined" 
            onClick={() => setShowLogOutDailog(true)}
          >
            {isLoading ? <div className="rounded-full border border-gray-300 border-t-white animate-spin w-7 h-7"/> : "Logout"}
          </Button>
        </div>  
      </div>


      {/* log out dailog */}
      <Dialog
          open={showLogOutDailog}
          onClose={() => setShowLogOutDailog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle  id="alert-dialog-title">{"Log out "}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to log out
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setShowLogOutDailog(false)} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained" 
              onClick={handleLogout}
              sx={{
                color: "text",
                background : "red",
                borderColor: "red",
              }}
            >
              Logout
            </Button>
          </DialogActions>
      </Dialog>

      <Dialog
          open={showModel}
          onClose={() => setShowModel(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle   variant="h5" id="alert-dialog-title">{"Change Password"}</DialogTitle>
          <DialogContent >
            <div className="w-full  p-2 max-w-4xl flex flex-col gap-2">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Phone Input */}
                  <div className="relative flex items-center w-full group">
                    <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
                      <FaLock/>
                    </span>
                    <input
                      name="currentPassword"
                      type="password"
                      value={formData1.currentPassword}
                      onChange={(e) => setFormData1((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                      className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 "
                      placeholder="Current Password"
                      required
                    />
                  </div>

                  <div className="relative flex items-center w-full group mt-4">
                    <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
                      <FaLock/>
                    </span>
                    <input
                      name="newPassword"
                      type="password"
                      value={formData1.newPassword}
                      onChange={(e) => setFormData1((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                      className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 "
                      placeholder="New Password"
                      required
                    />
                  </div>

                    <div className="relative flex items-center w-full">
                      <span className="absolute left-3 text-gray-500">
                        <FaLock/>
                      </span>
                      <input
                        name="confirmNewPassword"
                        type="password"
                        value={formData1.confirmNewPassword}
                        onChange={(e) => setFormData1((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                        className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 "
                        placeholder="Confirm New Password"
                        required
                      />
                    </div>
                  
                <DialogActions>
                  <Button type="button" variant="outlined" onClick={() => setShowModel(false)} color="primary">
                    Cancel
                  </Button>
                  {
                    loading ? <CircularProgress /> :
                    <Button type="submit" variant="contained"  autoFocus>
                      { "change"}
                    </Button>
                  }
                </DialogActions>
                </form>
            </div>
          </DialogContent>
      </Dialog>


      <Dialog
          open={showModal2 === "section1"}
          onClose={() => {setShowModal2(null) , handleClose()}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle   variant="h5" id="alert-dialog-title">{"Employee Password Change"}</DialogTitle>
          <DialogContent >
          <div className="w-full p-2 max-w-4xl flex flex-col gap-2">
      <div className="space-y-4">
        {/* Employee Select */}
        <select
          name="employee"
          value={formData2.employee}
          onChange={(e) =>
            setFormData2((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          className={`w-full p-2 rounded-lg border focus:ring-2 border-gray-500 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        >
          <option value="select employee">Select Employee</option>
          {/* Assuming employees are passed as props */}
          {employees.map((employee, index) => (
            <option key={index} value={employee._id}>
              {employee.firstName || employee?.name}
            </option>
          ))}
        </select>

        {/* New Password */}
        <div className="relative flex items-center w-full group mt-4">
          <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
            <FaLock />
          </span>
          <input
            name="newPassword"
            type="password"
            value={formData2.newPassword}
            onChange={handleChange}
            className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50"
            placeholder="New Password"
            required
          />
        </div>
        {errors.newPassword && (
          <div className="text-sm text-red-500">{errors.newPassword}</div>
        )}

        {/* Confirm New Password */}
        <div className="relative flex items-center group w-full">
          <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
            <FaLock />
          </span>
          <input
            name="confirmNewPassword"
            type="password"
            value={formData2.confirmNewPassword}
            onChange={handleChange}
            className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50"
            placeholder="Confirm New Password"
            required
          />
        </div>
        {errors.confirmNewPassword && (
          <div className="text-sm text-red-500">{errors.confirmNewPassword}</div>
        )}

        <DialogActions>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              setShowModal2(null);
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMoveNext}
            type="submit"
            variant="contained"
            autoFocus
            disabled={!isPasswordValid}
          >
            change
          </Button>
        </DialogActions>
      </div>
    </div>
          </DialogContent>
      </Dialog>


      <Dialog
        open={showModal2 === "section2"}
        onClose={handleClose}
        aria-labelledby="admin-password-dialog-title"
        aria-describedby="admin-password-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="admin-password-dialog-title" >
          <div className="flex justify-center flex-col items-center">
            <FaLock size={64} className="text-blue-500" /> {/* Long Lock Icon */}
            Reqiure Admin Password
          </div>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateEmployeePassword()
            }}
          >
            <input
              name="adminPassword"
              type="password"
              value={formData2.adminPassword}
              onChange={(e) => setFormData2((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
              className="w-full p-3 rounded-md mb-5 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-100"
              placeholder="Enter Admin Password"
              required
            />
            <DialogActions >
              <Button type="button" variant="outlined" onClick={handleClose} color="primary">
                Cancel
              </Button>
              {loading ? <CircularProgress size={30}/> : 
                <Button  type="submit" variant="contained" color="primary">
                  {"submit"}
                </Button>
              }
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>



    </div>

  )
}

export default Settings