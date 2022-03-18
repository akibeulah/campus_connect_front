import React from 'react'

const Footer = () => {
    return (
        <>
            <nav className="bg-transparent p-6 ">
                <div className="flex flex-col container mx-auto md:grid md:grid-cols-2 md:gap-2">
                    <div className="text-center md:text-left md:py-8">
                        <div className="text-black">Campus Connect</div>
                        <div className="text-gray-500">
                            <ul className="list-none">
                                <br/>
                                <li>Your gateway to payment for the future!</li>
                                <br/>
                                <br/>
                                <li>&copy; Oluwaseyi Oluwasanmi. All right reserved</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col py-8 md:grid md:grid-cols-3">
                        <div className="text-center md:text-left py-6 md:py-2">
                            <div className="text-black pb-4">Navigation</div>
                            <div className="text-gray-500">
                                <ul className="list-none break-all">
                                    <li className="py-1">Home</li>
                                    <li className="py-1">For Students</li>
                                    <li className="py-1">For Merchants</li>
                                    <li className="py-1">Help</li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center md:text-left py-6 md:py-2">
                            <div className="text-black pb-4">Legal</div>
                            <div className="text-gray-500">
                                <ul className="list-none break-all">
                                    <li className="py-1">Terms</li>
                                    <li className="py-1">Privacy</li>
                                    <li className="py-1">Cookies</li>
                                    <li className="py-1">Copyright</li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center md:text-left py-6 md:py-2">
                            <div className="text-black pb-4">Contact Us</div>
                            <div className="text-gray-500">
                                <ul className="list-none break-all">
                                    <li className="py-1">24/7 Support</li>
                                    <li className="py-1">info@campusconnect.com</li>
                                    <li className="py-1">+234-808-1245-454</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Footer