import React, { useState } from "react";
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

export default function AuthScreens({ onLogin, authError, isSubmitting }) {
  const [screen, setScreen] = useState("login");
  const [method, setMethod] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const contact = method === "email" ? email : mobile;
  const displayError = authError || localError;

  function handleLogin() {
    setLocalError("");
    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }

    if (typeof onLogin !== "function") {
      Alert.alert("Connection error", "Login is not connected to the app.");
      return;
    }

    onLogin({
      email: email.trim(),
      password,
      isRegister: false,
    });
  }

  function handleSignup() {
    setLocalError("");
    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      setLocalError("Please fill in all fields to create an account.");
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setLocalError("Please enter a valid email address.");
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      setLocalError("Mobile number must be exactly 10 digits.");
      Alert.alert("Invalid mobile", "Enter a 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      Alert.alert("Password", "Use at least 6 characters.");
      return;
    }

    if (typeof onLogin !== "function") {
      Alert.alert("Connection error", "Signup is not connected to the app.");
      return;
    }

    onLogin({
      name: name.trim(),
      email: email.trim(),
      password,
      isRegister: true,
    });
  }

  function handleVerify() {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid OTP", "Enter all 6 digits.");
      return;
    }

    Alert.alert(
      "OTP Verified",
      "OTP simulated successfully. You can now sign in with your credentials."
    );
    setScreen("login");
  }

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

  function Field({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    maxLength,
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(val) => {
            setLocalError("");
            onChangeText(val);
          }}
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

  function PrimaryButton({ title, onPress, disabled }) {
    return (
      <TouchableOpacity
        style={[styles.primaryButton, disabled && { opacity: 0.7 }]}
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

  function openOTP() {
    if (!email.trim()) {
      Alert.alert("Required", "Enter your email address first to reset password.");
      return;
    }

    setMethod("email");
    setOtp("");
    setScreen("otp");
  }

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
          {/* Brand Logo & Header */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>

          <Text style={styles.appName}>Study Hours</Text>
          <Text style={styles.tagline}>
            Your journey to UPSC &amp; MPSC success
          </Text>

          {/* Error Banner */}
          {Boolean(displayError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {displayError}</Text>
            </View>
          )}

          <View style={styles.card}>
            {screen === "login" && (
              <>
                <Text style={styles.heading}>Welcome Back!</Text>
                <Text style={styles.subtitle}>
                  Sign in to continue your preparation.
                </Text>

                <Field
                  label="Email address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email (e.g. student@abhyas.local)"
                  keyboardType="email-address"
                />

                <Field
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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

                <TouchableOpacity onPress={openOTP}>
                  <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>

                <PrimaryButton
                  title="Sign In"
                  onPress={handleLogin}
                  disabled={isSubmitting}
                />

                {/* 1-Tap Quick Demo Sign In */}
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
                    setScreen("signup");
                  }}
                />
              </>
            )}

            {screen === "signup" && (
              <>
                <Text style={styles.heading}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Start tracking your study journey.
                </Text>

                <Field
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                />

                <Field
                  label="Email address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                />

                <Field
                  label="Mobile number"
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <Field
                  label="Create password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
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
                  title="Create Account"
                  onPress={handleSignup}
                  disabled={isSubmitting}
                />

                <SwitchLink
                  text="Already have an account?"
                  link="Sign In"
                  onPress={() => {
                    setLocalError("");
                    setScreen("login");
                  }}
                />
              </>
            )}

            {screen === "otp" && (
              <>
                <Text style={styles.heading}>Verify Your Account</Text>
                <Text style={styles.subtitle}>
                  Enter the 6-digit verification code sent to your contact.
                </Text>

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
                      Email OTP
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
                      SMS OTP
                    </Text>
                  </TouchableOpacity>
                </View>

                <Field
                  label={method === "email" ? "Email address" : "Mobile number"}
                  value={contact}
                  onChangeText={method === "email" ? setEmail : setMobile}
                  placeholder={
                    method === "email"
                      ? "Enter your email"
                      : "Enter your mobile number"
                  }
                  keyboardType={
                    method === "email" ? "email-address" : "phone-pad"
                  }
                  maxLength={method === "mobile" ? 10 : undefined}
                />

                <Text style={styles.label}>6-digit verification code</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                  onChangeText={(value) =>
                    setOtp(value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="• • • • • •"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <PrimaryButton
                  title="Verify & Continue"
                  onPress={handleVerify}
                />

                <SwitchLink
                  text="Go back to"
                  link="Sign In"
                  onPress={() => {
                    setLocalError("");
                    setScreen("login");
                  }}
                />
              </>
            )}
          </View>

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
    paddingHorizontal: 22,
    paddingVertical: 28,
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
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
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
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 7,
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
  showPassword: {
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 12,
  },
  forgot: {
    textAlign: "right",
    color: BLUE,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 20,
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
    marginBottom: 18,
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
    backgroundColor: "#EAF1FF",
  },
  methodText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 13,
  },
  methodTextSelected: {
    color: BLUE,
  },
  otpInput: {
    textAlign: "center",
    letterSpacing: 8,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
  },
  footer: {
    color: "#8290A6",
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },
});
