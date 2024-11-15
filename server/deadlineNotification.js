import cron from "node-cron";
import {  Customer } from "./models/User.js";
import { Notification } from "./models/Notification.js";

const checkCustomerDeadlines = async () => {
    try {
        console.log("hello");
      const oneDayInMillis = 1 * 24 * 60 * 60 * 1000; // Two days in milliseconds
      const now = new Date();
  
      // Fetch all customers with status 'inWorking'
      const customers = await Customer.find({ customerStatus: 'inWorking' }).select('customerName deadline assignedEmployee');
  
      for (const customer of customers) {
        if (customer.deadline) {
          const timeRemaining = new Date(customer.deadline) - now;
  
          // If the deadline is within the next two days
          if (timeRemaining > 0 && timeRemaining <= oneDayInMillis) {
            const hoursLeft = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const daysLeft = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
            const message = `Hurry up! Customer ${customer.customerName} has a deadline approaching in ${daysLeft} day(s) and ${hoursLeft} hour(s).`;
            const employeeId = customer.assignedEmployee;
            console.log(employeeId,message);
            const notification = new Notification({
                employee: employeeId,
                message,
              });
    
              await notification.save(); 
          }
        }
      }
    } catch (error) {
      console.error('Error checking customer deadlines:', error);
    }
  };
  
  // Schedule the function to run every 2 minutes for testing purposes
  cron.schedule('0 * * * *', checkCustomerDeadlines);