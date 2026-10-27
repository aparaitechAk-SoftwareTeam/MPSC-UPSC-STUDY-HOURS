import React, { useState, useEffect, useRef } from "react";
import { smartApiFetch, getApiBase } from "./api";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const BLUE = "#2457C5";
const BLUE_LIGHT = "#EAF1FF";

export const getAuthTheme = (isDark) => ({
  isDark,
  bg: isDark ? "#0A0F1D" : "#F3F7FF",
  cardBg: isDark ? "#131B2E" : "#FFFFFF",
  cardBorder: isDark ? "#1E2D4D" : "#E2EAF8",
  heading: isDark ? "#F8FAFC" : "#172F5D",
  subHeading: isDark ? "#CBD5E1" : "#334155",
  subtitle: isDark ? "#94A3B8" : "#64748B",
  label: isDark ? "#E2E8F0" : "#334155",
  hint: isDark ? "#94A3B8" : "#94A3B8",
  inputBg: isDark ? "#0F172A" : "#FFFFFF",
  inputBorder: isDark ? "#334155" : "#D8E2F1",
  inputText: isDark ? "#F8FAFC" : "#172F5D",
  placeholder: isDark ? "#64748B" : "#94A3B8",
  tabRowBg: isDark ? "#1E293B" : "#F1F5F9",
  tabActiveBg: isDark ? "#0F172A" : "#FFFFFF",
  tabText: isDark ? "#94A3B8" : "#64748B",
  tabActiveText: isDark ? "#60A5FA" : BLUE,
  primaryBtn: isDark ? "#2563EB" : BLUE,
  studentBtnBg: isDark ? "#1E293B" : "#EBF2FD",
  studentBtnBorder: isDark ? "#3B82F6" : "#BFDBFE",
  studentBtnText: isDark ? "#60A5FA" : BLUE,
  adminBtnBg: isDark ? "#1E2538" : "#F1F5F9",
  adminBtnBorder: isDark ? "#475569" : "#CBD5E1",
  adminBtnText: isDark ? "#E2E8F0" : "#334155",
  demoBtnBg: isDark ? "#1E293B" : "#EBF2FD",
  demoBtnBorder: isDark ? "#334155" : "#C5D8F6",
  demoBtnText: isDark ? "#60A5FA" : BLUE,
  link: isDark ? "#60A5FA" : BLUE,
  forgot: isDark ? "#60A5FA" : BLUE,
  footer: isDark ? "#64748B" : "#94A3B8",
  logoBg: isDark ? "#2563EB" : BLUE,
  appName: isDark ? "#FFFFFF" : "#18356B",
  tagline: isDark ? "#E2E8F0" : "#64748B",
  methodBtnBg: isDark ? "#0F172A" : "#FFFFFF",
  methodBtnBorder: isDark ? "#334155" : "#D8E2F1",
  methodBtnText: isDark ? "#94A3B8" : "#64748B",
  methodSelectedBg: isDark ? "#1E3A5F" : BLUE_LIGHT,
  methodSelectedBorder: isDark ? "#3B82F6" : BLUE,
  methodSelectedText: isDark ? "#93C5FD" : BLUE,
  choicePillBg: isDark ? "#1E293B" : "#F8FAFC",
  choicePillBorder: isDark ? "#334155" : "#E2E8F0",
  choicePillText: isDark ? "#94A3B8" : "#64748B",
  choicePillActiveBg: isDark ? "#1E3A5F" : BLUE_LIGHT,
  choicePillActiveBorder: isDark ? "#3B82F6" : BLUE,
  choicePillActiveText: isDark ? "#93C5FD" : BLUE,
  otpBoxBg: isDark ? "#0F172A" : "#FFFFFF",
  otpBoxBorder: isDark ? "#334155" : "#D8E2F1",
  otpBoxFilledBorder: isDark ? "#3B82F6" : BLUE,
  otpBoxFilledBg: isDark ? "#1E293B" : "#F8FAFF",
  otpBoxText: isDark ? "#F8FAFC" : "#172F5D",
  toggleBg: isDark ? "#1E293B" : "#FFFFFF",
  toggleBorder: isDark ? "#334155" : "#DBEAFE",
  toggleColor: isDark ? "#FBBF24" : "#4F46E5",
  resendText: isDark ? "#64748B" : "#94A3B8",
  resendLink: isDark ? "#60A5FA" : BLUE,
  highlightText: isDark ? "#F8FAFC" : "#1E293B",
});

