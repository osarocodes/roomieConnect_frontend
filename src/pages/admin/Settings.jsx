// src/pages/admin/Settings.jsx
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <>
      <div className="flex items-center justify-self-start gap-12 ">
          <Link to='/admin/dashboard'><ArrowLeft fontSize={30} className="mx-auto cursor-pointer" /></Link>
          <h1 className="text-center text-[1.8rem] font-medium my-4">Update Settings</h1>
      </div>

      <div className="flex flex-col gap-6 mt-6"></div>
        <Link to="/admin/settings/profile" className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow">
          <span className="text-lg">Profile Settings</span>
          <ArrowRight fontSize={24} className="text-gray-500" />
        </Link>
    </>
  );
}