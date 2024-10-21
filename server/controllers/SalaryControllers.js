import { Salaries } from "../models/Salaries.js";
import fs from "fs";
import path from "path";

// Create Salary Statement
export const createSalaryStatement = async (req, res) => {
    try {
        const { employee, year, month, basicSalary, totalAllowance, totalDeduction } = req.body;

        if (!employee || !year || !month || !basicSalary || !totalAllowance || !totalDeduction) {
            return res.status(400).json({ message: "All fields are required" });
        }



        const filePath = req.file ? req.file.path.replace(/\\/g, '/') : "";

        const newSalaryStatement = await Salaries.create({
            employee,
            year,
            month,
            basicSalary,
            totalAllowance,
            totalDeduction,
            bankStatement: filePath
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


        const { id, basicSalary, totalAllowance, totalDeduction , year , month } = req.body;

        const salaryStatement = await Salaries.findById(id);

        if (!salaryStatement) {
            return res.status(404).json({ message: "Salary statement not found." });
        }

        if (req.file) {
            const oldFilePath = salaryStatement.bankStatement;
            if (oldFilePath && fs.existsSync(path.resolve(oldFilePath))) {
                fs.unlinkSync(path.resolve(oldFilePath)); // Delete the old file
            }
            salaryStatement.bankStatement = req.file.path.replace(/\\/g, '/'); // Update with the new file path
        }

        salaryStatement.basicSalary = basicSalary;
        salaryStatement.totalAllowance = totalAllowance;
        salaryStatement.totalDeduction = totalDeduction;
        salaryStatement.year = year ;
        salaryStatement.month = month ;
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

        const filePath = salaryStatement.bankStatement;
        if (filePath && fs.existsSync(path.resolve(filePath))) {
            fs.unlinkSync(path.resolve(filePath)); 
        }

        await Salaries.deleteOne({ _id: id });

        return res.status(200).json({ message: "Salary statement deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const filterSalariesByYearAndMonth = async (req, res) => {
    const { year, month } = req.query;

    // Initialize the query object
    const searchQuery = {};

    // Add the year to the query if it's provided and valid
    if (year && year !== "select year") {
        searchQuery.year = year;
    }

    // Add the month to the query if it's provided and valid
    if (month && month !== "select month") {
        searchQuery.month = month;
    }

    try {
        // Fetch salaries based on the constructed query
        const salaries = await Salaries.find(searchQuery);

        // Return an empty array if no results are found
        if (salaries.length === 0) {
            return res.status(200).json([]);
        }

        // Return the filtered salaries
        return res.status(200).json(salaries);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "An error occurred while filtering salaries.",
            error,
        });
    }
};
