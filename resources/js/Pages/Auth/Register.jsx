import InputError from "@/components/ui/Form/InputError";
import InputLabel from "@/components/ui/Form/InputLabel";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import TextInput from "@/components/ui/Form/TextInput";
import ApplicationLogo from "@/components/shared/ApplicationLogo";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="min-h-screen flex">
                    {/* Left Side - Hero Section */}
                    <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
                        {/* Background with gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent"></div>
                        <div className="absolute inset-0 bg-black/10"></div>

                        {/* Decorative elements */}
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-32 right-32 w-48 h-48 bg-accent-light/20 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
                            {/* Logo */}

                            <Link href={"/"} className="mb-12">
                                <img
                                    src="/images/logo-cropped.svg"
                                    alt="LOD University"
                                    className="w-64"
                                />
                            </Link>

                            {/* Hero Content */}
                            <div className="max-w-lg">
                                <h1 className="text-5xl font-bold mb-6 leading-tight">
                                    Start Your
                                    <span className="block text-accent-light">
                                        Academic Journey
                                    </span>
                                </h1>
                                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                    Join our vibrant community of learners and
                                    unlock your potential with world-class
                                    education and personalized learning
                                    experiences at LOD University.
                                </p>

                                {/* Statistics */}
                                <div className="grid grid-cols-3 gap-8 mb-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                            25K+
                                        </div>
                                        <div className="text-sm text-white/70">
                                            Active Students
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                            200+
                                        </div>
                                        <div className="text-sm text-white/70">
                                            Programs
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                            95%
                                        </div>
                                        <div className="text-sm text-white/70">
                                            Job Placement
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-accent-light rounded-full"></div>
                                        <span className="text-white/90">
                                            Personalized learning paths
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-accent-light rounded-full"></div>
                                        <span className="text-white/90">
                                            Expert faculty guidance
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-accent-light rounded-full"></div>
                                        <span className="text-white/90">
                                            Industry-relevant curriculum
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-12 bg-white">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo - Only shown on mobile */}
                            <div className="lg:hidden text-center mb-8">
                                <div className="inline-flex items-center justify-center mb-4">
                                    <ApplicationLogo className="w-32 h-32" />
                                </div>
                            </div>

                            {/* Welcome Text */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#365b6d] to-[#2a4a5a] bg-clip-text text-transparent mb-2">
                                    Create Account
                                </h2>
                                <p className="text-gray-600">
                                    Join thousands of students in their learning
                                    journey
                                </p>
                            </div>

                            {/* Register Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Full Name"
                                        className="text-gray-700 font-medium mb-2 block"
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email Address"
                                        className="text-gray-700 font-medium mb-2 block"
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="text-gray-700 font-medium mb-2 block"
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Create a strong password"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Password Confirmation Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                        className="text-gray-700 font-medium mb-2 block"
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CheckCircle className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            type={
                                                showPasswordConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPasswordConfirmation(
                                                        !showPasswordConfirmation
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                                aria-label={
                                                    showPasswordConfirmation
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <PrimaryButton
                                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary focus:from-primary-dark focus:to-primary transition-all duration-200 py-4 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Creating account...
                                            </div>
                                        ) : (
                                            "Create Your Account"
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link
                                        href={route("login")}
                                        className="text-primary hover:text-primary-dark font-semibold transition-colors duration-200"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>

                            {/* Social Login Divider */}
                            {/* <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or register with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="ml-2">Google</span>
                                    </button>
                                    <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span className="ml-2">Facebook</span>
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Mobile Statistics - Shown only on mobile */}
                <div className="lg:hidden bg-gradient-to-r from-primary to-primary-dark py-8">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-3 gap-4 text-center text-white">
                            <div>
                                <div className="text-2xl font-bold mb-1">
                                    25K+
                                </div>
                                <div className="text-xs text-white/80">
                                    Students
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold mb-1">
                                    200+
                                </div>
                                <div className="text-xs text-white/80">
                                    Programs
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold mb-1">
                                    95%
                                </div>
                                <div className="text-xs text-white/80">
                                    Job Placement
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
