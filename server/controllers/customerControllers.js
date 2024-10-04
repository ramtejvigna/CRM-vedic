import { Employee, Customer } from "../models/User.js";

export const addCustomerWithAssignment = async (req, res) => {
    const {
        username,
        fatherName,
        motherName,
        email,
        whatsappNumber,
        babyGender,
        babyBirthDate,
        babyBirthTime,
        birthplace,
        preferredStartingLetter,
        preferredGod,
        referenceName,
        additionalPreferences
    } = req.body;

    try {
        // Create new customer
        const newCustomer = new Customer({
            username,
            fatherName,
            motherName,
            email,
            whatsappNumber,
            babyGender,
            babyBirthDate,
            babyBirthTime,
            birthplace,
            preferredStartingLetter,
            preferredGod,
            referenceName,
            additionalPreferences
        });

        const employees = await Employee.find().populate('customers');

        if (employees.length === 0) {
            return res.status(400).json({ error: "No employees available for assignment" });
        }

        // Find the employee with the fewest customers
        employees.sort((a, b) => a.customers.length - b.customers.length);

        // Assign the new customer to the employee with the fewest customers
        const employeeToAssign = employees[0];
        employeeToAssign.customers.push(newCustomer);

        // Save the employee's ID in the customer document
        newCustomer.assignedEmployee = employeeToAssign._id;

        // Save both the customer and employee updates
        await newCustomer.save();
        await employeeToAssign.save();

        res.status(201).json({ customer: newCustomer, employee: employeeToAssign });
    } catch (error) {
        res.status(500).json({ error: "Error adding customer " });
    }
};


export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        console.log(customers)
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching customers" });
    }
};