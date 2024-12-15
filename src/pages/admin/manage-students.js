import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        fullname: "",
        class: "",
        mobileNumber: "",
        enrollmentNumber: "",
        referenceNumber: "",
        emailId: "",
        balance: "",
        address: "",
        courses: [],
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to show or hide the form
    const router = useRouter();

    useEffect(() => {
        fetch("/api/students")
            .then((response) => response.json())
            .then((data) => setStudents(data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCourseChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCourses = [...formData.courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            [name]: value,
        };
        setFormData((prevState) => ({
            ...prevState,
            courses: updatedCourses,
        }));
    };

    const handleAddCourse = () => {
        setFormData((prevState) => ({
            ...prevState,
            courses: [...prevState.courses, { courseCode: "", subject: "" }],
        }));
    };

    const handleRemoveCourse = (index) => {
        const updatedCourses = formData.courses.filter((_, i) => i !== index);
        setFormData((prevState) => ({
            ...prevState,
            courses: updatedCourses,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = editingStudent ? "PUT" : "POST";
        const url = editingStudent
            ? `/api/students/${editingStudent._id}`
            : "/api/students";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setStudents((prevState) => {
                    if (editingStudent) {
                        return prevState.map((student) =>
                            student._id === editingStudent._id ? data : student
                        );
                    } else {
                        return [...prevState, data];
                    }
                });
                setFormData({
                    fullname: "",
                    class: "",
                    mobileNumber: "",
                    enrollmentNumber: "",
                    referenceNumber: "",
                    emailId: "",
                    balance: "",
                    address: "",
                    courses: [],
                });
                setEditingStudent(null);
                setShowForm(false); // Hide the form after submission
            });
    };

    const handleEdit = (student) => {
        setFormData({
            fullname: student.fullname,
            class: student.class,
            mobileNumber: student.mobileNumber,
            enrollmentNumber: student.enrollmentNumber,
            referenceNumber: student.referenceNumber,
            emailId: student.emailId,
            balance: student.balance,
            address: student.address,
            courses: student.courses || [],
        });
        setEditingStudent(student);
        setShowForm(true); // Show form for editing
    };

    const handleDelete = (studentId) => {
        fetch(`/api/students/${studentId}`, {
            method: "DELETE",
        }).then(() => {
            setStudents((prevState) =>
                prevState.filter((student) => student._id !== studentId)
            );
        });
    };

    const handleView = (id) => {
        router.push(`/admin/students/${id}`);
    };

    const handleAddStudentClick = () => {
        setShowForm(true); // Show form for adding a new student
        setEditingStudent(null); // Ensure it's not in edit mode
        setFormData({
            fullname: "",
            class: "",
            mobileNumber: "",
            enrollmentNumber: "",
            referenceNumber: "",
            emailId: "",
            balance: "",
            address: "",
            courses: [],
        });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4 text-black">
                {editingStudent ? "Edit Student" : "Manage Students"}
            </h1>

            {/* Button to toggle form visibility */}
            <button
                onClick={handleAddStudentClick}
                className="bg-green-500 text-white px-4 py-2 rounded mb-6"
            >
                Add Student
            </button>

            {/* Conditionally render the form */}
            {showForm && (
                <form onSubmit={handleSubmit} className='text-black'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Class */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Class</label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Mobile Number</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Enrollment Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Enrollment Number</label>
                            <input
                                type="text"
                                name="enrollmentNumber"
                                value={formData.enrollmentNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Reference Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Reference Number</label>
                            <input
                                type="text"
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Balance */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Balance</label>
                            <input
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Courses */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Courses</label>
                            {formData.courses.map((course, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        name="courseCode"
                                        value={course.courseCode}
                                        onChange={(e) => handleCourseChange(index, e)}
                                        placeholder="Course Code"
                                        className="w-1/2 px-4 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="subject"
                                        value={course.subject}
                                        onChange={(e) => handleCourseChange(index, e)}
                                        placeholder="Subject"
                                        className="w-1/2 px-4 py-2 border rounded-md"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCourse(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddCourse}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Add Course
                            </button>
                        </div>

                        <div className="col-span-2 text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {editingStudent ? "Update Student" : "Add Student"}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Table for displaying the list of students */}
            <table className="min-w-full bg-white border border-black-200 text-black">
    <thead className="bg-gray-100">
        <tr>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Full Name</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Class</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Mobile Number</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Email</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Actions</th>
        </tr>
    </thead>
    <tbody>
        {students.map((student) => (
            <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{student.fullname}</td>
                <td className="py-4 px-6">{student.class}</td>
                <td className="py-4 px-6">{student.mobileNumber}</td>
                <td className="py-4 px-6">{student.emailId}</td>
                <td className="py-4 px-6">
                    <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-500 hover:text-red-700 mr-3"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => handleView(student._id)}
                        className="text-green-500 hover:text-green-700"
                    >
                        View
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

        </AdminLayout>
    );
}
