import React from 'react'

import bg_svg from '../assets/svg/cool-background.svg'

const Home = () => {

    return (
        <div style={{ background: `url(${bg_svg}) center/cover no-repeat` }}>
            <section className="max-w-7xl mx-auto">
                <div className="lg:h-screen pt-8 mb-48 md:mb-72 lg:mb-0 flex flex-col lg:flex-row px-8">
                    <div className="my-auto w-full lg:w-1/2 text-center font-medium lg:font-light lg:text-left">
                        <div className="text-gray-800 text-4xl md:text-6xl leading-loose">
                            One card <span className="text-orange-600">for your everyday</span> transactional needs
                        </div>
                        <div className="py-4 md:py-1 text-lg text-gray-700 capitalize">Your gateway to payment for - The Future
                        </div>
                        <div className="py-4 md:py-1 text-sm text-gray-500">CONVENIENT - RELIABLE - SECURE</div>
                        <div className="py-2">
                            <a href="/login"
                               className="block text-sm bg-gray-600 hover:bg-gray-800 max-w-2xl mx-auto lg:mr-4 text-white font-bold py-3 px-10 rounded-full mt-4 lg:inline-block lg:mt-0 text-white">
                                Login
                            </a>
                        </div>
                    </div>
                    <div className="my-auto w-full my-8 sm:my-16 md:my-28 lg:my-0 lg:w-1/2 stacked-container">
                        <div
                            className="base-img border-2 rounded-3xl mx-auto absolute w-36 h-52 md:h-96 md:w-60 border-gray-500">
                            <div className="abs-img border-2 rounded-3xl w-36 h-52 md:h-96 md:w-60 border-gray-500"/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home