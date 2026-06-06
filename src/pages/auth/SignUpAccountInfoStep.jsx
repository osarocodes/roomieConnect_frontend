import { Mail } from 'lucide-react';
import { useState } from 'react';
import { EyeOff, Eye, Lock } from 'lucide-react';


const AccountInfo = ({ formData, handleChange, registerRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mt-2">Hello there,</h2>
      <p className="text-[#f5f5dc8f]">We are excited to have you here, let's get you started.</p>
      <div className="my-10 space-y-2.5">
        <div className="relative" ref={(el) => registerRef('email', el)}>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Mail size={20} />
          </div>
          <input type="email" 
            name="email"
            id="email"
            value={formData.identity.email}
            onChange={handleChange('identity')}
            className=" w-full pl-10 py-2 rounded-lg border "
            placeholder="Email Address"
            autoComplete='email'
          />
        </div>

        <div className='relative' ref={(el) => registerRef('password', el)}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="size-5" />
          </div>
          <input
            name='password'
            type={showPassword ? 'text' : 'password'}
            className='border w-full pl-10 py-2 rounded-lg'
            placeholder='Enter your password'
            value={formData.auth.password}
            onChange={handleChange('auth')}
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

        <div className='relative' ref={(el) => registerRef('confirmPassword', el)}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="size-5" />
          </div>
          <input
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            className='border w-full pl-10 py-2 rounded-lg'
            placeholder='confirm your password'
            value={formData.auth.confirmPassword}
            onChange={handleChange('auth')}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-5 text-base-content/40" />
            ) : (
              <Eye className="size-5 text-base-content/40" />
            )} 
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountInfo