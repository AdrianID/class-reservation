import InputError from "@/components/ui/Form/InputError";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import TextInput from "@/components/ui/Form/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { Lock, ShieldAlert, Loader2, Check } from "lucide-react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Main Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-primary/10 to-primary-dark/10 rounded-full blur-xl"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.586-4.414A2 2 0 0118 5.586L8.293 15.293a1 1 0 01-1.414 0L3.707 12.121a1 1 0 011.414-1.414L8 13.586l8.293-8.293a1 1 0 011.414 0z"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4">
                                    Confirm Password
                                </h1>
                                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                                    This is a secure area of the application.
                                    Please confirm your password before
                                    continuing.
                                </p>
                            </div>

                            {/* Security Notice */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-amber-800">
                                            Security Verification Required
                                        </p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            You're accessing a protected area.
                                            Please enter your current password
                                            to proceed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Password Input */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-primary mb-3"
                                    >
                                        Current Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-slate-700 placeholder-slate-400"
                                            placeholder="Enter your current password"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2 text-red-500 text-sm"
                                    />
                                </div>

                                {/* Submit Button */}
                                <PrimaryButton
                                    className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-[#0d9488] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] flex items-center justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                            <span>Confirming...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-5 h-5" />
                                            <span>Confirm Password</span>
                                        </div>
                                    )}
                                </PrimaryButton>
                            </form>

                            {/* Help Text */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Having trouble? Contact support for
                                    assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
