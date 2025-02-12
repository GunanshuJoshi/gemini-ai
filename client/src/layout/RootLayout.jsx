import React from "react";
import { Link, Outlet, useNavigate } from "react-router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();
const RootLayout = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout flex flex-col min-h-screen w-full bg-gray-900">
          <header className="flex flex-row justify-between px-20 my-5">
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                className="bg-transparent w-20"
                src="/gemini-logo.png"
                alt="logo"
              />
              <span className="font-bold text-2xl text-blue-600">
                GJ <br />
                AI
              </span>
            </Link>
            <div className="user flex items-center">
              <SignedIn>
                <UserButton
                  mode="modal"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                />
              </SignedIn>
              <SignedOut className="flex flex-row">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign In
                </button>
                <button
                  className="bg-blue-500 ml-5 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up
                </button>
              </SignedOut>
            </div>
          </header>
          <main className="w-full flex-1 overflow-hidden ">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
