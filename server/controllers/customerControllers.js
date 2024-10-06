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

export const getCustomersBasedOnRequests = async (req, res) => {
    try {
        const newRequests = await Customer.find({ paymentStatus: false });
        const inProgress = await Customer.find({ paymentStatus: true, pdfGenerated: { $lt: 1 } });
        const completed = await Customer.find({ paymentStatus: true, pdfGenerated: { $gte: 1 } });

        console.log({ newRequests: newRequests, inProgress: inProgress, completed: completed });

        res.status(200).json({
            newRequests,
            inProgress,
            completed,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err });
    }
}

export const getCustomerData = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, pdfGenerated, feedback } = req.body;

    try {
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (paymentStatus !== undefined) {
            customer.paymentStatus = paymentStatus;
        }
        if (pdfGenerated !== undefined) {
            customer.pdfGenerated = pdfGenerated;
        }
        if (feedback) {
            // Assuming there’s a feedback field you want to store
            customer.feedback = feedback;
        }

        await customer.save();
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err });
    }
}
export const customerDetails = async (req, res) => {
    const customerId = req.params.id; // Get the customer ID from the URL parameters

    try {
        const customer = await Customer.findById(customerId)
            .populate('assignedEmployee') // Populate the assigned employee details if needed
            .exec();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        // Return the customer details as a response
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer data:', error);
        res.status(500).json({ error: 'An error occurred while fetching customer data.' });
    }
};
