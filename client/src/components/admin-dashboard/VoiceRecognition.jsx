import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidenav from "../Sidebar";
import { useStore } from "../../store";
import { routes } from "../../routes";
import Home from "./Home";
import AddEmployee from "./Employee/AddEmployee";
import TaskManagement from "./TaskManagement";
import EditEmployee from "./Employee/EditEmployee";
import Customer from "./Customer/Customer";
import ViewEmployee from "./Employee/ViewEmployee";
import AddExpense from "./Expenses/AddExpense";
import Leaves from "./Leaves";
import AddSalariesStatements from "./Salaries/AddSalariesStatements";
import { UilMicrophone, UilMicrophoneSlash } from '@iconscout/react-unicons'; // Icons for mic button

export const VoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    const language = 'en';

    const getResponse = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:9000/callRoutes', {
                params: {
                    language: language,
                }
            });
            const route = response.data.description.toLowerCase();
            console.log(route)

            handleCommand(route);
        } catch (error) {
            console.error('Error getting response:', error);
        }
    };

    useEffect(() => {
        if (isListening) {
            getResponse();
        }
    }, [isListening]);

    const handleCommand = (command) => {
        if (command.includes('home') || command.includes('dashboard') || command.includes('main page')) {
            navigate('/admin-dashboard/home');
            speak('Opened home page');
        } else if (command.includes('add employee') || command.includes('new employee') || command.includes('create employee') || command.includes('employee add') || command.includes('employee new')) {
            navigate('/admin-dashboard/employees/add-employee');
            speak('Opened add employee page');
        } else if (command.includes('edit employee') || command.includes('modify employee') || command.includes('employee edit') || command.includes('employee modify')) {
            navigate('/admin-dashboard/employees/edit-employee');
            speak('Opened edit employee page');
        } else if (command.includes('view employee') || command.includes('employee details') || command.includes('employee view') || command.includes('employee info')) {
            navigate('/admin-dashboard/employees/view-employee');
            speak('Opened view employee page');
        } else if (command.includes('tasks') || command.includes('task management') || command.includes('manage tasks') || command.includes('task list') || command.includes('task view')) {
            navigate('/admin-dashboard/tasks');
            speak('Opened task management page');
        } else if (command.includes('add expense') || command.includes('new expense') || command.includes('create expense') || command.includes('expense add') || command.includes('expense new')) {
            navigate('/admin-dashboard/expenses/add-expense');
            speak('Opened add expense page');
            setIsListening(!isListening)
        } else if (command.includes('leaves') || command.includes('leave management') || command.includes('manage leaves') || command.includes('leave list') || command.includes('leave view')) {
            navigate('/admin-dashboard/leaves');
            speak('Opened leave management page');
            setIsListening(!isListening)
        } else if (command.includes('salaries') || command.includes('new salaries') || command.includes('add salaries') || command.includes('salaries add') || command.includes('salaries new')) {
            navigate('/admin-dashboard/salaries/add-salaries');
            speak('Opened add salaries page');
            setIsListening(!isListening)
        } else if (command.includes('customers') || command.includes('customer details') || command.includes('customer list') || command.includes('customer view') || command.includes('customer info')) {
            navigate('/admin-dashboard/customers');
            speak('Opened customers page');
            setIsListening(!isListening)
        } 
        else if (command.includes('baby') || command.includes('baby database') || command.includes('baby names') || command.includes('names') || command.includes('baby')) {
            navigate('/admin-dashboard/babyDatabase');
            speak('Opened baby database page');
            setIsListening(!isListening)
        } else {
            navigate('/admin-dashboard/home');
            speak('Command not recognized. Please try again.');
            setIsListening(!isListening)
        }
        setIsListening(!isListening)
    };
    
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
            onClick={() => setIsListening(!isListening)}
        >
            {isListening ? (
                <UilMicrophoneSlash className="text-2xl" />
            ) : (
                <UilMicrophone className="text-2xl" />
            )}
        </button>
    );
};