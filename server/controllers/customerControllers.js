import { Employee, Customer } from "../models/User.js";
import { PDF } from "../models/PDF.js";
export const addCustomerWithAssignment = async (req, res) => {
    const {
        fatherName,
        motherName,
        customerName,
        email,
        whatsappNumber,
        babyGender,
        babyBirthDate,
        babyBirthTime,
        birthplace,
        preferredStartingLetter,
        preferredStartingLetterType,
        preferredGod,
        referenceName,
        additionalPreferences
    } = req.body;

    try {
        console.log("Creating new customer with data:", req.body);

        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const year = today.getFullYear();
        const dateString = `${month}-${year}`;

        const monthStart = new Date(year, today.getMonth(), 1); 
        const monthEnd = new Date(year, today.getMonth() + 1, 1); 

        const customersAddedThisMonth = await Customer.countDocuments({
            createdDateTime: { $gte: monthStart, $lt: monthEnd }
        });

        const customerCountForMonth = customersAddedThisMonth + 1;

        const customerID = `${month}${year}${customerCountForMonth}`;

        const newCustomer = new Customer({
            customerID, 
            fatherName,
            motherName,
            customerName,
            email,
            whatsappNumber,
            babyGender,
            babyBirthDate,
            babyBirthTime,
            birthplace,
            preferredStartingLetter,
            preferredStartingLetterType,
            preferredGod,
            referenceName,
            additionalPreferences
        });

        await newCustomer.save();

        res.status(201).json({ customer: newCustomer });
    } catch (error) {
        console.error("Error adding customer:", error.message); // Log full error
        res.status(500).json({ error: "Error adding customer" });
    }
};



export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        const employees = await Employee.find({}, 'firstName');

        console.log("Employees Fetched:", employees);

        const employeeMap = new Map(employees.map(emp => [
            emp._id.toString(),  
            `${emp.firstName}`  
        ]));

        console.log("Employee Map:", employeeMap);

        const customersWithEmployeeNames = customers.map(customer => {
            const assignedEmployeeId = customer.assignedEmployee ? customer.assignedEmployee.toString() : null;
            
            console.log("Assigned Employee ID for Customer:", assignedEmployeeId);

            const employeeName = assignedEmployeeId ? employeeMap.get(assignedEmployeeId) : 'Not Assigned';
            
            console.log("Mapped Employee Name:", employeeName || 'Unknown');

            return {
                ...customer.toObject(),
                assignedEmployeeName: employeeName || 'Unknown'  
            };
        });

        res.status(200).json(customersWithEmployeeNames);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Error fetching customers" });
    }
};

    


export const getCustomersBasedOnRequests = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const employee = await Employee.findById(employeeId).populate('customers');

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const customers = employee.customers;
        
        const completed = customers
            .filter(customer => customer.customerStatus === 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const remainingCustomers = customers
            .filter(customer => customer.customerStatus !== 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            assignedCustomers: remainingCustomers,
            completed,
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
export const getCustomerDetails = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        console.log(req.params)

        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const employee = await Employee.findById(customer.assignedEmployee);

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
        const customer = await Customer.findOne({ fatherName: req.params.fatherName });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const pdfs = await PDF.find({ customer: customer._id });

        if (pdfs.length === 0) {
            return res.status(404).json({ message: 'No PDFs found for this customer' });
        }

        res.json(pdfs);
    } catch (error) {
        console.error('Error retrieving PDFs:', error);
        res.status(500).json({ message: 'Error retrieving PDFs', error: error.message });
    }
};
export const updateCustomerData = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, feedback, customerStatus, 
        paymentDate, paymentTime, amountPaid, transactionId ,socialMediaId , leadSource
    } = req.body;

    try {
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log(socialMediaId,leadSource,"sid")
        if (paymentStatus !== undefined) {
            customer.paymentStatus = paymentStatus;
        }
        customer.feedback = feedback;
        customer.customerStatus = customerStatus;
        customer.payTransactionID = transactionId;
        customer.amountPaid = amountPaid;
        customer.paymentDate = paymentDate;
        customer.paymentTime = paymentTime;
        customer.socialMediaId = socialMediaId;
        customer.leadSource = leadSource;

        await customer.save();
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'Error updating customer', error: err });
    }
};
