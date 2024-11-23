import { PDF as Pdfs } from '../models/PDF.js'
import Expenses from "../models/Expenses.js"
import { Customer } from '../models/User.js';
import Expense from '../models/Expenses.js';

export const getPdfsGenByEmployee = async (req, res) => {
  try {
    const { range } = req.query;
    const date1 = new Date();
    const date2 = new Date();

    // Date range calculation remains the same as previous implementation
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
        $match: { createdAt: { $gte: date1, $lte: date2 } }
      },
      {
        $group: {
          _id: "$generatedBy",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "firstName",
          as: "employee"
        }
      },
      {
        $unwind: {
          path: "$employee",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          employeeName: {
            $ifNull: [
              { $concat: ["$employee.firstName", " ", "$employee.lastName"] },
              null
            ]
          },
          count: 1
        }
      }
    ]);

    const filteredData = results.filter((data) => data.employeeName);
    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

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

    // Define all months and other time periods
    const ALL_MONTHS = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const WEEKS_IN_YEAR = 52;
    const YEARS_TO_SHOW = 5;

    // Determine the date range based on the timeRange filter
    const now = new Date();
    let startDate, endDate, groupByField, mappingFunction;

    if (timeRange === "yearly") {
      startDate = new Date(now.getFullYear() - (YEARS_TO_SHOW - 1), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $year: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: `${data._id}`,
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else if (timeRange === "monthly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $month: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: ALL_MONTHS[data._id - 1],
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else if (timeRange === "weekly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $week: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: `Week ${data._id}`,
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else {
      return res.status(400).json({ message: "Invalid time range specified." });
    }

    // Match criteria based on employee filter and payment status
    const matchCriteria = {
      createdDateTime: { $gte: startDate, $lte: endDate },
      paymentStatus: true,
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

    // Create a complete dataset with all periods
    let completeResult;
    if (timeRange === "monthly") {
      completeResult = ALL_MONTHS.map((month, index) => {
        const matchedData = result.find(r => r._id === index + 1);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: month, totalRevenue: 0, customerCount: 0 };
      });
    } else if (timeRange === "yearly") {
      const years = Array.from(
        { length: YEARS_TO_SHOW },
        (_, i) => now.getFullYear() - (YEARS_TO_SHOW - 1) + i
      );
      completeResult = years.map(year => {
        const matchedData = result.find(r => r._id === year);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: `${year}`, totalRevenue: 0, customerCount: 0 };
      });
    } else if (timeRange === "weekly") {
      const weeks = Array.from(
        { length: WEEKS_IN_YEAR },
        (_, i) => i + 1
      );
      completeResult = weeks.map(week => {
        const matchedData = result.find(r => r._id === week);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: `Week ${week}`, totalRevenue: 0, customerCount: 0 };
      });
    }

    res.status(200).json({ data: completeResult });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const parseDateParams = (fromDate, toDate) => {
  const query = {};
  if (fromDate) {
    query.createdAt = { $gte: new Date(fromDate) };
  }
  if (toDate) {
    query.createdAt = { ...query.createdAt, $lte: new Date(toDate) };
  }
  return query;
};

export const pdfGeneratedByEmployee = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const dateQuery = parseDateParams(fromDate, toDate); // Helper to handle date range filtering

    const pdfStats = await Pdfs.aggregate([
      // Match PDFs within the date range
      { $match: dateQuery },
      // Group by EmployeeGenerated and count the PDFs
      {
        $group: {
          _id: '$EmployeeGenerated',
          count: { $sum: 1 },
        },
      },
      // Lookup employee details from the Employee collection
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      // Format the response to include necessary employee details
      {
        $project: {
          employeeId: '$_id',
          count: 1,
          employeeDetails: {
            $arrayElemAt: ['$employeeDetails', 0],
          },
        },
      },
      // Include formatted employee details in the response
      {
        $project: {
          count: 1,
          employeeName: {
            $concat: [
              '$employeeDetails.firstName',
              ' ',
              '$employeeDetails.lastName',
            ],
          },
          email: '$employeeDetails.email',
          phone: '$employeeDetails.phone',
          city: '$employeeDetails.city',
          role: '$employeeDetails.role',
        },
      },
    ]);

    res.status(200).json(pdfStats);
  } catch (error) {
    console.error('Error fetching PDF statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const expensesEmployee = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const dateQuery = parseDateParams(fromDate, toDate);

    // First get all customers with their assigned employees
    const customerData = await Customer.find(dateQuery)
      .populate('assignedEmployee', 'firstName lastName')
      .select('assignedEmployee amountPaid');

    // Group expenses by employee
    const expensesByEmployee = {};
    customerData.forEach(customer => {
      if (customer.assignedEmployee) {
        const employeeName = `${customer.assignedEmployee.firstName} ${customer.assignedEmployee.lastName}`;
        if (!expensesByEmployee[employeeName]) {
          expensesByEmployee[employeeName] = 0;
        }
        // Add any associated expenses
        if (customer.amountPaid) {
          expensesByEmployee[employeeName] += parseFloat(customer.amountPaid) * 0.3; // Assuming 30% of revenue goes to expenses
        }
      }
    });

    // Get additional expenses from expense collection
    const additionalExpenses = await Expense.aggregate([
      { $match: dateQuery },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $group: {
          _id: {
            firstName: { $arrayElemAt: ['$employee.firstName', 0] },
            lastName: { $arrayElemAt: ['$employee.lastName', 0] }
          },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Combine both types of expenses
    additionalExpenses.forEach(expense => {
      const employeeName = `${expense._id.firstName} ${expense._id.lastName}`;
      if (!expensesByEmployee[employeeName]) {
        expensesByEmployee[employeeName] = 0;
      }
      expensesByEmployee[employeeName] += expense.totalAmount;
    });

    const result = Object.entries(expensesByEmployee).map(([employeeName, totalAmount]) => ({
      employeeName,
      totalAmount
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching expense data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const revenueEmployee = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const dateQuery = parseDateParams(fromDate, toDate);

    const revenueData = await Customer.aggregate([
      { $match: dateQuery },
      {
        $lookup: {
          from: 'employees',
          localField: 'assignedEmployee',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $group: {
          _id: {
            firstName: { $arrayElemAt: ['$employee.firstName', 0] },
            lastName: { $arrayElemAt: ['$employee.lastName', 0] }
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', true] },
                { $toDouble: '$amountPaid' },
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          employeeName: {
            $concat: ['$_id.firstName', ' ', '$_id.lastName']
          },
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}