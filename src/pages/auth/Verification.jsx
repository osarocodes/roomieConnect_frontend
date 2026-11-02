import { useEffect, useState } from "react";
import BackArrow from "../../util/BackArrow";
import { OtpInput } from '../../components/authComponent/OtpInput';
import { useAuthStore } from "../../stores/useAuthStore";
import toast from 'react-hot-toast';

export default function Verification() {
  const [countdown, setCountdown] = useState(10 * 60 * 1000);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [otpInputKey, setOtpInputKey] = useState(0);
  const { verifyOtp, requestOtp } = useAuthStore();
  const email = new URLSearchParams(window.location.search).get("email");

  useEffect(() => {
    if (countdown <= 0) return undefined;

    const timer = setTimeout(() => {
      setCountdown((remaining) => Math.max(0, remaining - 1000));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOtp = async (otp) => {
    if (!email) {
      toast.error("Email not found in the page URL.");
      return;
    }

    const response = await verifyOtp({ email, otp });
    if (response.success) {
      toast.success(response.message);
      sessionStorage.setItem('resetToken', response.resetToken);
      window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}`;
    } else {
      toast.error(response.message);
    }
  };

  const resendOTP = async () => {
    if (!email) {
      setResendError("Email not found in the page URL.");
      return;
    }

    setIsResending(true);
    setResendError("");
    try {
      const response = await requestOtp({ email });
      if (response.success) {
        setCountdown(10 * 60 * 1000);
        setOtpInputKey((key) => key + 1);
      } else {
        setResendError(response.message || "Could not resend the code. Please try again.");
      }
    } catch {
      setResendError("Could not resend the code. Please try again.");
    } finally {
      setIsResending(false);
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
              <OtpInput key={otpInputKey} length={4} onComplete={(otp) => handleVerifyOtp(otp)} />
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
              disabled={isResending}
              className="btn w-full px-4 py-2 text-white rounded hover:btn-secondary-100 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={resendOTP}
            >
              {isResending ? "Sending..." : "Send Again"}
            </button>
            {resendError && (
              <p className="text-sm text-center text-error" role="alert">
                {resendError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}