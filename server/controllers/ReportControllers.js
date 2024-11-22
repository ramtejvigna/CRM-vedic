import {PDF as Pdfs} from '../models/PDF.js'
import Expenses from "../models/Expenses.js"
import { Customer } from '../models/User.js';
export const getPdfsGenByEmployee = async (req , res) => {
    try {
        const { range } = req.query;
        console.log(range)
        const date1 = new Date();
        const date2 = new Date();


        if (range === "today") {
            date1.setHours(0, 0, 0, 0);
            date2.setHours(23, 59, 59, 999);
        } else if (range === "week") {
            const startOfWeek = date1.getDate() - date1.getDay(); 
            date1.setDate(startOfWeek);
            date1.setHours(0, 0, 0, 0);
            date2.setDate(startOfWeek + 6);
            date2.setHours(23, 59, 59, 999);
        } else if (range === "month") {
            date1.setDate(1); 
            date1.setHours(0, 0, 0, 0);
            date2.setMonth(date1.getMonth() + 1); 
            date2.setDate(0); 
            date2.setHours(23, 59, 59, 999);
        } else {
            return res.status(400).json({ message: "Invalid range. Use 'today', 'week', or 'month'." });
        }
        const results = await Pdfs.aggregate([
            {
                $match : {createdAt: { $gte : date1 , $lte : date2 }}
            },
            {
                $group : {
                    _id : "$generatedBy",
                    count : {$sum : 1}
                }
            } ,
            {
                $lookup : {
                    from : "employees" ,
                    localField : "_id" ,
                    foreignField : "firstName",
                    as : "employee"
                }
            },
            {
                $unwind : {
                    path: "$employee",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project : {
                    employeeName: {
                        $ifNull: [
                            { $concat: ["$employee.firstName", " ", "$employee.lastName"] },
                            null
                        ]
                    },
                    count: 1
                }
            }
        ])

        const filteredData = results.filter((data) => data.employeeName)
        return res.status(200).json(filteredData);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message : "Internal server error."})
    }
}

export const getExpensesByMonth = async (req, res) => {
    try {
      const now = new Date();
      const { month = "this" } = req.query; 
  
      let startDate, endDate;
      if (month === "this") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (month === "last") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      } else {
        return res.status(400).json({ message: "Invalid month query. Use 'this' or 'last'." });
      }
  
      const result = await Expenses.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $addFields: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$date" },
            },
          },
        },
        {
          $group: {
            _id: "$expense_name",
            totalAmount: {
              $sum: "$amount",
            },
          },
        },
        {
          $group: {
            _id: null,
            data: { $push: { category: "$_id", totalAmount: "$totalAmount" } },
            grandTotal: { $sum: "$totalAmount" },
          },
        },
        {
          $unwind: "$data",
        },
        {
          $project: {
            category: "$data.category",
            totalAmount: "$data.totalAmount",
            grandTotal: 1,
            percentage: {
              $multiply: [{ $divide: ["$data.totalAmount", "$grandTotal"] }, 100],
            },
          },
        },
      ]);
  
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

  export const getRevenueData = async (req, res) => {
    try {
      const { timeRange, employeeFilter } = req.query;
  
      // Determine the date range based on the timeRange filter
      const now = new Date();
      let startDate, endDate, groupByField;
  
      if (timeRange === "yearly") {
        startDate = new Date(now.getFullYear() - 4, 0, 1); // 4 years back
        endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
        groupByField = { $year: "$createdDateTime" };
      } else if (timeRange === "monthly") {
        startDate = new Date(now.getFullYear(), 0, 1); // Start of the current year
        endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
        groupByField = { $month: "$createdDateTime" };
      } else if (timeRange === "weekly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        groupByField = {
          $week: "$createdDateTime",
        }; // MongoDB's week-based grouping
      } else {
        return res.status(400).json({ message: "Invalid time range specified." });
      }
  
      // Match criteria based on employee filter and payment status
      const matchCriteria = {
        createdDateTime: { $gte: startDate, $lte: endDate },
        paymentStatus: true, // Only include paid customers
        ...(employeeFilter !== "overall" && { assignedEmployee: employeeFilter }),
      };
  
      const result = await Customer.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: groupByField,
            totalRevenue: { $sum: { $toDouble: "$amountPaid" } },
            customerCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } }, 
      ]);
  

      const formattedResult = result.map((data) => {
        let label;
  
        if (timeRange === "yearly") {
          label = `Year ${data._id}`;
        } else if (timeRange === "monthly") {
          label = `Month ${data._id}`;
        } else if (timeRange === "weekly") {
          label = `Week ${data._id}`;
        }
  
        return {
          label,
          totalRevenue: data.totalRevenue,
          customerCount: data.customerCount,
        };
      });
  
      res.status(200).json({ data: formattedResult });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  