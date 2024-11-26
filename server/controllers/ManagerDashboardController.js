// controllers/managerDashboardController.js
import { PDF } from '../models/PDF.js';
import Task from '../models/Task.js';
import { Employee,Customer } from '../models/User.js';
export const getManagerDashboardStats = async (req, res) => {
    try {
        const managerId = req.cookies.employeeId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get all employees under this manager
        const employeesUnderManager = await Employee.find({ 
            'employerName': managerId 
        }).select('_id');
        
        const employeeIds = employeesUnderManager.map(emp => emp._id);

        // Get today's revenue
        const todayCustomers = await Customer.find({
            assignedEmployee: { $in: employeeIds },
            paymentDate: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            paymentStatus: true
        });

        const todayRevenue = todayCustomers.reduce((acc, curr) => {
            return acc + (parseFloat(curr.amountPaid) || 0);
        }, 0);

        // Get last week's revenue for comparison
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekCustomers = await Customer.find({
            assignedEmployee: { $in: employeeIds },
            paymentDate: {
                $gte: lastWeek,
                $lt: today
            },
            paymentStatus: true
        });

        const lastWeekRevenue = lastWeekCustomers.reduce((acc, curr) => {
            return acc + (parseFloat(curr.amountPaid) || 0);
        }, 0);

        // Calculate revenue percentage change
        const revenuePercentageChange = lastWeekRevenue === 0 ? 100 : 
            ((todayRevenue - lastWeekRevenue) / lastWeekRevenue * 100).toFixed(1);

        // Get today's customers count
        const todayCustomersCount = todayCustomers.length;

        // Get last month's customers for comparison
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const lastMonthCustomersCount = await Customer.countDocuments({
            assignedEmployee: { $in: employeeIds },
            createdDateTime: {
                $gte: lastMonth,
                $lt: today
            }
        });

        // Calculate customers percentage change
        const customersPercentageChange = lastMonthCustomersCount === 0 ? 100 :
            ((todayCustomersCount - lastMonthCustomersCount) / lastMonthCustomersCount * 100).toFixed(1);

        // Get today's PDFs
        const todayPDFs = await PDF.countDocuments({
            createdAt: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            generatedBy: { $in: employeeIds }
        });

        // Get yesterday's PDFs for comparison
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayPDFs = await PDF.countDocuments({
            createdAt: {
                $gte: yesterday,
                $lt: today
            },
            generatedBy: { $in: employeeIds }
        });

        // Calculate PDFs percentage change
        const pdfsPercentageChange = yesterdayPDFs === 0 ? 100 :
            ((todayPDFs - yesterdayPDFs) / yesterdayPDFs * 100).toFixed(1);

        // Get total tasks
        const totalTasks = await Task.countDocuments({
            assignedTo: { $in: employeeIds }
        });

        // Get yesterday's tasks for comparison
        const yesterdayTasks = await Task.countDocuments({
            assignedTo: { $in: employeeIds },
            createdAt: {
                $gte: yesterday,
                $lt: today
            }
        });

        // Calculate tasks percentage change
        const tasksPercentageChange = yesterdayTasks === 0 ? 100 :
            ((totalTasks - yesterdayTasks) / yesterdayTasks * 100).toFixed(1);

        // Get weekly revenue data
        const weeklyRevenue = await getWeeklyRevenue(employeeIds);

        // Get monthly PDFs data
        const monthlyPDFs = await getMonthlyPDFs(employeeIds);

        // Get monthly tasks data
        const monthlyTasks = await getMonthlyTasks(employeeIds);

        res.status(200).json({
            stats: {
                todayRevenue: {
                    value: todayRevenue,
                    percentageChange: revenuePercentageChange,
                    trend: revenuePercentageChange >= 0 ? 'up' : 'down'
                },
                todayCustomers: {
                    value: todayCustomersCount,
                    percentageChange: customersPercentageChange,
                    trend: customersPercentageChange >= 0 ? 'up' : 'down'
                },
                todayPDFs: {
                    value: todayPDFs,
                    percentageChange: pdfsPercentageChange,
                    trend: pdfsPercentageChange >= 0 ? 'up' : 'down'
                },
                totalTasks: {
                    value: totalTasks,
                    percentageChange: tasksPercentageChange,
                    trend: tasksPercentageChange >= 0 ? 'up' : 'down'
                }
            },
            charts: {
                weeklyRevenue,
                monthlyPDFs,
                monthlyTasks
            }
        });

    } catch (error) {
        console.error('Error in getManagerDashboardStats:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Helper functions for chart data
async function getWeeklyRevenue(employeeIds) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const weekStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    
    const weeklyData = await Customer.aggregate([
        {
            $match: {
                assignedEmployee: { $in: employeeIds },
                paymentDate: { $gte: weekStart },
                paymentStatus: true
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: '$paymentDate' },
                totalAmount: { $sum: { $toDouble: '$amountPaid' } }
            }
        }
    ]);

    // Format data for chart
    const formattedData = days.map((day, index) => {
        const dayData = weeklyData.find(d => d._id === ((index + 1) % 7 + 1));
        return dayData ? dayData.totalAmount : 0;
    });

    return formattedData;
}

async function getMonthlyPDFs(employeeIds) {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = await PDF.aggregate([
        {
            $match: {
                generatedBy: { $in: employeeIds.map(id => id.toString()) }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                count: { $sum: 1 }
            }
        }
    ]);

    return months.map((month, index) => {
        const monthData = monthlyData.find(d => d._id === index + 4);
        return monthData ? monthData.count : 0;
    });
}

async function getMonthlyTasks(employeeIds) {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = await Task.aggregate([
        {
            $match: {
                assignedTo: { $in: employeeIds }
            }
        },
        {
            $group: {
                _id: { $month: '$startTime' },
                count: { $sum: 1 }
            }
        }
    ]);

    return months.map((month, index) => {
        const monthData = monthlyData.find(d => d._id === index + 4);
        return monthData ? monthData.count : 0;
    });
}