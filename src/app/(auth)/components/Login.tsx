import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login } from '../../../services/authService';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { LoginData } from '@/types/Login';
import { loginDataSchema } from '@/schema/loginDataSchema';

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setIsSubmitting(true);

    // Form validation
    try {
      loginDataSchema.parse(formData);
      
    } catch (err) {
      const error = err as ZodError; // Type assertion to ZodError
      const field = error.errors[0]?.path[0];
      const message = error.errors[0]?.message;
      setValidationErrors((prev) => ({ ...prev, [field]: message }));
      setIsSubmitting(false);
      return;
    }

    // API call
    try {
      const response = await login(formData);
      console.log(response);

      // Store token in cookies
      // document.cookie = `token=${response.token}; path=/; Secure; HttpOnly`;  // Add Secure and HttpOnly for better security

      document.cookie = `token=${response.token}; path=/;`;
      console.log('Current Cookies:', document.cookie);

      localStorage.setItem('user', JSON.stringify(response?.data)); // Store user in localStorage
      localStorage.setItem('username', formData.username); 
      
      router.push('/dashboard');
      toast.success('Logged in successfully!', { autoClose: 1000 });
    
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || 'Login failed. Please try again.', { autoClose: 1000 });
      } else {
        toast.error('Login failed. Please try again.', { autoClose: 1000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 rounded-lg -mt-32 ">
        <div className="flex justify-center mb-6">
          <Image src="/tiamed1.svg" alt="Lab Management System" width={80} height={80} />
        </div>

        <h2 className="text-center text-2xl font-bold text-indigo-800">Welcome Back!</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to your Lab Management System account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative mt-1">
              <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border border-gray-300 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {validationErrors.username && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.username}</div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border border-gray-300 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {validationErrors.password && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.password}</div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Forgot your password?{' '}
          <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Reset here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
  