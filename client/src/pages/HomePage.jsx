import React from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
        {/* Background Image with rotation animation */}
        <div className="absolute inset-0 w-full h-full ">
          <img
            className="absolute opacity-[0.1] pointer-events-none w-full h-full object-cover"
            src="/2.jpg"
            alt=""
          />
        </div>

        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center flex-col items-center text-center lg:text-left z-10">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white gradient-background mb-4">
            Welcome to GJ AI
          </h1>
          <h2 className="text-blue-500 text-2xl sm:text-3xl lg:text-4xl mb-4">
            Powered By Gemini AI
          </h2>
          <h3 className="text-lg sm:text-xl text-center lg:max-w-[70%] text-stone-100 mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus modi voluptatum vel minus in autem corporis. Ea qui ut
            alias earum numquam voluptate eligendi ex voluptatibus. Odit
            excepturi similique architecto.
          </h3>
          <button
            className="cursor-pointer bg-violet-700 px-6 py-3 rounded-2xl hover:bg-violet-800 font-bold text-xl sm:text-2xl text-white transition-colors duration-300"
            onClick={() => navigate("/dashboard")}
          >
            Get Started →
          </button>
        </div>

        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center items-center z-10">
          <div className="aniContainer flex flex-col items-center max-w-full">
            <img
              className="rounded-2xl w-full max-w-md lg:max-w-lg object-contain mb-4"
              src="/robot2.gif"
              alt="Robot"
            />
            <img
              className="max-w-full w-[90%] sm:w-[500px]"
              src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=true&width=500&lines=Hola,+Earthlings!;I+am+GJ+AI,+your+smart+assistant.;How+may+I+help+you+today,+Sire?;Let's+build+something+amazing+together!"
              alt="Typing SVG"
            />
          </div>
        </div>
      </div>
      <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-l  text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="/" className="hover:underline">
              Gunanshu Joshi
            </a>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="mailto:gunanshu02@gmail.com" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
