import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion"; // Import motion for animation
import AdminLayout from "../../components/AdminLayout"; // Import AdminLayout

export default function AdminIndex() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login page if not authenticated


  // Loading state if session is still being fetched
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Main Content for Admin Home */}
        <motion.header
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl font-bold text-blue-800">Welcome to the Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Hello, {session?.user?.name || "Admin"}! Here is your dashboard overview.
          </p>
        </motion.header>

        <section>
          {/* Updates Section */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xl font-semibold text-blue-700">Important Updates</h2>
            <p className="mt-2 text-gray-700">
              Stay tuned for upcoming features and improvements. We're working hard to make your experience better.
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">Total Students</h3>
              <p className="text-2xl font-bold text-blue-600">500</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">New Enrollments</h3>
              <p className="text-2xl font-bold text-green-600">50</p>
            </motion.div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
