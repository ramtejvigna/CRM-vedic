import { Employee, Customer, Astro } from "../models/User.js";
import { PDF } from "../models/PDF.js";
import { sendApplicationConfirmationEmail } from "../utils/mailer.utils.js";
import { format } from 'date-fns';
import axios from 'axios';
import locationService from "../utils/locationService.js";
export const generateUniqueApplicationId = async (Customer) => {
    const today = new Date();
    const datePrefix = format(today, 'ddMMyyHHmmss').slice(0, 10);

    // Check for uniqueness
    let isUnique = false;
    let finalApplicationId;
    
    while (!isUnique) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        finalApplicationId = `${datePrefix}${randomSuffix}`;

        // Check if this application ID already exists
        const existingCustomer = await Customer.findOne({ customerID: finalApplicationId });
        
        if (!existingCustomer) {
            isUnique = true;
        }
    }

    return finalApplicationId;
};

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
        additionalPreferences,
        isTwins,
        selectedServices,
        totalPrice,
    } = req.body;

    try {

        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const dateString = `${month}-${year}`;

        const monthStart = new Date(year, today.getMonth(), 1);
        const monthEnd = new Date(year, today.getMonth() + 1, 1);

        const customersAddedThisMonth = await Customer.countDocuments({
            createdDateTime: { $gte: monthStart, $lt: monthEnd },
        });

        const customerCountForMonth = customersAddedThisMonth + 1;

        const customerID = `${month}${year}${customerCountForMonth}`;
        const applicationID = await generateUniqueApplicationId(Customer);

        const apiKey = process.env.GOOGLE_MAP_API_KEY;

        // Step 1: Fetch latitude and longitude from Google Maps API
        // const geoResponse = await axios.get(
        //     `https://maps.googleapis.com/maps/api/geocode/json`,
        //     {
        //         params: {
        //             address: birthplace,
        //             key: apiKey,
        //         },
        //     }
        // );

        // if (geoResponse.data.status !== 'OK') {
        //     return res.status(400).json({ error: 'Location not found' });
        // }

        // const { lat: latitude, lng: longitude } = geoResponse.data.results[0].geometry.location;
        const latitude = 16.544893
        const longitude = 81.521241

        // Step 2: Call the Astrology API with the longitude, latitude, and other data
        const babyBirthDateObj = new Date(babyBirthDate);
        const day = babyBirthDateObj.getDate();
        const bornMonth = babyBirthDateObj.getMonth() + 1; // Months are 0-indexed
        const bornYear = babyBirthDateObj.getFullYear();
        const [hour, min] = babyBirthTime.split(':').map(Number); // Extract hour and minute from time string
        const tzone = 5.5; // Adjust timezone as required (e.g., IST = +5:30)

        const astroApiUrl = 'https://json.astrologyapi.com/v1/astro_details';
        const username = '637021';
        const password = '06fbcbab818b35cb983ef592b2df5661247d88ba';

        const astroResponse = await axios.post(
            astroApiUrl,
            {
                day,
                month: bornMonth,
                year: bornYear,
                hour,
                min,
                lat: latitude,
                lon: longitude,
                tzone,
            },
            {
                auth: { username, password },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        if (!astroResponse.data) {
            return res.status(500).json({ error: 'Failed to fetch horoscope data' });
        }

        const horoscopeData = astroResponse.data;

        // Step 3: Save the customer details in the database
        const newCustomer = new Customer({
            applicationID,
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
            additionalPreferences,
            isTwins,
            selectedServices,
            totalPrice,
        });

        await newCustomer.save();

        // Step 4: Save the horoscope details in the Astro collection
        try {
            const newAstroRecord = new Astro({
                customerId: newCustomer._id,
                zodiacSign: horoscopeData?.sign || 'Unknown',
                nakshatra: horoscopeData?.Naksahtra || 'Unknown',
                numerologyNo: horoscopeData?.Charan || 0,
                luckyColour: 'Blue',
                gemstone: 'Blue Sapphire',
                destinyNumber: 1,
                luckyDay: 'Mars',
                luckyGod: horoscopeData?.SignLord || 'Unknown',
                luckyMetal: horoscopeData?.paya || 'Unknown',
            });
            await newAstroRecord.save();
        } catch (astroError) {
            console.error("Error saving Astro data:", astroError.message);
            return res.status(500).json({ error: "Failed to save horoscope data" });
        }

        // Step 5: Send confirmation email and respond to the client
        await sendApplicationConfirmationEmail(newCustomer);

        res.status(201).json({
            applicationId: applicationID,
            totalPrice,
            selectedServices,
            astroDetails: horoscopeData,
        });
    } catch (error) {
        console.error("Error adding customer:", error.message);
        res.status(500).json({ error: "Error adding customer" });
    }
};


export const getLocationSuggestions = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const suggestions = await locationService.getLocationSuggestions(query);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Location suggestions error:", error);
        res.status(500).json({ error: "Error fetching location suggestions" });
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
        paymentDate, paymentTime, amountPaid, transactionId,leadsource,
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
        customer.leadSource=leadsource;

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
        paymentDate, paymentTime, amountPaid, transactionId ,socialMediaId , leadSource,deadline,
        completedOn
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
        customer.leadSource = leadSource;
        customer.deadline = deadline;
        customer.socialMediaId = socialMediaId;
        if(completedOn !== undefined) 
            customer.completedOn = completedOn;

        await customer.save();
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err });
    }
};

export const getCustomersByEmployeeId = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Query customers with the matching assignedEmployee._id
        const customers = await Customer.find({ 'assignedEmployee': employeeId });

        // Handle no results
        if (!customers || customers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No customers found for this employee',
            });
        }

        // Return the customers
        res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching customers',
        });
    }
};