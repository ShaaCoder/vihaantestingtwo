import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";

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
    const [showForm, setShowForm] = useState(false);
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
            headers: { "Content-Type": "application/json" },
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
                resetForm();
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
        setShowForm(true);
    };

    const handleDelete = (studentId) => {
        fetch(`/api/students/${studentId}`, { method: "DELETE" }).then(() => {
            setStudents((prevState) =>
                prevState.filter((student) => student._id !== studentId)
            );
        });
    };

    const handleView = (id) => {
        router.push(`/admin/students/${id}`);
    };

    const handleAddStudentClick = () => {
        resetForm();
        setShowForm(true);
    };

    const resetForm = () => {
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
        setShowForm(false);
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
                <form onSubmit={handleSubmit} className="text-black mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            ["Full Name", "fullname"],
                            ["Class", "class"],
                            ["Mobile Number", "mobileNumber"],
                            ["Enrollment Number", "enrollmentNumber"],
                            ["Reference Number", "referenceNumber"],
                            ["Email", "emailId"],
                            ["Balance", "balance"],
                            ["Address", "address"],
                        ].map(([label, name]) => (
                            <div key={name} className="mb-4">
                                <label className="block text-sm font-medium">{label}</label>
                                <input
                                    type={name === "balance" ? "number" : "text"}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                        ))}
                        {/* Courses */}
                        <div className="col-span-2 mb-4">
                            <label className="block text-sm font-medium mb-2">Courses</label>
                            {formData.courses.map((course, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        name="courseCode"
                                        placeholder="Course Code"
                                        value={course.courseCode}
                                        onChange={(e) => handleCourseChange(index, e)}
                                        className="w-1/2 px-4 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={course.subject}
                                        onChange={(e) => handleCourseChange(index, e)}
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
            <div className="overflow-x-auto px-2 sm:px-4">
    <table className="w-full bg-white border border-gray-200 text-black text-sm">
        <thead className="bg-gray-100">
            <tr>
                {["Full Name", "Class", "Mobile Number", "Email", "Actions"].map((header) => (
                    <th
                        key={header}
                        className="py-3 px-4 text-left font-semibold text-gray-700"
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 border-b">
                    <td className="py-2 px-4 whitespace-nowrap">{student.fullname}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{student.class}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{student.mobileNumber}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{student.emailId}</td>
                    <td className="py-2 px-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleEdit(student)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(student._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleView(student._id)}
                                className="text-green-500 hover:text-green-700"
                            >
                                View
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


        </AdminLayout>
    );
}
