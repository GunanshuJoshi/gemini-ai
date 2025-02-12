import { SignIn } from "@clerk/clerk-react";
import React from "react";

export const Signin = () => {
  return (
    <div className="w-full h-full flex justify-center mt-10">
      <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
    </div>
  );
};
