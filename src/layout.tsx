import {Link, Outlet} from "react-router-dom";
import React, {useState} from "react";
import {useCartStore} from "./store/cart-store";

export default function Layout() {
    const cartStore = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen w-full">
            {/* Header */}
            <nav className="w-screen bg-white shadow-lg">
                <div className="w-full max-w-[1200px] md:max-w-none md:w-[95%] lg:w-[90%] mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center py-4">
                            <Link to="/" className="text-xl font-bold text-gray-800">
                                SHOP THẦY ĐĂNG
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="mobile-menu-button p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen 
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">

                            <Link to={'/checkout'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300 flex items-center">
                                Checkout 
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {cartStore.list.length}
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                        <div className="flex flex-col space-y-2 pb-4">
                            <Link to={'/'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300">
                                Home
                            </Link>
                            <Link to={'/products'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300">
                                Products
                            </Link>
                            <Link to={'/about'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300">
                                About
                            </Link>
                            <Link to={'/dashboard'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300">
                                Dashboard
                            </Link>
                            <Link to={'/contact'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300">
                                Contact
                            </Link>
                            <Link to={'/checkout'} className="py-2 px-3 text-gray-700 hover:text-blue-500 transition duration-300 flex items-center">
                                Checkout 
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {cartStore.list.length}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="w-screen">
                <div className="w-full max-w-[1200px] md:max-w-none md:w-screen lg:w-screen mx-auto px-4">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}