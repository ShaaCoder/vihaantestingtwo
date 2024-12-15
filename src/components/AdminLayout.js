import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link component from Next.js
import { useState } from "react"; // Import useState for the toggle functionality

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/"); // If the user is unauthenticated, redirect to homepage
        return null; // Return null to prevent rendering further content
    }

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle sign out and redirect to homepage
    const handleSignOut = async () => {
        await signOut({ redirect: false }); // Prevent NextAuth from auto-redirecting
        router.push("/"); // Manually redirect to homepage after signing out
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <aside
                    className={`${
                        isSidebarOpen ? "block" : "hidden"
                    } lg:block w-full lg:w-64 bg-blue-900 text-white min-h-screen p-4 transition-all duration-300`}
                >
                    <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/admin" className="block px-4 py-2 rounded hover:bg-blue-700">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/manage-students" className="block px-4 py-2 rounded hover:bg-blue-700">
                                    Manage Students
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/reports" className="block px-4 py-2 rounded hover:bg-blue-700">
                                    Reports
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-4 text-white bg-blue-900 fixed top-4 right-4 z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <header className="bg-white p-4 rounded shadow mb-6">
                        <h1 className="text-2xl font-bold">
                            Welcome, {session?.user?.name || "Admin"}!
                        </h1>
                    </header>

                    {/* Content */}
                    {children}
                </main>
            </div>
        </div>
    );
}
