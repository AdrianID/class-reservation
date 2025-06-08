/* import Checkbox from "@/components/ui/Form/Checkbox";
import InputError from "@/components/ui/Form/InputError";
import InputLabel from "@/components/ui/Form/InputLabel";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import TextInput from "@/components/ui/Form/TextInput";
import GuestLayout from "@/components/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
 */


import React, { useState } from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import ApplicationLogo from "@/components/shared/ApplicationLogo";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-light to-accent-light relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-r from-accent/25 to-primary/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-r from-primary-light/20 to-accent-light/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
                            {/* Header */}
                            <div className="text-center space-y-2">
                                <div className="flex justify-center mb-4">
                                    <ApplicationLogo className="w-16 h-16" />
                                </div>
                                <h2 className="text-2xl font-bold text-primary-dark">Welcome Back</h2>
                                <p className="text-slate-600">Sign in to access your account</p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <div className="space-y-5" onSubmit={submit}>
                                    <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary-dark block">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-primary/60" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter your email"
                                            autoComplete="username"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-600 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary-dark block">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-primary/60" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-primary/60 hover:text-primary" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-primary/60 hover:text-primary" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-600 text-sm">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData("remember", e.target.checked)}
                                            className="h-4 w-4 text-accent focus:ring-accent border-slate-300 rounded"
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-primary">
                                            Remember me
                                        </label>
                                    </div>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    onClick={submit}
                                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <Link href={route("register")} className="font-medium text-accent hover:text-accent-dark transition-colors">
                                    Create new account
                                </Link>
                            </div>
                        </div>

                        {/* Stats Footer */}
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                                <div className="text-2xl font-bold text-accent">25,000+</div>
                                <div className="text-xs text-slate-600">Students</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                                <div className="text-2xl font-bold text-primary">200+</div>
                                <div className="text-xs text-slate-600">Programs</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                                <div className="text-2xl font-bold text-accent">95%</div>
                                <div className="text-xs text-slate-600">Job Placement</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
