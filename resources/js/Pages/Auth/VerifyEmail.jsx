import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { MailCheck, Info, RefreshCcw, Loader2 } from "lucide-react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Email Verification" />

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
                                    <MailCheck className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4">
                                    Verify Your Email
                                </h1>
                                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                                    Thanks for signing up! Before getting
                                    started, please verify your email address by
                                    clicking on the link we just emailed to you.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status === "verification-link-sent" && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <MailCheck className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-sm font-medium text-green-700">
                                            A new verification link has been
                                            sent to your email address.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Verification Info */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                    </div>
                                    <p className="ml-3 text-sm text-blue-700">
                                        Didn't receive the email? Check your
                                        spam folder or click the button below to
                                        request a new verification link.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Resend Button */}
                                <PrimaryButton
                                    className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-[#0d9488] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] flex items-center justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <RefreshCcw className="w-5 h-5" />
                                            <span>
                                                Resend Verification Email
                                            </span>
                                        </div>
                                    )}
                                </PrimaryButton>
                            </form>

                            {/* Logout Link */}
                            <div className="mt-8 text-center">
                                <p className="text-slate-600">
                                    Need to use a different account?{" "}
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-primary hover:text-primary-dark font-semibold transition-colors duration-200 hover:underline"
                                    >
                                        Log Out
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
