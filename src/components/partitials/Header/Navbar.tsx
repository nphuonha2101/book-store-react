import { useState } from "react";
import { ListItem } from "./ListItem";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className={`flex w-full items-center bg-white dark:bg-dark sticky top-0 z-50`}>
            <div className="container">
                <div className="relative -mx-4 flex items-center justify-between">
                    <div className="w-60 max-w-full px-4">
                        <a href="/#" className="block w-full py-5">
                            <img
                                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
                                alt="logo"
                                className="dark:hidden"
                            />
                            <img
                                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                                alt="logo"
                                className="hidden dark:block"
                            />
                        </a>
                    </div>
                    <div className="flex w-full items-center justify-between px-4">
                        <div>
                            <button
                                onClick={() => setOpen(!open)}
                                id="navbarToggler"
                                className={` ${open && "navbarTogglerActive"
                                    } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                            </button>
                            <nav
                                id="navbarCollapse"
                                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"
                                    } `}
                            >
                                <ul className="block lg:flex lg:space-x-8 lg:items-center lg:justify-end">
                                    <ListItem NavLink="/#">Home</ListItem>
                                    <ListItem NavLink="/#">Payment</ListItem>
                                    <ListItem NavLink="/#">About</ListItem>
                                    <ListItem NavLink="/#">Blog</ListItem>
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                            {/* Search Bar */}
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-dark-2 dark:text-white"
                                />
                                <button className="absolute right-3 text-gray-500 hover:text-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <Link
                                to="/signin"
                                className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
                            >
                                Sign in
                            </Link>
                            <a
                                href="/#"
                                className="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
