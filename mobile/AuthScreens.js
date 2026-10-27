import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

const BLUE = "#2457C5";
const BLUE_LIGHT = "#EAF1FF";

// Subcomponents declared at module-level to prevent focus loss during typing
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  maxLength,
  hint,
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || "default"}
        autoCapitalize={
          keyboardType === "email-address" ? "none" : "sentences"
        }
        maxLength={maxLength}
      />
    </View>
  );
}

function PrimaryButton({ title, onPress, disabled, isSubmitting }) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && { opacity: 0.65 }]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      {isSubmitting ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function SwitchLink({ text, link, onPress }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{link}</Text>
      </TouchableOpacity>
    </View>
  );
}

// 6-Digit OTP Box Group with Auto-Advance
function SixDigitInput({ otp, setOtp, onComplete }) {
  const inputRefs = useRef([]);

  const digits = Array(6)
    .fill("")
    .map((_, i) => (otp && otp[i] ? otp[i] : ""));

  function handleChange(text, index) {
    const cleaned = text.replace(/\D/g, "");

    // Handling direct 6-digit paste
    if (cleaned.length >= 6) {
      const fullCode = cleaned.slice(0, 6);
      setOtp(fullCode);
      inputRefs.current[5]?.focus();
      if (onComplete) onComplete(fullCode);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    const newOtp = newDigits.join("");
    setOtp(newOtp);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.length === 6 && onComplete) {
      onComplete(newOtp);
    }
  }

  function handleKeyPress(e, index) {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.otpBoxesRow}>
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputRefs.current[i] = ref)}
          style={[
            styles.otpBox,
            Boolean(digit) && styles.otpBoxFilled,
          ]}
          value={digit}
          onChangeText={(val) => handleChange(val, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={i === 0 ? 6 : 1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

export default function AuthScreens({ onLogin, authError, isSubmitting, apiUrl }) {
  // Screens: 'login' | 'signup' | 'login-otp' | 'verify-otp' | 'forgot-contact' | 'forgot-otp' | 'forgot-reset' | 'forgot-success'
  const [screen, setScreen] = useState("login");
  const [method, setMethod] = useState("email"); // 'email' | 'mobile'

  // Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [availableCode, setAvailableCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Countdown timer for OTP resend
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const targetContact = method === "email" ? email : mobile;
  const effectiveError = authError || localError;

  // Resolve API Base URL
  const resolvedApi = apiUrl || (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname
    ? `http://${window.location.hostname}:4000/api`
    : "http://localhost:4000/api");

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (timerSeconds > 0 && (screen === "verify-otp" || screen === "forgot-otp" || screen === "login-otp")) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timerSeconds, screen]);

  // --- API Call: Send OTP (Dispatches real email via SMTP / SMS) ---
  async function requestOtp(target, type = "general") {
    setLocalError("");
    setNoticeMsg("");
    try {
      const res = await fetch(resolvedApi + "/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          type,
          method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send verification OTP");

      setTimerSeconds(30);
      setCanResend(false);
      if (data.otp) setAvailableCode(data.otp);
      setNoticeMsg(data.message || `Verification code sent to your ${method === "mobile" ? "mobile via SMS" : "email inbox"}.`);
      return data;
    } catch (e) {
      setLocalError(e.message);
      return null;
    }
  }

  // --- Login with Password ---
  function handlePasswordLogin() {
    setLocalError("");
    if (!email.trim() || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    if (typeof onLogin === "function") {
      onLogin({
        email: email.trim(),
        password,
        isRegister: false,
      });
    }
  }

  // --- Initiate Sign Up: Send OTP ---
  async function handleStartSignUp() {
    setLocalError("");
    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      setLocalError("Please complete all registration fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      setLocalError("Mobile number must be a valid 10-digit number.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const target = method === "email" ? email.trim() : mobile.trim();
    const result = await requestOtp(target, "signup");
    if (result) {
      setOtp("");
      setScreen("verify-otp");
    }
  }

  // --- Complete Sign Up after OTP ---
  async function handleCompleteSignUp(otpCode = otp) {
    setLocalError("");
    if (otpCode.length < 6) {
      setLocalError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      const target = method === "email" ? email.trim() : mobile.trim();
      const vRes = await fetch(resolvedApi + "/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, otp: otpCode }),
      });
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || "Invalid verification code");

      if (typeof onLogin === "function") {
        onLogin({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          password,
          isRegister: true,
        });
      }
    } catch (e) {
      setLocalError(e.message);
    }
  }

  // --- Passwordless Login via OTP ---
  async function handleRequestLoginOtp() {
    setLocalError("");
    const target = (method === "email" ? email : mobile).trim();
    if (!target) {
      setLocalError(`Please enter your ${method === "email" ? "email" : "mobile number"}.`);
      return;
    }

    const result = await requestOtp(target, "login");
    if (result) {
      setOtp("");
      setScreen("login-otp");
    }
  }

  async function handleVerifyLoginOtp(otpCode = otp) {
    setLocalError("");
    if (otpCode.length < 6) {
      setLocalError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      const target = (method === "email" ? email : mobile).trim();
      const res = await fetch(resolvedApi + "/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to sign in with OTP");

      if (typeof onLogin === "function") {
        onLogin({
          token: data.token,
          user: data.user,
        });
      }
    } catch (e) {
      setLocalError(e.message);
    }
  }

  // --- Forgot Password: Step 1 Send Code ---
  async function handleForgotSendOtp() {
    setLocalError("");
    const target = targetContact.trim();
    if (!target) {
      setLocalError(`Please enter your registered ${method === "email" ? "email" : "mobile number"}.`);
      return;
    }

    const result = await requestOtp(target, "reset-password");
    if (result) {
      setOtp("");
      setScreen("forgot-otp");
    }
  }

  // --- Forgot Password: Step 2 Verify Code ---
  async function handleForgotVerifyOtp(otpCode = otp) {
    setLocalError("");
    if (otpCode.length < 6) {
      setLocalError("Please enter all 6 digits of the reset code.");
      return;
    }

    try {
      const target = targetContact.trim();
      const res = await fetch(resolvedApi + "/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect or expired reset code.");

      setScreen("forgot-reset");
    } catch (e) {
      setLocalError(e.message);
    }
  }

  // --- Forgot Password: Step 3 Save New Password ---
  async function handleSaveNewPassword() {
    setLocalError("");
    if (!password || password.length < 6) {
      setLocalError("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-type password.");
      return;
    }

    try {
      const target = targetContact.trim();
      const res = await fetch(resolvedApi + "/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          otp,
          newPassword: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update password.");

      setSuccessMsg("Password successfully reset! You can now sign in with your new credentials.");
      setScreen("forgot-success");
    } catch (e) {
      setLocalError(e.message);
    }
  }

  // Instant Demo Sign In
  function handleQuickDemoFill() {
    setEmail("student@abhyas.local");
    setPassword("Student123!");
    setLocalError("");
    if (typeof onLogin === "function") {
      onLogin({
        email: "student@abhyas.local",
        password: "Student123!",
        isRegister: false,
      });
    }
  }

  // Password Strength Calculation
  const passwordStrength = (() => {
    if (!password) return { label: "", color: "#E2E8F0", width: "0%" };
    if (password.length < 6) return { label: "Too short", color: "#EF4444", width: "25%" };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasNum && hasSpecial) {
      return { label: "Strong", color: "#10B981", width: "100%" };
    }
    if (password.length >= 6 && (hasNum || hasSpecial)) {
      return { label: "Moderate", color: "#F59E0B", width: "65%" };
    }
    return { label: "Basic", color: "#F97316", width: "40%" };
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Header */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.appName}>Study Hours</Text>
          <Text style={styles.tagline}>
            Your journey to UPSC &amp; MPSC success
          </Text>

          {/* Error Alert Banner */}
          {Boolean(effectiveError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {effectiveError}</Text>
            </View>
          )}

          {/* Dispatch Notice Banner */}
          {Boolean(noticeMsg) && (
            <View style={styles.noticeBanner}>
              <Text style={styles.noticeText}>📬 {noticeMsg}</Text>
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 1: SIGN IN (PASSWORD MODE)                             */}
          {/* ============================================================== */}
          {screen === "login" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your preparation.
              </Text>

              {/* Mode switch: Password vs OTP */}
              <View style={styles.tabPillRow}>
                <TouchableOpacity
                  style={[styles.tabPill, styles.tabPillActive]}
                  onPress={() => setScreen("login")}
                >
                  <Text style={[styles.tabPillText, styles.tabPillTextActive]}>
                    Password Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tabPill}
                  onPress={() => {
                    setLocalError("");
                    setNoticeMsg("");
                    setScreen("login-otp");
                  }}
                >
                  <Text style={styles.tabPillText}>⚡ Sign In with OTP</Text>
                </TouchableOpacity>
              </View>

              <Field
                label="Email address"
                value={email}
                onChangeText={(val) => {
                  setLocalError("");
                  setEmail(val);
                }}
                placeholder="Enter email (e.g. student@abhyas.local)"
                keyboardType="email-address"
              />

              <Field
                label="Password"
                value={password}
                onChangeText={(val) => {
                  setLocalError("");
                  setPassword(val);
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
              />

              <View style={styles.rowBetween}>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.link}>
                    {showPassword ? "Hide password" : "Show password"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLocalError("");
                    setNoticeMsg("");
                    setOtp("");
                    setScreen("forgot-contact");
                  }}
                >
                  <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <PrimaryButton
                title="Sign In"
                onPress={handlePasswordLogin}
                disabled={isSubmitting}
                isSubmitting={isSubmitting}
              />

              {/* Instant Demo Login Button */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleQuickDemoFill}
              >
                <Text style={styles.demoButtonText}>
                  ⚡ 1-Tap Demo Sign In (Student)
                </Text>
              </TouchableOpacity>

              <SwitchLink
                text="Don't have an account?"
                link="Sign Up"
                onPress={() => {
                  setLocalError("");
                  setNoticeMsg("");
                  setScreen("signup");
                }}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 2: SIGN IN WITH OTP (PASSWORDLESS)                      */}
          {/* ============================================================== */}
          {screen === "login-otp" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Fast OTP Sign In</Text>
              <Text style={styles.subtitle}>
                We will dispatch an OTP verification code to your email or mobile.
              </Text>

              {/* Channel Selector */}
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    method === "email" && styles.methodSelected,
                  ]}
                  onPress={() => setMethod("email")}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === "email" && styles.methodTextSelected,
                    ]}
                  >
                    ✉️ Via Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    method === "mobile" && styles.methodSelected,
                  ]}
                  onPress={() => setMethod("mobile")}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === "mobile" && styles.methodTextSelected,
                    ]}
                  >
                    📱 Via Mobile SMS
                  </Text>
                </TouchableOpacity>
              </View>

              <Field
                label={method === "email" ? "Registered Email" : "Mobile Number"}
                value={method === "email" ? email : mobile}
                onChangeText={(val) => {
                  setLocalError("");
                  if (method === "email") setEmail(val);
                  else setMobile(val);
                }}
                placeholder={
                  method === "email"
                    ? "Enter your email"
                    : "10-digit mobile number"
                }
                keyboardType={method === "email" ? "email-address" : "phone-pad"}
                maxLength={method === "mobile" ? 10 : undefined}
              />

              <PrimaryButton
                title="Send Verification Code"
                onPress={handleRequestLoginOtp}
              />

              {/* OTP Input Section once requested */}
              {timerSeconds > 0 && (
                <View style={{ marginTop: 22 }}>
                  <Text style={styles.subHeading}>Enter 6-digit Code Received</Text>
                  {Boolean(availableCode) && (
                    <TouchableOpacity
                      style={styles.quickFillBadge}
                      onPress={() => {
                        setOtp(availableCode);
                        setLocalError("");
                      }}
                    >
                      <Text style={styles.quickFillText}>
                        ⚡ Auto-fill Code: [{availableCode}]
                      </Text>
                    </TouchableOpacity>
                  )}
                  <SixDigitInput
                    otp={otp}
                    setOtp={setOtp}
                    onComplete={(fullCode) => handleVerifyLoginOtp(fullCode)}
                  />

                  <PrimaryButton
                    title="Verify & Enter App"
                    onPress={() => handleVerifyLoginOtp(otp)}
                  />

                  <View style={styles.resendRow}>
                    {canResend ? (
                      <TouchableOpacity onPress={handleRequestLoginOtp}>
                        <Text style={styles.resendLink}>Resend Code Now</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.countdownText}>
                        Resend code in {timerSeconds}s
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <SwitchLink
                text="Prefer password?"
                link="Sign In with Password"
                onPress={() => {
                  setLocalError("");
                  setNoticeMsg("");
                  setScreen("login");
                }}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 3: CREATE ACCOUNT (SIGN UP)                            */}
          {/* ============================================================== */}
          {screen === "signup" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subtitle}>
                Start tracking your preparation with Study Hours.
              </Text>

              <Field
                label="Full name"
                value={name}
                onChangeText={(val) => {
                  setLocalError("");
                  setName(val);
                }}
                placeholder="Enter your full name"
              />

              <Field
                label="Email address"
                value={email}
                onChangeText={(val) => {
                  setLocalError("");
                  setEmail(val);
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
              />

              <Field
                label="Mobile number"
                value={mobile}
                onChangeText={(val) => {
                  setLocalError("");
                  setMobile(val);
                }}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Field
                label="Create password"
                value={password}
                onChangeText={(val) => {
                  setLocalError("");
                  setPassword(val);
                }}
                placeholder="At least 6 characters"
                secureTextEntry={!showPassword}
              />

              {/* Password Strength Meter */}
              {Boolean(password) && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBg}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: passwordStrength.width,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.strengthLabel,
                      { color: passwordStrength.color },
                    ]}
                  >
                    Strength: {passwordStrength.label}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.showPassword}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.link}>
                  {showPassword ? "Hide password" : "Show password"}
                </Text>
              </TouchableOpacity>

              {/* Channel Selector */}
              <View style={styles.methodChoiceRow}>
                <Text style={styles.methodChoiceLabel}>Send OTP to:</Text>
                <TouchableOpacity
                  style={[
                    styles.smallChoicePill,
                    method === "email" && styles.smallChoicePillActive,
                  ]}
                  onPress={() => setMethod("email")}
                >
                  <Text
                    style={[
                      styles.smallChoiceText,
                      method === "email" && styles.smallChoiceTextActive,
                    ]}
                  >
                    Email Inbox
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.smallChoicePill,
                    method === "mobile" && styles.smallChoicePillActive,
                  ]}
                  onPress={() => setMethod("mobile")}
                >
                  <Text
                    style={[
                      styles.smallChoiceText,
                      method === "mobile" && styles.smallChoiceTextActive,
                    ]}
                  >
                    Mobile SMS
                  </Text>
                </TouchableOpacity>
              </View>

              <PrimaryButton
                title="Send Verification Code & Continue"
                onPress={handleStartSignUp}
              />

              <SwitchLink
                text="Already have an account?"
                link="Sign In"
                onPress={() => {
                  setLocalError("");
                  setNoticeMsg("");
                  setScreen("login");
                }}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 4: VERIFY OTP (SIGN UP)                                 */}
          {/* ============================================================== */}
          {screen === "verify-otp" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Verify Your Code</Text>
              <Text style={styles.subtitle}>
                Please enter the 6-digit verification code sent to{" "}
                <Text style={{ fontWeight: "700", color: "#1E293B" }}>
                  {targetContact}
                </Text>
              </Text>

              {Boolean(availableCode) && (
                <TouchableOpacity
                  style={styles.quickFillBadge}
                  onPress={() => {
                    setOtp(availableCode);
                    setLocalError("");
                  }}
                >
                  <Text style={styles.quickFillText}>
                    ⚡ Auto-fill Code: [{availableCode}]
                  </Text>
                </TouchableOpacity>
              )}

              <SixDigitInput
                otp={otp}
                setOtp={setOtp}
                onComplete={(code) => handleCompleteSignUp(code)}
              />

              <PrimaryButton
                title="Verify & Create Account"
                onPress={() => handleCompleteSignUp(otp)}
                disabled={otp.length < 6}
              />

              <View style={styles.resendRow}>
                {canResend ? (
                  <TouchableOpacity onPress={() => handleStartSignUp()}>
                    <Text style={styles.resendLink}>Resend Code Now</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.countdownText}>
                    Resend code in {timerSeconds}s
                  </Text>
                )}
              </View>

              <SwitchLink
                text="Wrong contact details?"
                link="Edit Details"
                onPress={() => setScreen("signup")}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 5: FORGOT PASSWORD - STEP 1 (CONTACT)                   */}
          {/* ============================================================== */}
          {screen === "forgot-contact" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Choose how you want to receive your password reset OTP.
              </Text>

              {/* Delivery method pills */}
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    method === "email" && styles.methodSelected,
                  ]}
                  onPress={() => setMethod("email")}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === "email" && styles.methodTextSelected,
                    ]}
                  >
                    ✉️ Via Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    method === "mobile" && styles.methodSelected,
                  ]}
                  onPress={() => setMethod("mobile")}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === "mobile" && styles.methodTextSelected,
                    ]}
                  >
                    📱 Via Mobile SMS
                  </Text>
                </TouchableOpacity>
              </View>

              <Field
                label={method === "email" ? "Registered Email Address" : "Registered Mobile Number"}
                value={method === "email" ? email : mobile}
                onChangeText={(val) => {
                  setLocalError("");
                  if (method === "email") setEmail(val);
                  else setMobile(val);
                }}
                placeholder={
                  method === "email"
                    ? "Enter your email (e.g. bhumikajadhav007@gmail.com)"
                    : "10-digit mobile number"
                }
                keyboardType={method === "email" ? "email-address" : "phone-pad"}
                maxLength={method === "mobile" ? 10 : undefined}
              />

              <PrimaryButton
                title="Send Reset Code"
                onPress={handleForgotSendOtp}
              />

              <SwitchLink
                text="Remembered your password?"
                link="Back to Sign In"
                onPress={() => {
                  setLocalError("");
                  setNoticeMsg("");
                  setScreen("login");
                }}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 6: FORGOT PASSWORD - STEP 2 (OTP ENTRY)                 */}
          {/* ============================================================== */}
          {screen === "forgot-otp" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Enter Verification Code</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code received on{" "}
                <Text style={{ fontWeight: "700", color: "#1E293B" }}>
                  {targetContact}
                </Text>
              </Text>

              {Boolean(availableCode) && (
                <TouchableOpacity
                  style={styles.quickFillBadge}
                  onPress={() => {
                    setOtp(availableCode);
                    setLocalError("");
                  }}
                >
                  <Text style={styles.quickFillText}>
                    ⚡ Auto-fill Code: [{availableCode}]
                  </Text>
                </TouchableOpacity>
              )}

              <SixDigitInput
                otp={otp}
                setOtp={setOtp}
                onComplete={(code) => handleForgotVerifyOtp(code)}
              />

              <PrimaryButton
                title="Verify Reset Code"
                onPress={() => handleForgotVerifyOtp(otp)}
                disabled={otp.length < 6}
              />

              <View style={styles.resendRow}>
                {canResend ? (
                  <TouchableOpacity onPress={handleForgotSendOtp}>
                    <Text style={styles.resendLink}>Resend Code Now</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.countdownText}>
                    Resend code in {timerSeconds}s
                  </Text>
                )}
              </View>

              <SwitchLink
                text="Want to try another email or mobile?"
                link="Change Contact"
                onPress={() => setScreen("forgot-contact")}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 7: FORGOT PASSWORD - STEP 3 (NEW PASSWORD)              */}
          {/* ============================================================== */}
          {screen === "forgot-reset" && (
            <View style={styles.card}>
              <Text style={styles.heading}>Set New Password</Text>
              <Text style={styles.subtitle}>
                Create a strong new password for your account.
              </Text>

              <Field
                label="New password"
                value={password}
                onChangeText={(val) => {
                  setLocalError("");
                  setPassword(val);
                }}
                placeholder="At least 6 characters"
                secureTextEntry={!showPassword}
              />

              {/* Password strength indicator */}
              {Boolean(password) && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBg}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: passwordStrength.width,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.strengthLabel,
                      { color: passwordStrength.color },
                    ]}
                  >
                    Strength: {passwordStrength.label}
                  </Text>
                </View>
              )}

              <Field
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={(val) => {
                  setLocalError("");
                  setConfirmPassword(val);
                }}
                placeholder="Re-type your new password"
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.showPassword}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.link}>
                  {showPassword ? "Hide password" : "Show password"}
                </Text>
              </TouchableOpacity>

              <PrimaryButton
                title="Update Password & Continue"
                onPress={handleSaveNewPassword}
              />
            </View>
          )}

          {/* ============================================================== */}
          {/* SCREEN 8: SUCCESS CONFIRMATION                                */}
          {/* ============================================================== */}
          {screen === "forgot-success" && (
            <View style={styles.card}>
              <View style={styles.successIconBadge}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={[styles.heading, { textAlign: "center" }]}>
                Password Reset!
              </Text>
              <Text style={[styles.subtitle, { textAlign: "center" }]}>
                {successMsg || "Your password has been successfully updated."}
              </Text>

              <PrimaryButton
                title="Sign In Now"
                onPress={() => {
                  setLocalError("");
                  setNoticeMsg("");
                  setScreen("login");
                }}
              />
            </View>
          )}

          <Text style={styles.footer}>
            Learn consistently. Track progress. Achieve your goals.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F7FF",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: BLUE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  appName: {
    fontSize: 25,
    fontWeight: "800",
    color: "#18356B",
    textAlign: "center",
  },
  tagline: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  noticeBanner: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  noticeText: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2EAF8",
    elevation: 3,
    shadowColor: "#173A72",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  heading: {
    fontSize: 23,
    fontWeight: "800",
    color: "#172F5D",
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  tabPillRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  tabPillActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabPillText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },
  tabPillTextActive: {
    color: BLUE,
  },
  field: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  hint: {
    fontSize: 11,
    color: "#94A3B8",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8E2F1",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: "#172F5D",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -4,
    marginBottom: 14,
  },
  showPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 12,
  },
  forgot: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: BLUE,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  demoButton: {
    backgroundColor: "#EBF2FD",
    borderWidth: 1,
    borderColor: "#C5D8F6",
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  demoButtonText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 18,
  },
  switchText: {
    color: "#64748B",
    fontSize: 13,
  },
  link: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "800",
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#D8E2F1",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  methodSelected: {
    borderColor: BLUE,
    backgroundColor: BLUE_LIGHT,
  },
  methodText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 13,
  },
  methodTextSelected: {
    color: BLUE,
  },
  methodChoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  methodChoiceLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  smallChoicePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  smallChoicePillActive: {
    borderColor: BLUE,
    backgroundColor: BLUE_LIGHT,
  },
  smallChoiceText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  smallChoiceTextActive: {
    color: BLUE,
    fontWeight: "700",
  },
  otpBoxesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D8E2F1",
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    color: "#172F5D",
  },
  otpBoxFilled: {
    borderColor: BLUE,
    backgroundColor: "#F8FAFF",
  },
  quickFillBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: "center",
    marginBottom: 14,
  },
  quickFillText: {
    color: "#4338CA",
    fontSize: 12,
    fontWeight: "700",
  },
  resendRow: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 4,
  },
  countdownText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  resendLink: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "700",
  },
  strengthContainer: {
    marginBottom: 12,
    marginTop: -4,
  },
  strengthBarBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },
  successIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  successIconText: {
    color: "#10B981",
    fontSize: 28,
    fontWeight: "900",
  },
  footer: {
    color: "#8290A6",
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },
});
