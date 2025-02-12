import { SignUp } from "@clerk/clerk-react";
import React from "react";

const Signup = () => {
  return (
    <div className="w-full h-full flex justify-center mt-10">
      <SignUp path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default Signup;
