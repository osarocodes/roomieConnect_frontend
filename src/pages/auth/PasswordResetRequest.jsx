import { NavLink } from "react-router-dom";
import BackArrow from "../../util/BackArrow";
import { useAuthStore } from "../../stores/useAuthStore";

const PasswordResetRequest = () => {
    const { requestOtp } = useAuthStore();

    const handleRequestOtp = async (email) => {
        const response = await requestOtp({ email });
        if (response.success) {
            console.log(response.message);
            // Redirect to the OTP verification page with the email as a query parameter
            window.location.href = `/auth/verify-code?email=${encodeURIComponent(email)}`;
        } else {
            console.error(response.message);
        }
    };

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex pl-3 pt-4 gap-3 items-center">
                <BackArrow path='auth/login'/>
            </div>
            <div className="flex flex-col items-center mt-20 min-h-screen">
                <div className="w-full max-w-md p-8 space-y-6 rounded shadow-md">
                    <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
                    <p className="text-sm text-center text-gray-600">
                        Enter your email address below and we'll send you a link to reset your password.
                    </p>
                    <form 
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const email = formData.get("email");
                            handleRequestOtp(email);
                        }}
                        >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-full px-4 py-2 text-white btn-primary rounded hover:btn-primary-100 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Recover password
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-600">
                        Remembered your password? <NavLink to="/auth/login" className="text-blue-600 hover:underline">Log in</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PasswordResetRequest;