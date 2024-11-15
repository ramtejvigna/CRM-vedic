import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {HOST} from '../utils/constants.js'
import { Mail, Phone, ArrowRight, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
  const [section , setSection] = useState("form");
  const [email, setEmail] = useState('');
  const [otp , setOtp] = useState(new Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post(`${HOST}/admin/auth/forgot-password`, { email }, { withCredentials: true });
  
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
        setIsLoading(false);
        return;
      }
  
      toast.success('OTP sent successfully.', {
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
        setSection("otp")
      }  , 2000)

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
    }finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e , index) => {
    
    if(isNaN(e.target.value)) return false;

    setOtp([...otp.map((data , i ) => (i == index ? e.target.value : data))]);

    if(e.target.value && e.target.nextSibling) {
        e.target.nextSibling.focus();
    }

    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
        e.target.previousSibling.focus();
    }

  }

  const handleVerify = async  () => {
    if(otp.join("").length == 6) {
        const code = otp.join("")
        setIsLoading(true);
        try {

          const response = await axios.post(`${HOST}/admin/auth/verify-otp`, { code }, { withCredentials: true });
      
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
            setIsLoading(false);
            setSection("form");
            return;
          }
      
          toast.success('OTP VERIFIED', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          
          navigate(`/reset-password/${response.data.token}`)
          setIsLoading(false);
    
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
          setIsLoading(false);
        }
    }else {
        toast.error("Enter valid otp")
    }
  }
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
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
      <div className="relative w-full max-w-md">
        {/* Floating shapes for background decoration */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 relative z-10 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Your Password?</h2>
            <p className="text-gray-600">Enter your email address below to receive otp.</p>
          </div>

            { section == "form" ? (
                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Email Input */}
                    <div className="relative group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-5 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Email"
                        required
                    />
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mb-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                        send  
                        <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                    </button>
                    <div>
                      <Link className='text-blue-500 hover:underline' to="/admin-dashboard/home">{"<"} Go to Dashboard</Link>
                    </div>
                </form>
            ) : (
                <div className='flex flex-col gap-5'>
                    <div className="flex gap-2">
                        {otp.map((data , index) => (
                            <input maxLength={1} onKeyDown={(e) => handleChange(e, index)} type="text" value={data} onChange={(e) => handleChange(e , index)}  className="w-full pl-5 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            />
                        ))}
                    </div>

                    <div className='my-2 flex justify-end'>
                        <span className='text-xs text-opacity-60 text-gray-500'>OTP will expire in 5 minutes.</span>
                    </div>
                    <button
                        type="submit"
                        onClick={() => handleVerify()}
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                        verify  
                        <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                    </button>
                    

                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;