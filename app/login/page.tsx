"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../../images/logo-sm.png";
import Image from "next/image";
import { GraduationCap, Smartphone, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

/* ---------------------- Schemas ---------------------- */
const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
});
type PhoneForm = z.infer<typeof phoneSchema>;

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type EmailForm = z.infer<typeof emailSchema>;

const registerSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
});
type RegisterForm = z.infer<typeof registerSchema>;

/* ---------------------- Mock storage ---------------------- */
const mockAdmin = {
  email: "ramesh@gmail.com",
  password: "Ramesh@123",
  user: {
    id: "1",
    name: "Ramesh",
    email: "ramesh@gmail.com",
    role: "admin" as const,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
    createdAt: "2024-01-15",
  },
};
const mockRegisteredUsers: Array<typeof mockAdmin.user> = [mockAdmin.user];

/* ---------------------- Helper: OTP ---------------------- */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------------- Page Component ---------------------- */
export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // UI mode: default is phone-based sign in.
  const [mode, setMode] = useState<
    "phone-signin" | "email-signin" | "signup-phone" | "signup-form"
  >("phone-signin");

  // OTP state
  const [step, setStep] = useState<"enter-phone" | "enter-otp">("enter-phone");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSuccess, setOtpSuccess] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  // email sign-in
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  /* ---------- phone sign-in form ---------- */
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
  });

  /* ---------- email sign-in form ---------- */
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  /* ---------- registration form (after phone OTP) ---------- */
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    setValue: setSignupValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  /* ---------------------- Handlers ---------------------- */

  // Phone: send OTP (signin or signup)
  const handleSendOtp = useCallback(
    (data: PhoneForm) => {
      setOtp("");
      setOtpError("");
      setOtpSuccess("");

      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      setStep("enter-otp");
      setOtpSuccess(` (Demo OTP: ${newOtp})`);
      console.log("Demo OTP:", newOtp, "for phone:", data.phoneNumber);

      if (mode === "signup-phone") {
        setSignupValue("phoneNumber", data.phoneNumber);
      }
    },
    [mode, setSignupValue]
  );

  // Verify OTP (sign-in or move to signup form)
  const handleVerifyOtp = useCallback(() => {
    setOtpError("");
    setOtpSuccess("");

    if (otp !== generatedOtp) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    setOtpSuccess("OTP verified.");

    if (mode === "phone-signin") {
      // demo: sign in as admin
      login(mockAdmin.user);
      router.push("/");
    } else if (mode === "signup-phone") {
      // proceed to registration form
      setMode("signup-form");
      setStep("enter-phone");
      setGeneratedOtp("");
      setOtp("");
      setOtpSuccess("");
      setOtpError("");
    }
  }, [otp, generatedOtp, mode, login, router]);

  // Resend OTP (demo)
  const handleResendOtp = useCallback(() => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtp("");
    setOtpError("");
    setOtpSuccess(`New OTP sent (Demo): ${newOtp}`);
    console.log("Resent OTP:", newOtp);
  }, []);

  // Email sign-in submit
  const onEmailSignIn = useCallback(
    (data: EmailForm) => {
      setAuthError("");
      if (
        data.email === mockAdmin.email &&
        data.password === mockAdmin.password
      ) {
        login(mockAdmin.user);
        router.push("/");
      } else {
        setAuthError("Invalid email or password");
      }
    },
    [login, router]
  );

  // Registration submit (after signup-phone verified)
  const onRegister = useCallback(
    (data: RegisterForm) => {
      const newUser = {
        id: String(Date.now()),
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: "admin" as const,
        avatar: "",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      mockRegisteredUsers.push(newUser as any);
      login(newUser as any);
      router.push("/");
    },
    [login, router]
  );

  // Demo helper
  const quickFillDemoPhone = () => {
    const demo = "+12345678901";
    // trigger send OTP directly
    handleSendOtp({ phoneNumber: demo });
  };

  /* small helper to render the header subtitle */
  const subtitle =
    mode === "signup-form"
      ? "Complete Registration"
      : mode === "signup-phone"
      ? "Sign Up"
      : mode === "email-signin"
      ? "Sign In with Email"
      : "Sign In with Phone";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-0">
            <div className="text-center mb-4 pt-6">
              <div className="flex items-center justify-center   mb-4">
                {/* Logo */}
                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                  <Image
                    src={Logo}
                    alt="Finomo Logo"
                    width={50}
                    height={20}
                    className="object-contain"
                    priority
                  />
                </div> 
                <h1 className="text-3xl font-semibold text-muted-foreground">
                  Finomo
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
            </div>
          </CardHeader>

          <CardContent>
            {/* PHONE SIGN-IN / SIGNUP - Enter phone */}
            {(mode === "phone-signin" || mode === "signup-phone") &&
              step === "enter-phone" && (
                <form
                  onSubmit={handleSubmitPhone((data) => handleSendOtp(data))}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        placeholder="+919876543210"
                        {...registerPhone("phoneNumber")}
                        className="h-11 pl-10"
                        aria-invalid={!!phoneErrors.phoneNumber}
                      />
                    </div>
                    {phoneErrors.phoneNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {phoneErrors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {otpError && (
                    <Alert variant="destructive">
                      <AlertDescription>{otpError}</AlertDescription>
                    </Alert>
                  )}
                  {otpSuccess && (
                    <Alert>
                      <AlertDescription className="text-green-700">
                        {otpSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-11">
                    {mode === "signup-phone"
                      ? "Send OTP to Register"
                      : "Send OTP"}
                  </Button>
                </form>
              )}

            {/* ENTER OTP */}
            {(mode === "phone-signin" || mode === "signup-phone") &&
              step === "enter-otp" && (
                <div className="space-y-6">
                  {otpSuccess && (
                    <Alert>
                      <AlertDescription className="text-green-700">
                        {otpSuccess}
                      </AlertDescription>
                    </Alert>
                  )}
                  {otpError && (
                    <Alert variant="destructive">
                      <AlertDescription>{otpError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-center block">
                        Enter 6-digit OTP
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(v) => {
                            setOtp(v);
                            setOtpError("");
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6}
                      className="w-full h-11"
                    >
                      Verify OTP
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("enter-phone");
                          setOtp("");
                          setGeneratedOtp("");
                          setOtpError("");
                          setOtpSuccess("");
                        }}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* EMAIL SIGN-IN */}
            {mode === "email-signin" && (
              <form
                onSubmit={handleSubmitEmail(onEmailSignIn)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerEmail("email")}
                    className="h-11"
                    aria-invalid={!!emailErrors.email}
                  />
                  {emailErrors.email && (
                    <p className="text-sm text-destructive">
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...registerEmail("password")}
                      className="h-11 pr-10"
                      aria-invalid={!!emailErrors.password}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {emailErrors.password && (
                    <p className="text-sm text-destructive">
                      {emailErrors.password.message}
                    </p>
                  )}
                </div>

                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-11">
                  Sign In
                </Button>
              </form>
            )}

            {/* SIGNUP FORM (after phone OTP verified) */}
            {mode === "signup-form" && (
              <form
                onSubmit={handleSubmitSignup(onRegister)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>First Name</Label>
                    <Input {...registerSignup("firstName")} className="mt-2" />
                    {signupErrors.firstName && (
                      <p className="text-sm text-destructive">
                        {signupErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input {...registerSignup("lastName")} className="mt-2" />
                    {signupErrors.lastName && (
                      <p className="text-sm text-destructive">
                        {signupErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input {...registerSignup("email")} className="mt-2" />
                  {signupErrors.email && (
                    <p className="text-sm text-destructive">
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Phone (already verified)</Label>
                  <Input
                    {...registerSignup("phoneNumber")}
                    className="mt-2"
                    readOnly
                  />
                  {signupErrors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {signupErrors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...registerSignup("password")}
                    className="mt-2"
                  />
                  {signupErrors.password && (
                    <p className="text-sm text-destructive">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("phone-signin");
                      setOtp("");
                      setGeneratedOtp("");
                      setOtpError("");
                      setOtpSuccess("");
                    }}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Back to Login
                  </button>

                  <Button type="submit" className="h-11">
                    Complete Registration
                  </Button>
                </div>
              </form>
            )}

            {/* --- Footer link-style navigation (changed to link-style) --- */}
            <div className="flex items-center justify-center gap-4 my-4">
              <button
                onClick={() => {
                  setMode("phone-signin");
                  setStep("enter-phone");
                  setOtp("");
                  setGeneratedOtp("");
                  setOtpError("");
                  setOtpSuccess("");
                }}
                className={`text-sm ${
                  mode === "phone-signin"
                    ? "font-semibold text-primary underline"
                    : "text-muted-foreground hover:underline"
                }`}
                aria-current={mode === "phone-signin" ? "page" : undefined}
                aria-pressed={mode === "phone-signin"}
              >
                Login with phone
              </button>

              <button
                onClick={() => {
                  setMode("email-signin");
                  setAuthError("");
                  setOtp("");
                  setGeneratedOtp("");
                  setOtpError("");
                  setOtpSuccess("");
                }}
                className={`text-sm ${
                  mode === "email-signin"
                    ? "font-semibold text-primary underline"
                    : "text-muted-foreground hover:underline"
                }`}
                aria-current={mode === "email-signin" ? "page" : undefined}
                aria-pressed={mode === "email-signin"}
              >
                Login with email
              </button>

              {/* Sign up is now presented as a link-style control */}
              <button
                onClick={() => {
                  setMode("signup-phone");
                  setStep("enter-phone");
                  setOtp("");
                  setGeneratedOtp("");
                  setOtpError("");
                  setOtpSuccess("");
                }}
                className={`text-sm ${
                  mode.startsWith("signup")
                    ? "font-semibold text-primary underline"
                    : "text-muted-foreground hover:underline"
                }`}
                aria-current={mode.startsWith("signup") ? "page" : undefined}
                aria-pressed={mode.startsWith("signup")}
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
