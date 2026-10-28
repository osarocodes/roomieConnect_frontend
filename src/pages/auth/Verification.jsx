import { useEffect, useState } from "react";
import BackArrow from "../../util/BackArrow";
import { OtpInput } from '../../components/authComponent/OtpInput';
import { useAuthStore } from "../../stores/useAuthStore";
import toast from 'react-hot-toast';

export default function Verification() {
  const [countdown, setCountdown] = useState(10*60*1000); // 10 minutes countdown
  const { verifyOtp } = useAuthStore();
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = async (otp) => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (!email) {
      alert("Email not found in query parameters.");
      return;
    }

    const response = await verifyOtp({ email, otp });
    if (response.success) {
      toast.success(response.message);
      // Redirect to the password reset page with the email as a query parameter
      sessionStorage.setItem('resetToken', response.resetToken);
      window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}`;
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex pl-3 pt-4 gap-3 items-center">
        <BackArrow path='auth/forgot-password'/>
      </div>

      <div className="flex flex-col items-center mt-25">
        <div className="w-full max-w-md p-8 space-y-2 rounded-2xl ">
          <h1 className="text-2xl font-bold text-center">Check your email</h1>
          <p className="text-md text-center text-gray-600">We've sent the code to your email</p>

          <form className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-3">
              <OtpInput length={4} onComplete={(otp) => handleVerifyOtp(otp)} />
            </div>

            <p className="text-sm mt-10 text-center text-gray-300">
              Code expires in <span className="font-bold text-gray-500">{Math.floor(countdown / 1000 / 60)}:{String(Math.floor(countdown / 1000 % 60)).padStart(2, '0')}</span>
            </p>
            <button 
              type="submit"
              className="btn w-full px-4 py-2 text-white btn-primary rounded hover:btn-primary-100 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Verify
            </button>
            <button 
              type="button"
              className="btn w-full px-4 py-2 text-white rounded hover:btn-secondary-100 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Send Again
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}