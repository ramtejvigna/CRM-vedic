import { Customer, Employee } from "../models/User.js"

export const getNewCustomers = async (req , res) => {
    try {
        const newCustomers = await Customer.find({assignedEmployee : undefined})

        const filteredCustomers = newCustomers
        .filter(customer => customer.customerStatus === 'newRequests')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const inProgress = newCustomers
        .filter(customer => customer.customerStatus === 'inProgress')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        const completed = newCustomers
            .filter(customer => customer.customerStatus === 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const rejected = newCustomers
            .filter(customer => customer.customerStatus === 'rejected')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


        return res.status(200).json({newRequests : filteredCustomers , inProgress , completed , rejected })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}


export const getEmployees = async (req ,res) => {
    try {
        const employees = await Employee.find({
            $or: [
              { role: "Senior Employee" },
              { role: "Junior Employee" }
            ]
          })
          .populate("customers", "fatherName motherName")
          .sort({ createdAt: -1 });
                  return res.status(200).json({employees});

        return res.status(200).json({employees})
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}