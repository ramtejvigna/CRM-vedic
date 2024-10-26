import { Employee, Customer } from "../models/User.js";
import { PDF } from "../models/PDF.js";
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
        console.log("Creating new customer with data:", req.body);

        // Get current month and year in MM-YYYY format
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = today.getFullYear();
        const dateString = `${month}-${year}`;

        // Get the number of customers added in the current month
        const monthStart = new Date(year, today.getMonth(), 1); // First day of the current month
        const monthEnd = new Date(year, today.getMonth() + 1, 1); // First day of the next month

        const customersAddedThisMonth = await Customer.countDocuments({
            createdDateTime: { $gte: monthStart, $lt: monthEnd }
        });

        // Increment the count for the customer being added this month
        const customerCountForMonth = customersAddedThisMonth + 1;

        // Generate the customerID in the format Month-Year-Count
        const customerID = `${month}${year}${customerCountForMonth}`;

        // Create a new customer instance with the generated customerID
        const newCustomer = new Customer({
            customerID, // Add the generated customerID
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

        // Find all employees and populate the customers they have
        const employees = await Employee.find().populate('customers');

        if (employees.length === 0) {
            return res.status(400).json({ error: "No employees available for assignment" });
        }

        // Sort employees by the number of customers they have (ascending order)
        employees.sort((a, b) => a.customers.length - b.customers.length);

        // Pick the employee with the fewest customers
        const employeeToAssign = employees[0];

        // Push the new customer to the employee's customers array
        employeeToAssign.customers.push(newCustomer._id);

        // Assign the employee to the customer
        newCustomer.assignedEmployee = employeeToAssign._id;

        console.log("Assigning employee:", employeeToAssign);

        // Save both the new customer and the updated employee
        await newCustomer.save();
        await employeeToAssign.save();

        res.status(201).json({ customer: newCustomer, employee: employeeToAssign });
    } catch (error) {
        console.error("Error adding customer:", error.message); // Log full error
        res.status(500).json({ error: "Error adding customer" });
    }
};



export const getCustomers = async (req, res) => {
    try {
        // Fetch all customers
        const customers = await Customer.find();

        // Fetch all employees and retrieve only the 'firstName' field
        const employees = await Employee.find({}, 'firstName');

        // Log the employees fetched from the database
        console.log("Employees Fetched:", employees);

        // Create a map for employee names using their _id as the key
        const employeeMap = new Map(employees.map(emp => [
            emp._id.toString(),  // Ensure _id is a string
            `${emp.firstName}`  // Store the firstName
        ]));

        // Log the employee map
        console.log("Employee Map:", employeeMap);

        // Map customers to include assigned employee names
        const customersWithEmployeeNames = customers.map(customer => {
            const assignedEmployeeId = customer.assignedEmployee ? customer.assignedEmployee.toString() : null;
            
            // Log the assigned employee ID for each customer
            console.log("Assigned Employee ID for Customer:", assignedEmployeeId);

            const employeeName = assignedEmployeeId ? employeeMap.get(assignedEmployeeId) : 'Not Assigned';
            
            // Log the result of the employee map lookup
            console.log("Mapped Employee Name:", employeeName || 'Unknown');

            return {
                ...customer.toObject(),
                assignedEmployeeName: employeeName || 'Unknown'  // Use 'Unknown' if no employee found in the map
            };
        });

        // Send the response with customers including employee names
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

        // Categorize and sort customers based on payment status and time
        const customers = employee.customers;
        
        const newRequests = customers
            .filter(customer => customer.customerStatus === 'newRequests')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const inProgress = customers
            .filter(customer => customer.customerStatus === 'inProgress')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const completed = customers
            .filter(customer => customer.customerStatus === 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const rejected = customers
            .filter(customer => customer.customerStatus === 'rejected')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Return the categorized and sorted customers
        res.status(200).json({
            newRequests,
            inProgress,
            completed,
            rejected
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching customers for employee" });
    }
};

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
        console.log(req.params);
        const { id } = req.params;
        console.log(req.params)

        // Fetch the customer by fatherName
        const customer = await Customer.findById(id);

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

export const getCustomerPdfs = async (req, res) => {
    try {
        // Find the customer by father's name
        const customer = await Customer.findOne({ fatherName: req.params.fatherName });

        // Check if the customer exists
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find PDFs associated with the customer
        const pdfs = await PDF.find({ customer: customer._id });

        // Check if any PDFs were found
        if (pdfs.length === 0) {
            return res.status(404).json({ message: 'No PDFs found for this customer' });
        }

        // Return the PDFs
        res.json(pdfs);
    } catch (error) {
        // Log the error for debugging
        console.error('Error retrieving PDFs:', error);
        res.status(500).json({ message: 'Error retrieving PDFs', error: error.message });
    }
};
// In customerControllers.js
export const updateCustomerData = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, feedback, customerStatus, 
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
};