const AuthThemeContext = React.createContext(getAuthTheme(false));

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
  const theme = React.useContext(AuthThemeContext);
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.label }]}>{label}</Text>
        {hint ? <Text style={[styles.hint, { color: theme.hint }]}>{hint}</Text> : null}
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.inputText,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
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
  const theme = React.useContext(AuthThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        { backgroundColor: theme.primaryBtn },
        disabled && { opacity: 0.65 },
      ]}
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
  const theme = React.useContext(AuthThemeContext);
  return (
    <View style={styles.switchRow}>
      <Text style={[styles.switchText, { color: theme.subtitle }]}>{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.link, { color: theme.link }]}>{link}</Text>
      </TouchableOpacity>
    </View>
  );
}

// 6-Digit OTP Box Group with Auto-Advance & Multi-digit Paste Support
function SixDigitInput({ otp, setOtp, onComplete }) {
  const theme = React.useContext(AuthThemeContext);
  const inputRefs = useRef([]);

  const digits = Array(6)
    .fill("")
    .map((_, i) => (otp && otp[i] ? otp[i] : ""));

  function handleChange(text, index) {
    const cleaned = text.replace(/\D/g, "");

    // Handling direct 6-digit paste or multiple digits
    if (cleaned.length >= 6) {
      const fullCode = cleaned.slice(0, 6);
      setOtp(fullCode);
      inputRefs.current[5]?.focus();
      if (onComplete) onComplete(fullCode);
      return;
    }

    if (cleaned.length > 1) {
      const newDigits = [...digits];
      for (let j = 0; j < cleaned.length && (index + j) < 6; j++) {
        newDigits[index + j] = cleaned[j];
      }
      const newOtp = newDigits.join("");
      setOtp(newOtp);
      const nextIdx = Math.min(index + cleaned.length, 5);
      inputRefs.current[nextIdx]?.focus();
      if (newOtp.length === 6 && onComplete) onComplete(newOtp);
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
            {
              backgroundColor: theme.otpBoxBg,
              borderColor: theme.otpBoxBorder,
              color: theme.otpBoxText,
              width: 44,
              height: 50,
              maxWidth: 48,
              minWidth: 0,
            },
            Boolean(digit) && {
              borderColor: theme.otpBoxFilledBorder,
              backgroundColor: theme.otpBoxFilledBg,
            },
          ]}
          value={digit}
          onChangeText={(val) => handleChange(val, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

export default function AuthScreens({
  onLogin,
  authError,
  isSubmitting,
  apiUrl,
  isDark: propIsDark,
  onToggleTheme: propOnToggleTheme,
}) {
  const [internalDark, setInternalDark] = useState(() => {
    if (propIsDark !== undefined) return propIsDark;
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("abhyas_dark_theme");
      if (stored === "true") return true;
      if (stored === "false") return false;
    }
    return false;
  });

  const isDark = propIsDark !== undefined ? propIsDark : internalDark;

  const handleToggleTheme = () => {
    if (typeof propOnToggleTheme === "function") {
      propOnToggleTheme();
    } else {
      setInternalDark((prev) => {
        const next = !prev;
        if (Platform.OS === "web" && typeof localStorage !== "undefined") {
          try { localStorage.setItem("abhyas_dark_theme", String(next)); } catch {}
        }
        AsyncStorage.setItem("abhyas_dark_theme", String(next)).catch(() => {});
        return next;
      });
    }
  };

  const theme = getAuthTheme(isDark);
  // Screens: 'login' | 'signup' | 'login-otp' | 'verify-otp' | 'forgot-contact' | 'forgot-otp' | 'forgot-reset' | 'forgot-success'
  const [screen, setScreen] = useState("login");
  const [loginRole, setLoginRole] = useState("student"); // "student" | "admin"
  const [method, setMethod] = useState("email"); // 'email' | 'mobile'

  // Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("bhumikajadhav.aparaitech@gmail.com");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState("admin@abhyas.local");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);

  // Countdown timer for OTP resend
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const targetContact = method === "email" ? email : mobile;
  const effectiveError = authError || localError;

  // Resolve API Base URL
  const resolvedApi = apiUrl || getApiBase();

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

  // Synchronize browser body/html background on Web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.body.style.backgroundColor = theme.bg;
      if (document.documentElement) {
        document.documentElement.style.backgroundColor = theme.bg;
      }
    }
  }, [theme.bg]);

  // --- API Call: Send OTP (Dispatches real email via SMTP / SMS) ---
  async function requestOtp(target, type = "general") {
    setLocalError("");
    setNoticeMsg("");
    try {
      const res = await smartApiFetch("/auth/send-otp", {
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
      setNoticeMsg(
        data.message ||
          `Verification code sent to your ${
            method === "mobile" ? "mobile via SMS" : "email inbox"
          }.`
      );
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

    if (confirmPassword && password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-type password.");
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
      const vRes = await smartApiFetch("/auth/verify-otp", {
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
      const res = await smartApiFetch("/auth/login-otp", {
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
    setNoticeMsg("");
    const target = targetContact.trim();
    if (!target) {
      setLocalError(`Please enter your registered ${method === "email" ? "email" : "mobile number"}.`);
      return;
    }

    setIsLocalSubmitting(true);
    try {
      const result = await requestOtp(target, "reset-password");
      if (result) {
        setOtp("");
        setScreen("forgot-otp");
      }
    } finally {
      setIsLocalSubmitting(false);
    }
  }

  // --- Forgot Password: Step 2 Verify Code ---
  async function handleForgotVerifyOtp(otpCode = otp) {
    setLocalError("");
    const cleaned = String(otpCode || "").replace(/\D/g, "");
    if (cleaned.length < 6) {
      setLocalError("Please enter all 6 digits of the reset code.");
      return;
    }

    setIsLocalSubmitting(true);
    try {
      const target = targetContact.trim();
      const res = await smartApiFetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, otp: cleaned }),
        timeout: 10000,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect or expired reset code.");

      setScreen("forgot-reset");
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setIsLocalSubmitting(false);
    }
  }

  // --- Forgot Password: Save New Password ---
  async function handleSaveNewPassword() {
    setLocalError("");
    const target = (email || targetContact || "").trim();
    if (!target) {
      setLocalError("Please enter your registered email address.");
      return;
    }
    if (!password || password.length < 6) {
      setLocalError("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-type password.");
      return;
    }

    setIsLocalSubmitting(true);
    try {
      const res = await smartApiFetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          otp: otp || "123456",
          newPassword: password,
        }),
        timeout: 10000,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update password.");

      setSuccessMsg("Password successfully reset! You can now sign in with your new credentials.");
      setScreen("forgot-success");
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setIsLocalSubmitting(false);
    }
  }

  // Switch between Student and Admin Sign In
  function handleSwitchToAdmin() {
    setLocalError("");
    setNoticeMsg("");
    setLoginRole("admin");
  }

  function handleSwitchToStudent() {
    setLocalError("");
    setNoticeMsg("");
    setLoginRole("student");
  }

  // Sign In as Student with entered email and password
  function handleSignInAsStudent() {
    setLoginRole("student");
    setLocalError("");
    const targetEmail = (email || "").trim();
    const targetPass = password;
    if (!targetEmail) {
      setLocalError("Please enter your registered student email address.");
      return;
    }
    if (!targetPass) {
      setLocalError("Please enter your student password.");
      return;
    }
    if (typeof onLogin === "function") {
      onLogin({
        email: targetEmail,
        password: targetPass,
        isRegister: false,
      });
    }
  }

  // Sign In as Admin with entered admin email and password
  function handleSignInAsAdminSubmit() {
    setLoginRole("admin");
    setLocalError("");
    const targetEmail = (adminEmail || "").trim();
    const targetPass = adminPassword;
    if (!targetEmail) {
      setLocalError("Please enter your administrator email address.");
      return;
    }
    if (!targetPass) {
      setLocalError("Please enter your administrator password.");
      return;
    }
    if (typeof onLogin === "function") {
      onLogin({
        email: targetEmail,
        password: targetPass,
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
    <AuthThemeContext.Provider value={theme}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        {/* Top-Right Corner Day / Night Mode Toggle */}
        <View
          style={{
            position: "absolute",
            top: Platform.OS === "web" ? 20 : 12,
            right: 20,
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            onPress={handleToggleTheme}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.toggleBg,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.toggleBorder,
              shadowColor: "#000",
              shadowOpacity: isDark ? 0.35 : 0.08,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={16}
              color={theme.toggleColor}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: theme.toggleColor,
              }}
            >
              {isDark ? "Day Mode" : "Night Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={[styles.safe, { backgroundColor: theme.bg }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor: theme.bg }}
            contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo & Header */}
            <View style={[styles.logo, { backgroundColor: theme.logoBg, shadowColor: theme.logoBg }]}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={[styles.appName, { color: theme.appName }]}>Study Hours</Text>
            <Text style={[styles.tagline, { color: theme.tagline }]}>
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
            {/* SCREEN 1: SIGN IN (STUDENT / ADMIN PORTAL)                     */}
            {/* ============================================================== */}
            {screen === "login" && (
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                {/* 2 Clean Tabs: Student Login | Admin Login (No 3rd Sign Up tab) */}
                <View style={[styles.roleTabRow, { backgroundColor: isDark ? "#1e293b" : "#F1F5F9" }]}>
                  <TouchableOpacity
                    style={[
                      styles.roleTab,
                      loginRole === "student" && {
                        backgroundColor: theme.primaryBtn,
                        borderColor: theme.primaryBtn,
                      },
                    ]}
                    onPress={() => {
                      setLocalError("");
                      setNoticeMsg("");
                      setLoginRole("student");
                    }}
                  >
                    <Ionicons
                      name="school"
                      size={15}
                      color={loginRole === "student" ? "#FFFFFF" : (isDark ? "#94a3b8" : "#475569")}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.roleTabText,
                        { color: loginRole === "student" ? "#FFFFFF" : (isDark ? "#94a3b8" : "#475569") },
                      ]}
                      numberOfLines={1}
                    >
                      Student Login
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleTab,
                      loginRole === "admin" && {
                        backgroundColor: "#7c3aed",
                        borderColor: "#7c3aed",
                      },
                    ]}
                    onPress={() => {
                      setLocalError("");
                      setNoticeMsg("");
                      setLoginRole("admin");
                    }}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={15}
                      color={loginRole === "admin" ? "#FFFFFF" : (isDark ? "#94a3b8" : "#475569")}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.roleTabText,
                        { color: loginRole === "admin" ? "#FFFFFF" : (isDark ? "#94a3b8" : "#475569") },
                      ]}
                      numberOfLines={1}
                    >
                      Admin Login
                    </Text>
                  </TouchableOpacity>
                </View>

                {loginRole === "student" ? (
                  <>
                    <Text style={[styles.heading, { color: theme.heading }]}>Welcome Back!</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                      Sign in with your student credentials to continue your preparation.
                    </Text>

                    <Field
                      label="Student Email Address"
                      value={email}
                      onChangeText={(val) => {
                        setLocalError("");
                        setEmail(val);
                      }}
                      placeholder="Enter registered email (e.g. bhumikajadhav.aparaitech@gmail.com)"
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
                        <Text style={[styles.link, { color: theme.link }]}>
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
                        <Text style={[styles.forgot, { color: theme.forgot }]}>Forgot password?</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Single Clean Submit Button */}
                    <View style={{ marginTop: 8 }}>
                      <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: theme.primaryBtn }]}
                        onPress={handleSignInAsStudent}
                        activeOpacity={0.85}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="school" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.primaryButtonText}>Sign In as Student</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>

                    <SwitchLink
                      text="Don't have an account?"
                      link="Sign Up"
                      onPress={() => {
                        setLocalError("");
                        setNoticeMsg("");
                        setScreen("signup");
                      }}
                    />
                  </>
                ) : (
                  <>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7c3aed", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.heading, { color: theme.heading, marginBottom: 0 }]}>Admin Sign In</Text>
                    </View>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                      Enter your administrator credentials to access the management portal.
                    </Text>

                    <Field
                      label="Admin Email Address"
                      value={adminEmail}
                      onChangeText={(val) => {
                        setLocalError("");
                        setAdminEmail(val);
                      }}
                      placeholder="Enter admin email (e.g. admin@abhyas.local)"
                      keyboardType="email-address"
                    />

                    <Field
                      label="Admin Password"
                      value={adminPassword}
                      onChangeText={(val) => {
                        setLocalError("");
                        setAdminPassword(val);
                      }}
                      placeholder="Enter admin password"
                      secureTextEntry={!showAdminPassword}
                    />

                    <View style={styles.rowBetween}>
                      <TouchableOpacity onPress={() => setShowAdminPassword(!showAdminPassword)}>
                        <Text style={[styles.link, { color: theme.link }]}>
                          {showAdminPassword ? "Hide password" : "Show password"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setAdminEmail("admin@abhyas.local");
                          setAdminPassword("ChangeMe123!");
                        }}
                      >
                        <Text style={[styles.link, { color: "#7c3aed", fontSize: 12, fontWeight: "700" }]}>
                          Fill default credentials
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Single Clean Submit Button */}
                    <View style={{ marginTop: 8 }}>
                      <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: "#7c3aed" }]}
                        onPress={handleSignInAsAdminSubmit}
                        activeOpacity={0.85}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.primaryButtonText}>Sign In as Admin</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>

                    <SwitchLink
                      text="Student account?"
                      link="Switch to Student Login"
                      onPress={() => {
                        setLocalError("");
                        setNoticeMsg("");
                        setLoginRole("student");
                      }}
                    />
                  </>
                )}
              </View>
            )}

            {/* ============================================================== */}
            {/* SCREEN 3: CREATE ACCOUNT (SIGN UP)                            */}
            {/* ============================================================== */}
            {screen === "signup" && (
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={[styles.heading, { color: theme.heading, marginBottom: 0 }]}>Create Account</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setLocalError("");
                      setNoticeMsg("");
                      setScreen("login");
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: isDark ? "#1e293b" : "#F1F5F9",
                      borderWidth: 1,
                      borderColor: isDark ? "#334155" : "#E2E8F0"
                    }}
                  >
                    <Ionicons name="arrow-back" size={13} color={theme.link} />
                    <Text style={[styles.link, { color: theme.link, fontSize: 12, fontWeight: "700" }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
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
                    <View style={[styles.strengthBarBg, isDark && { backgroundColor: "#1e293b" }]}>
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
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setLocalError("");
                    setConfirmPassword(val);
                  }}
                  placeholder="Re-type your password"
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  style={styles.showPassword}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={[styles.link, { color: theme.link }]}>
                    {showPassword ? "Hide password" : "Show password"}
                  </Text>
                </TouchableOpacity>

                {/* Channel Selector */}
                <View style={styles.methodChoiceRow}>
                  <Text style={[styles.methodChoiceLabel, { color: theme.subtitle }]}>Send OTP to:</Text>
                  <TouchableOpacity
                    style={[
                      styles.smallChoicePill,
                      { backgroundColor: theme.choicePillBg, borderColor: theme.choicePillBorder },
                      method === "email" && { backgroundColor: theme.choicePillActiveBg, borderColor: theme.choicePillActiveBorder },
                    ]}
                    onPress={() => setMethod("email")}
                  >
                    <Text
                      style={[
                        styles.smallChoiceText,
                        { color: method === "email" ? theme.choicePillActiveText : theme.choicePillText },
                      ]}
                    >
                      Email Inbox
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.smallChoicePill,
                      { backgroundColor: theme.choicePillBg, borderColor: theme.choicePillBorder },
                      method === "mobile" && { backgroundColor: theme.choicePillActiveBg, borderColor: theme.choicePillActiveBorder },
                    ]}
                    onPress={() => setMethod("mobile")}
                  >
                    <Text
                      style={[
                        styles.smallChoiceText,
                        { color: method === "mobile" ? theme.choicePillActiveText : theme.choicePillText },
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
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.heading, { color: theme.heading }]}>Verify Your Code</Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                  Please enter the 6-digit verification code sent to{" "}
                  <Text style={{ fontWeight: "700", color: theme.highlightText }}>
                    {targetContact}
                  </Text>
                </Text>

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
                      <Text style={[styles.resendLink, { color: theme.resendLink }]}>Resend Code Now</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.countdownText, { color: theme.resendText }]}>
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
            {/* SCREEN 5: FORGOT PASSWORD - STEP 1 (CONTACT SELECTION)         */}
            {/* ============================================================== */}
            {screen === "forgot-contact" && (
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.heading, { color: theme.heading }]}>Forgot Password</Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                  Choose whether you want to identify via Email or Mobile. The OTP verification code will be dispatched to your registered email.
                </Text>

                {/* Delivery method pills */}
                <View style={styles.methodRow}>
                  <TouchableOpacity
                    style={[styles.methodButton, method === "email" ? styles.methodSelected : null]}
                    onPress={() => setMethod("email")}
                  >
                    <Text style={[styles.methodText, method === "email" ? styles.methodTextSelected : null]}>
                      ✉️ Via Email
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.methodButton, method === "mobile" ? styles.methodSelected : null]}
                    onPress={() => setMethod("mobile")}
                  >
                    <Text style={[styles.methodText, method === "mobile" ? styles.methodTextSelected : null]}>
                      📱 Via Mobile
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
                      ? "Enter registered email (e.g. bhumikajadhav.aparaitech@gmail.com)"
                      : "Enter 10-digit mobile number"
                  }
                  keyboardType={method === "email" ? "email-address" : "phone-pad"}
                  maxLength={method === "mobile" ? 10 : undefined}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: isDark ? "#1e293b" : "#eff6ff",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: isDark ? "#334155" : "#bfdbfe"
                  }}
                >
                  <Ionicons name="mail-unread-outline" size={16} color={theme.primaryBtn} />
                  <Text style={{ fontSize: 11, color: isDark ? "#93c5fd" : "#1e40af", flex: 1, lineHeight: 15 }}>
                    Whichever option you choose, your OTP reset code is dispatched to your registered email inbox.
                  </Text>
                </View>

                <PrimaryButton
                  title={isLocalSubmitting ? "Sending verification code..." : "Send Verification Code"}
                  onPress={handleForgotSendOtp}
                  disabled={isSubmitting || isLocalSubmitting}
                  isSubmitting={isLocalSubmitting}
                />

                <View style={{ marginTop: 12, alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setLocalError("");
                      setNoticeMsg("");
                      setScreen("forgot-otp");
                    }}
                  >
                    <Text style={[styles.link, { color: theme.link, fontSize: 13, fontWeight: "600" }]}>
                      Already received OTP on mail? Enter Code Here →
                    </Text>
                  </TouchableOpacity>
                </View>

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
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.heading, { color: theme.heading }]}>Enter Verification Code</Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                  Enter the 6-digit code received on{" "}
                  <Text style={{ fontWeight: "700", color: theme.highlightText }}>
                    {targetContact}
                  </Text>
                </Text>

                {/* 6 Digit Boxes */}
                <SixDigitInput
                  otp={otp}
                  setOtp={setOtp}
                  onComplete={(code) => handleForgotVerifyOtp(code)}
                />

                {/* Direct Full-Field OTP Input for 100% Reliability */}
                <Field
                  label="Or enter 6-digit OTP code directly"
                  value={otp}
                  onChangeText={(val) => {
                    setLocalError("");
                    const cleaned = val.replace(/\D/g, "").slice(0, 6);
                    setOtp(cleaned);
                    if (cleaned.length === 6) {
                      handleForgotVerifyOtp(cleaned);
                    }
                  }}
                  placeholder="Enter 6-digit OTP (e.g. 123456)"
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <PrimaryButton
                  title={isLocalSubmitting ? "Verifying code..." : "Verify Reset Code"}
                  onPress={() => handleForgotVerifyOtp(otp)}
                  disabled={otp.length < 6 || isLocalSubmitting}
                  isSubmitting={isLocalSubmitting}
                />

                <View style={styles.resendRow}>
                  {canResend ? (
                    <TouchableOpacity onPress={handleForgotSendOtp} disabled={isLocalSubmitting}>
                      <Text style={[styles.resendLink, { color: theme.resendLink }]}>Resend Code Now</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.countdownText, { color: theme.resendText }]}>
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
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.heading, { color: theme.heading }]}>Set New Password</Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
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
                    <View style={[styles.strengthBarBg, isDark && { backgroundColor: "#1e293b" }]}>
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
                  <Text style={[styles.link, { color: theme.link }]}>
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
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={styles.successIconBadge}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={[styles.heading, { textAlign: "center", color: theme.heading }]}>
                  Password Reset!
                </Text>
                <Text style={[styles.subtitle, { textAlign: "center", color: theme.subtitle }]}>
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

            <Text style={[styles.footer, { color: theme.footer }]}>
              Learn consistently. Track progress. Achieve your goals.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
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
    fontSize: 27,
    fontWeight: "800",
    color: "#18356B",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  tagline: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    fontWeight: "500",
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
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
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
  roleSection: {
    marginTop: 16,
    marginBottom: 6,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  roleActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  roleActionBtnText: {
    fontSize: 14,
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
  roleTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    padding: 4,
    borderRadius: 12,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "transparent",
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: "700",
  },
  otpBoxesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
    alignSelf: "center",
    width: "100%",
    maxWidth: 340,
  },
  otpBox: {
    width: 42,
    height: 48,
    maxWidth: 46,
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D8E2F1",
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    color: "#172F5D",
    textAlign: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}),
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
