import { Employee, Customer } from "../models/User.js";

export const addCustomerWithAssignment = async (req, res) => {
    const {
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
        // Fetch all customers
        const customers = await Customer.find();
        
        // Fetch all employees
        const employees = await Employee.find({}, 'name');
        
        // Create a map of employee IDs to names
        const employeeMap = new Map(employees.map(emp => [emp._id.toString(), emp.name]));

        // Add employee names to customer data
        const customersWithEmployeeNames = customers.map(customer => ({
            ...customer.toObject(),
            assignedEmployeeName: customer.assignedEmployee 
                ? employeeMap.get(customer.assignedEmployee.toString()) || 'Unknown'
                : 'Not Assigned'
        }));

        res.status(200).json(customersWithEmployeeNames);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Error fetching customers" });
    }
};


export const getCustomersBasedOnRequests = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        // Find the employee by ID and populate the customers field
        const employee = await Employee.findById(employeeId).populate('customers');

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Categorize customers based on payment status and PDF generation
        const customers = employee.customers;
        const newRequests = customers.filter(customer => customer.customerStatus === 'newRequests');
        const inProgress = customers.filter(customer => customer.customerStatus === 'inProgress');
        const completed = customers.filter(customer => customer.customerStatus === 'completed');
        const rejected = customers.filter(customer => customer.customerStatus === 'rejected');

        // Return the categorized customers
        res.status(200).json({
            newRequests,
            inProgress,
            completed,
            rejected
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching customers for employee" });
    }
}

export const getCustomerData = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, pdfGenerated, feedback, customerStatus,
        paymentDate, paymentTime, amountPaid, transactionId
    } = req.body;

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
        customer.feedback = feedback;
        customer.customerStatus = customerStatus;
        customer.payTransactionID = transactionId;
        customer.amountPaid = amountPaid;
        customer.paymentDate = paymentDate;
        customer.paymentTime = paymentTime;

        await customer.save();
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err });
    }
}
// Assuming you have an endpoint to get customer details
export const getCustomerDetails = async (req, res) => {
        try {
            const { fatherName } = req.params;
    
            // Fetch the customer by fatherName
            const customer = await Customer.findOne({ fatherName });
    
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
    
            // Fetch the assigned employee
            const employee = await Employee.findById(customer.assignedEmployee);
    
            // Construct the response with customer and employee details
            const response = {
                ...customer.toObject(),
                assignedEmployee: employee ? employee : null, // Include the entire employee object
            };
    
            res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching customer details:", error);
            res.status(500).json({ error: "Error fetching customer details" });
        }
    };
    