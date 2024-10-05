import { Employee } from "../models/User.js";

export const addEmployee = async (req ,res) => {
    try {
        const {username , name , phone , email , city , address , state , country , pincode} = req.body;
        
        const isExist = await Employee.findOne({email }) ;

        if(isExist) {
            return res.status(400).send("employee already exists")
        }

        const newEmployee = await Employee.create({
            username ,
            name ,
            phone ,
            email ,
            city ,
            address ,
            state ,
            country ,
            pincode ,
        });

        return res.status(200).json({message : "employee added" , employee : newEmployee})
    }catch(err) {
        res.status(500).send("Internal server error");
    }
};

// @desc Getting all employees
// @route GET /api/employee/get-employees
// @access public
export const getEmployees = async (req ,res) => {
    try {
        const employees = await Employee.find();

        return res.status(200).json({employees});
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

// @desc Get Employee By id
// @route GET /api/employee/get-employee
// @access public
export const getEmployee = async (req , res) => {
    try {
        const { id } = req.query;

        const employee = await Employee.findById({_id : id});

        if(!employee)  {
            return res.status(400).send(`Employee not found with id : ${id}`)
        }

        return res.status(200).json({employee});
    } catch (error) {
        return res.status(400).send("Internal server error");
    }
}