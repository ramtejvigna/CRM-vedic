import {PDF as Pdfs} from '../models/PDF.js'
export const getPdfsGenByEmployeeToday = async (req , res) => {
    try {
        const date = new Date();
        date.setHours(0 , 0 , 0 , 0);
        const results = await Pdfs.aggregate([
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