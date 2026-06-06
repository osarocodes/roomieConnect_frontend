import { NavLink } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8 items-center text-center">
        <CheckCircle2 className="text-success" size={80} />

        <h1 className="text-2xl font-bold mt-4">Password Changed!</h1>
        <p className="mt-2 mb-6">Your password has been changed successfully</p>
        <NavLink to='/auth/login' className="btn btn-primary">Back to Login</NavLink>
      </div>
    </div>
  )
}
export default SuccessPage;