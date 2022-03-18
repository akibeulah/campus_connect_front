import React, {Fragment, useState} from 'react'
import {useSelector} from "react-redux";

import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Header = () => {
    const state = useSelector((state) => state)
    const [active, setActive] = useState(false)

    return (
        <>
            <nav className="bg-transparent px-6 pt-4">
                <div className="flex items-center justify-between flex-wrap w-full max-w-7xl mx-auto">
                    <div className="flex items-center flex-shrink-0 mr-12">
                        <span className="font-semibold text-xl text-orange-600 tracking-tight">Campus Connect</span>
                    </div>
                    <div className="hidden flex-row lg:flex flex-grow flex items-center w-auto">
                        <div className="text-sm w-100 flex flex-row lg:flex-grow">
                            <div className="my-auto">
                                {
                                    state.auth.logged_in ?
                                        <>
                                            <a href="/dashboard"
                                               className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                                Dashboard
                                            </a>
                                            <a href="/profile"
                                               className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                                Profile
                                            </a>
                                        </>
                                        :
                                        <>
                                            <a href="/"
                                               className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                                Home
                                            </a>
                                            <a href="/dashboard"
                                               className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                                For Students
                                            </a>
                                            <a href="/dashboard"
                                               className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                                For Merchants
                                            </a>
                                        </>
                                }
                            </div>

                            <div className="ml-auto">
                                <a href="/"
                                   className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                    About
                                </a>
                                <a href="/"
                                   className="block mt-4 text-gray-800 lg:inline-block lg:mt-0 hover:underline mr-4">
                                    Help
                                </a>
                                {
                                    state.auth.logged_in ?
                                        <>
                                            <a href="/logout"
                                               className="block bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-full mt-4 lg:inline-block lg:mt-0 text-white mr-4">
                                                logout
                                            </a>
                                        </>
                                        :
                                        <a href="/login"
                                           className="block bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-full mt-4 lg:inline-block lg:mt-0 text-white mr-4">
                                            Login
                                        </a>
                                }
                            </div>
                        </div>
                        {
                            state.auth.logged_in ?
                                <>
                                    <div>
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button
                                                    className="inline-flex text-white justify-center w-full px-4 py-2">
                                                    <span className="uppercase pr-2">{state.auth.user.last_name},</span>
                                                    <span className="capitalize">{state.auth.user.first_name}</span>
                                                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                                                </Menu.Button>
                                            </div>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items
                                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({active}) => (
                                                                <a href="/profile"
                                                                   className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 block px-4 py-2 text-sm')}>
                                                                    Profile
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({active}) => (
                                                                <a href="/sign-out"
                                                                   className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 block px-4 py-2 text-sm')}>
                                                                    Sign Out
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>

                                        </Menu>
                                    </div>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header