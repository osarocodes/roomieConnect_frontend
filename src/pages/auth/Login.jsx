import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { EyeOff, Eye, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import toast from 'react-hot-toast';
import Nav from '../../util/Nav';

export default function Login() {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
		identity: {
			email: '', 
		},
		auth: {
			password: '' 
		}
    });
	const { login, isLoggingIn, authUser } = useAuthStore();
	const { matches } = useMatchStore();

	useEffect(() => {
		if (authUser) {
			navigate('/home');
		}
	}, [authUser, navigate]);

	const validateForm = () => {
        if (!formData.identity.email.trim()) {
			toast.error('Email is required');
			return false;
		}
        if (!/\S+@\S+\.\S+/.test(formData.identity.email)) {
			toast.error('Email is invalid');
			return false;
		}
        if (!formData.auth.password) {
			toast.error('Password is required');
			return false;
		}
        if (formData.auth.password.length < 6) {
			toast.error('Password must be at least 6 characters');
			return false;
		}

        return true;
    }

	const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (typeof login === 'function') {
				await login(formData).then((success) => {
					if (success) {
						if (matches.length > 0) {
							navigate('/home');
							return;
						}
						navigate('/roommie-finder');
					}
				});
            };
        }
    }

	return (
		<div className="min-h-screen ">
			<Nav />
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className='w-full max-w-md space-y-8'>
					{/* Logo */}
					<div className='text-center mb-8'>
						<div className="flex flex-col items-start gap-1 group">
							<h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
							{/* <p>{validateForm()}</p> */}
							<p className='text-[#f5f5dc8f]'>Sign in to your account</p>
						</div>
					</div>
					<form onSubmit={handleSubmit} noValidate>
						<div className="space-y-3">
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
									<Mail size={20} />
								</div>
								<input
									type="email"
									placeholder="Email Address"
									className="border w-full pl-10 p-2 rounded-md"
									value={formData.identity.email}
									onChange={(e) => setFormData(prev => ({ 
										...prev, 
										identity: { 
											...prev.identity, 
											email: e.target.value 
										}}))}
								/>
							</div>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
									<Lock size={20} />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									className='border w-full pl-10 p-2 rounded-md'
									placeholder='Enter your password'
									value={formData.auth.password}
									onChange={(e) => setFormData(prev => ({ 
										...prev, 
										auth: { 
											...prev.auth, 
											password: e.target.value 
										}}))}
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
						</div>
						<div className="flex items-center justify-between">
							<NavLink to="/auth/forgot-password" className="text-sm hover:underline">Forgot password</NavLink>
						</div>
						<button type="submit" className="btn btn-primary w-[60%] mt-10 cursor-pointer" disabled={isLoggingIn}>
							{isLoggingIn ? (
								<div className='flex text-center align-center justify-center'>
									<Loader2 className="size-5 mr-2 animate-spin" />
									Loading...
								</div>
								) : (
									"Login"
								)}
						</button>
					</form>
			</div>
		</div>
    </div>
)}