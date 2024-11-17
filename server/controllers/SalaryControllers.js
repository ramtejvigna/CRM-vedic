import { Salaries } from "../models/Salaries.js";
import fs from "fs";
import path from "path";

// Create Salary Statement
export const createSalaryStatement = async (req, res) => {
    try {
        const { employee, year, month, amountPaid } = req.body;

        if (!employee || !year || !month || !amountPaid) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let bankStatement = ''
        if(req.file) {
            bankStatement = req.file.buffer.toString('base64')
        }

        const newSalaryStatement = await Salaries.create({
            employee,
            year,
            month,
            amountPaid,
            bankStatement
        });

        return res.status(200).json({
            message: "Salary statement added successfully",
            newSalaryStatement
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateSalaryStatement = async (req, res) => {
    try {
        // Destructure the necessary fields from req.body
        const { id, amountPaid, year, month , employee } = req.body;

        // Ensure all necessary fields are provided
        if (!id || !amountPaid || !year || !month) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        // Find the salary statement by ID
        const salaryStatement = await Salaries.findById(id);

        if (!salaryStatement) {
            return res.status(404).json({ message: "Salary statement not found." });
        }

        let newBase64 = null;

        if (req.file) {
            newBase64 = req.file.buffer.toString('base64');  
        }

        salaryStatement.employee = employee;
        salaryStatement.amountPaid = amountPaid;
        salaryStatement.year = year;
        salaryStatement.month = month;
        salaryStatement.bankStatement = newBase64 

        const updatedSalaryStatement = await salaryStatement.save();

        return res.status(200).json({
            message: "Salary statement updated successfully",
            updatedSalaryStatement
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllSalaryStatements = async (req, res) => {
    try {
        const salaryStatements = await Salaries.find().populate("employee");
        return res.status(200).json(salaryStatements);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteSalaryStatement = async (req, res) => {
    try {
        const { id } = req.params;

        const salaryStatement = await Salaries.findById(id);
        if (!salaryStatement) {
            return res.status(404).json({ message: "Salary statement not found." });
        }

        await Salaries.deleteOne({ _id: id });

        return res.status(200).json({ message: "Salary statement deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const filterSalariesByYearAndMonth = async (req, res) => {
    try {
        // Add a log to ensure the route is being triggered
        console.log("API is being hit with params:", req.query);
        
        const { year, month } = req.query;
        
        const searchQuery = {};

        // Validate and add the year to the query if it's provided and valid
        if (year && year !== "select year" && !isNaN(year)) {
            searchQuery.year = parseInt(year);
        }

        // Validate and add the month to the query if it's provided and valid
        if (month && month !== "select month" && !isNaN(month)) {
            searchQuery.month = month;
        }

        console.log("Constructed search query:", searchQuery);

        // Fetch salaries based on the constructed query
        const salaries = await Salaries.find(searchQuery).populate("employee");

        if (salaries.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(salaries);
    } catch (error) {
        console.error("Error while filtering salaries:", error.message);
        return res.status(500).json({
            message: "An error occurred while filtering salaries.",
            error: error.message,
        });
    }
};


export const getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;  


        const salaryStatement = await Salaries.findById(id).populate("employee");

        if (!salaryStatement) {
            return res.status(404).json({ message: "Salary statement not found." });
        }

        return res.status(200).json(salaryStatement);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
