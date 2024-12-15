import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const students = await Student.find({});
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching students', error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { fullname, class: studentClass, mobileNumber, enrollmentNumber, referenceNumber, emailId, balance, address, courses } = req.body;

            // Basic validation for required fields
            if (!fullname || !studentClass || !mobileNumber || !enrollmentNumber || !emailId || !balance || !address || !courses || !Array.isArray(courses) || courses.length === 0) {
                return res.status(400).json({ message: 'All fields are required, and courses must be a non-empty array' });
            }

            // Validate each course object
            for (const course of courses) {
                if (!course.courseCode || !course.subject) {
                    return res.status(400).json({ message: 'Each course must have a courseCode and subject' });
                }
            }

            // Log courses to confirm correct data
            console.log('Courses received:', courses);

            // Create new student
            const student = await Student.create({
                fullname,
                class: studentClass,
                mobileNumber,
                enrollmentNumber,
                referenceNumber,
                emailId,
                balance,
                address,
                courses // Save the courses as an array of objects
            });

            // Send back the created student data
            res.status(201).json(student);
        } catch (error) {
            // Log the error and send a detailed message back
            console.error('Error creating student:', error);
            res.status(500).json({ message: 'Error creating student', error: error.message });
        }
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
