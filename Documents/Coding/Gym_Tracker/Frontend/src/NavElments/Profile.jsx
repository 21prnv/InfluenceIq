import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../NavBar';

const Profile = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate("/login");
    };

    useEffect(() => {
        document.title = `${userName}'s Profile`;
    }, [userName]);

    return (
        <>
            <NavBar />
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center py-16 px-6 md:px-20 gap-10 bg-gray-100 min-h-screen text-center md:text-left">
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.img
                        className="h-48 w-48 md:h-72 md:w-72 rounded-full shadow-lg"
                        src="https://i.imgur.com/XZwx7QS.jpeg"
                        alt="Profile"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    />
                </motion.div>

                <motion.div
                    className="w-full md:w-[50%] h-auto py-16 px-4 md:px-10 flex flex-col items-center md:items-start"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {userName && (
                        <div className="mb-6">
                            <motion.p
                                className="font-semibold text-3xl md:text-4xl mb-2 text-gray-800"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Name: {userName}
                            </motion.p>
                            <motion.p
                                className="font-semibold text-2xl md:text-3xl text-gray-600"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Email: {userEmail}
                            </motion.p>
                        </div>
                    )}
                    <motion.button
                        onClick={handleLogOut}
                        className="mt-4 w-32 py-2 text-white bg-black font-semibold rounded-md hover:bg-gray-600  transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        Logout
                    </motion.button>
                </motion.div>
            </div>
        </>
    );
};

export default Profile;
