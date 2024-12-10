import {Link, useNavigate} from "react-router-dom"
import { useStore } from "../../../store";
import { useEffect, useState } from "react";
import {toast , ToastContainer} from "react-toastify";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";
import {FaLock} from "react-icons/fa"
import {  Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
function Settings() {
  const {setAdminInfo} = useStore();
  const [showModel , setShowModel] = useState(false);
  const [showModal2 , setShowModal2] = useState(false);
  const [isLoading , setIsLoading] = useState(false); // for employee loading
  const [loading , setLoading] = useState(false); // for changing password 
  const [employees , setEmployees] = useState([]);
  const navigate = useNavigate()

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
        </div>
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
            <div className="w-full  p-2 max-w-4xl flex flex-col gap-2">
                <div className="space-y-4">
                  <select
                    name="employee" 
                    value={formData2.employee}
                    onChange={(e) => setFormData2((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                    className={`w-full p-2 rounded-lg border  
                      focus:ring-2 border-gray-500 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  >
                    <option value="select employee">Select Employee</option>
                    {employees.map((employee, index) => (
                      <option key={index} value={employee._id}>
                        {employee.firstName || employee?.name}
                      </option>
                    ))}
                </select>

                  <div className="relative flex items-center w-full group mt-4">
                    <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
                      <FaLock/>
                    </span>
                    <input
                      name="newPassword"
                      type="password"
                      value={formData2.newPassword}
                      onChange={(e) => setFormData2((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                      className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 "
                      placeholder="New Password"
                      required
                    />
                  </div>

                    <div className="relative flex items-center group w-full">
                      <span className="absolute left-3 text-gray-500 group-focus-within:text-blue-500">
                        <FaLock/>
                      </span>
                      <input
                        name="confirmNewPassword"
                        type="password"
                        value={formData2.confirmNewPassword}
                        onChange={(e) => setFormData2((prev) => ({...prev , [(e.target.name)] : e.target.value}))}
                        className="w-full p-2 pl-10 rounded-md border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 "
                        placeholder="Confirm New Password"
                        required
                      />
                    </div>
                  
                <DialogActions>
                  <Button type="button" variant="outlined" onClick={() => {setShowModal2(null) , handleClose()}} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={() => handleMoveNext()} type="submit" variant="contained"  autoFocus>
                    Next
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