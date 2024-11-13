import {Link, useNavigate} from "react-router-dom"
import { useStore } from "../../../store";
import { useState } from "react";
import {toast , ToastContainer} from "react-toastify";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";
function Settings() {
  const {setAdminInfo} = useStore();
  const [showModel , setShowModel] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  const navigate = useNavigate()

  const [currentPassword , setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loading , setLoading] = useState(false);
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

    if(newPassword === confirmNewPassword) {
        setLoading(true);
      
        try {
          const response = await axios.post(`${HOST}/admin/auth/change-current-password`, { currentPassword , newPassword }, { withCredentials: true });
      
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
          
          toast.success('Password changed Successfully', {
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
          setLoading(false);
          
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
        } finally {
          setLoading(false);
        }

    }else {
      toast.error("Confirm New Password , doesn't matched !", {
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
  };
  return (
    <div className="flex items-center gap-5 p-10 w-full flex-col">
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

      <div className="w-full bg-white shadow-lg border border-gray-300 rounded-2xl p-6 max-w-4xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide  capitalize">
          Security Settings
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Manage your account’s security by updating or resetting your password to ensure optimal protection.
        </p>

        <div className="flex items-center gap-6 mt-2">
          <button onClick={() => setShowModel((prev) => !prev)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {!showModel ? "Change password" : "Cancel"}
          </button>
        </div>
      </div>
      {showModel && (
        <div className="w-full bg-white shadow-lg border border-gray-300 rounded-2xl p-6 max-w-4xl flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide  capitalize">
            Change Password
          </h1>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Phone Input */}
              <div className="relative group">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-5 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Current Password"
                  required
                />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-5 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="New Password"
                  required
                />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-5 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Change
                  </>
                )}
              </button>

            </form>

        </div>
      )}

      <div className="w-full bg-white shadow-lg border border-gray-300 rounded-2xl p-6 max-w-4xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide capitalize">
          Account Security
        </h1>
        <p className="text-gray-700 text-base leading-relaxed">
        Ensure the security of your account by accessing key settings. You can update your password or log out safely to maintain full control over your account's protection.
        </p>

        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={() => handleLogout()}
            className="px-8 py-3 flex items-center justify-center bg-red-500 text-white rounded-xl font-semibold shadow-md hover:bg-red-600 transition-transform duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {isLoading ? <div className="rounded-full border border-gray-300 border-t-white animate-spin w-7 h-7"/> : "Logout"}
          </button>
        </div>  
      </div>


    </div>

  )
}

export default Settings