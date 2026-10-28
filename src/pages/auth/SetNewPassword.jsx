import { useState } from "react";
import BackArrow from "../../util/BackArrow";
import { LockKeyhole, Eye, EyeOff, CircleCheck } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from 'react-hot-toast';

export default function PasswordChange() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const { updatePassword } = useAuthStore();

  const hasMinimumLength = password.length >= 6;
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasMinimumLength || !hasNumber) {
      alert("Password does not meet the requirements.");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (!email) {
      alert("Email not found in query parameters.");
      return;
    }

    const resetToken = sessionStorage.getItem('resetToken');
    if (!resetToken) {
      console.error("Reset token not found.");
      return;
    }

    const response = await updatePassword({
      email,
      newPassword: password,
      resetToken
    });

    if (response.success) {
      sessionStorage.removeItem('resetToken');
      toast.success(response.message);
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex pl-3 pt-4 gap-3 items-center">
        <BackArrow path="auth/verify-code" />
      </div>
      <div className="flex flex-col items-center mt-20">
        <div className="w-full max-w-md p-8 space-y-2 rounded-2xl ">
          <h1 className="text-2xl font-bold text-center">Reset your password</h1>
          <p className="text-md text-center text-gray-600">Please enter your new password.</p>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div className='relative'>
								<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
									<LockKeyhole size={20} />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									className='border-2 w-full pl-10 p-3 rounded-3xl'
									placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
								/>
								<div
									className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)} 
								</div>
							</div>

              <div className="space-y-3">
                <p className="flex items-center gap-3">
                  {hasMinimumLength && hasNumber ? <CircleCheck className="bg-primary rounded-full"/> : <CircleCheck />} 
                  Your password must contain:
                </p>
                <p className="flex items-center gap-3 ml-9">
                  {hasMinimumLength ? <CircleCheck className="bg-primary rounded-full"/> : <CircleCheck />} 
                  At least 6 characters
                </p>
                <p className="flex items-center gap-3 ml-9">
                  {hasNumber ? <CircleCheck className="bg-primary rounded-full"/> : <CircleCheck />} 
                  At least 1 number
                </p>
              </div>

            <button type="submit" className="btn btn-primary p-5 w-full rounded-3xl">
              Done
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}