import InputError from "@/components/ui/Form/InputError";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import TextInput from "@/components/ui/Form/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";
import { Mail, CheckCircle, Send, Loader2 } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Main Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-primary/10 to-primary-dark/10 rounded-full blur-xl"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent my-5">
                                    Forgot Password?
                                </h1>
                                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                                    No problem. Just let us know your email
                                    address and we'll email you a password reset
                                    link.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-sm font-medium text-green-700">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-primary mb-3"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-slate-700 placeholder-slate-400"
                                            placeholder="Enter your email address"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
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
                                            <span>Sending Reset Link...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="h-5 w-5 text-accent" />
                                            <span>
                                                Send Password Reset Link
                                            </span>
                                        </div>
                                    )}
                                </PrimaryButton>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-8 text-center">
                                <p className="text-slate-600">
                                    Remember your password?{" "}
                                    <Link
                                        href={route("login")}
                                        className="text-primary hover:text-primary-dark font-semibold transition-colors duration-200 hover:underline"
                                    >
                                        Back to Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
