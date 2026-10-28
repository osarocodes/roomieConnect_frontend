import React, { useState, useRef } from 'react';

export const OtpInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow numbers only

    const newOtp = [...otp];
    // Take only the last entered character if multiple characters were entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Call completion callback if all fields are filled
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length && onComplete) {
      onComplete(combinedOtp);
    }

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on Backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return; // Allow numbers only

    const digits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });

    setOtp(newOtp);

    // Focus the box immediately following the pasted digits
    const focusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (newOtp.join('').length === length && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex items-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="size-15 rounded-xl border-2 border-gray-300 text-center text-xl font-medium text-gray-100 outline-none transition-all hover:border-gray-400 focus:border-gray-800 focus:ring-1 focus:ring-gray-800"
        />
      ))}
    </div>
  );
};