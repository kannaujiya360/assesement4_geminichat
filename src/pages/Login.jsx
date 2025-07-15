import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { countries } from '../Constants/countries';

const otpSchema = z.object({
  countryCode: z.string().min(1, 'Select country code'),
  phone: z.string().min(10, 'Enter valid phone number').max(15),
  otp: z.string().length(6, 'Enter 6-digit OTP'),
});

function Login() {
  const [loginMode, setLoginMode] = useState('email');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailName, setEmailName] = useState({ email: '', name: '' });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      countryCode: '',
      phone: '',
      otp: '',
    },
  });

  const handleSendOtp = () => {
    const phone = watch('phone');
    const code = watch('countryCode');

    if (!phone || !code) {
      toast.error('Enter valid phone and country code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      toast.success('OTP sent successfully');
      setLoading(false);
    }, 1500);
  };

  const handleOtpSubmit = (data) => {
    if (data.otp !== '123456') {
      toast.error('Invalid OTP');
      return;
    }
    dispatch(login({ phone: data.phone, code: data.countryCode }));
    toast.success('Login successful');
    reset();
    navigate('/');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!emailName.email || !emailName.name) {
      toast.error('Both fields are required');
      return;
    }
    dispatch(login(emailName));
    toast.success('Login successful');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to access your account</p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="flex space-x-1 bg-white dark:bg-gray-800 px-2 rounded-full">
              <button
                onClick={() => setLoginMode('email')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${loginMode === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Email Login
              </button>
              <button
                onClick={() => setLoginMode('otp')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${loginMode === 'otp' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              >
                OTP Login
              </button>
            </div>
          </div>
        </div>

        {loginMode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                placeholder=" "
                value={emailName.name}
                onChange={(e) => setEmailName({ ...emailName, name: e.target.value })}
                className="peer w-full p-4 pt-6 font-light bg-white dark:bg-gray-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
              <label className="absolute text-sm duration-150 transform -translate-y-3 top-5 left-4 text-gray-500 dark:text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 origin-[0]">
                Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder=" "
                value={emailName.email}
                onChange={(e) => setEmailName({ ...emailName, email: e.target.value })}
                className="peer w-full p-4 pt-6 font-light bg-white dark:bg-gray-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
              <label className="absolute text-sm duration-150 transform -translate-y-3 top-5 left-4 text-gray-500 dark:text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 origin-[0]">
                Email
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:shadow-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        )}

        {loginMode === 'otp' && (
          <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-5">
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Country Code</label>
              <select
                className="w-full p-3.5 bg-white dark:bg-gray-700 border-2 rounded-md outline-none transition border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 appearance-none"
                {...register('countryCode')}
              >
                <option value="">Select Country</option>
                {countries.map((c, i) => (
                  <option key={i} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.countryCode && (
                <p className="mt-1 text-xs text-red-500">{errors.countryCode.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="tel"
                placeholder=" "
                {...register('phone')}
                className="peer w-full p-4 pt-6 font-light bg-white dark:bg-gray-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
              <label className="absolute text-sm duration-150 transform -translate-y-3 top-5 left-4 text-gray-500 dark:text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 origin-[0]">
                Phone Number
              </label>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {otpSent && (
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  {...register('otp')}
                  className="peer w-full p-4 pt-6 font-light bg-white dark:bg-gray-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
                <label className="absolute text-sm duration-150 transform -translate-y-3 top-5 left-4 text-gray-500 dark:text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 origin-[0]">
                  OTP (use 123456)
                </label>
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-500">{errors.otp.message}</p>
                )}
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:shadow-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-green-600 to-teal-500 text-white font-medium rounded-md hover:shadow-lg transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Verify & Login
              </button>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;