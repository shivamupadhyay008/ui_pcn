import React, { useState } from "react";
import { loginModalStyles } from "../common/styles";
import { ArkColors } from "../common/constants/colors";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login } from "../services/auth";

import { isValidEmail, isValidPassword } from "../common/constants/storage";

import { setAuthToken } from "../api/axiosinstance";

export const APP_LOGIN_TOKEN = "app-x-token";

export default function LoginModal({ open, onClose, actionCb = () => {} }) {
  const [form, setForm] = useState({
    values: { email: "", password: "" },

    errors: { email: "", password: "", global: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  if (!open) return null;

  // Reset states & close modal

  const handleClose = () => {
    setForm({
      values: { email: "", password: "" },

      errors: { email: "", password: "", global: "" },
    });

    setShowPassword(false);

    setIsLoading(false);

    setShowRegisterPrompt(false);

    onClose();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,

      values: { ...prev.values, [field]: value },

      errors: { ...prev.errors, [field]: "" }, // clear error on change
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    let newErrors = { email: "", password: "", global: "" };

    // Validation

    if (!form.values.email.trim()) {
      newErrors.email = "Email is required";

      hasError = true;
    } else if (!isValidEmail(form.values.email)) {
      newErrors.email = "Please enter a valid email address";

      hasError = true;
    }

    if (!form.values.password.trim()) {
      newErrors.password = "Password is required";

      hasError = true;
    } else if (!isValidPassword(form.values.password)) {
      newErrors.password = "Password must be at least 6 characters";

      hasError = true;
    }

    if (hasError) {
      setForm((prev) => ({ ...prev, errors: newErrors }));

      return;
    }

    setIsLoading(true);

    try {
      const res = await login(
        form.values.email.trim().toLowerCase(),

        form.values.password
      );

      if (res?.success) {
        alert("Login successful!");

        localStorage.setItem(APP_LOGIN_TOKEN, res?.token);

        window._token = res?.token;

        setAuthToken(res?.token);

        handleClose();

        actionCb();
      } else {
        setForm((prev) => ({
          ...prev,

          errors: { ...prev.errors, global: res?.error || "Login failed" },
        }));
      }
    } catch (err) {
      console.error("Login error:", err);

      setForm((prev) => ({
        ...prev,

        errors: {
          ...prev.errors,

          global: err?.response?.data?.message || "Login failed",
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterPrompt(true);
  };

  return (
    <div className={loginModalStyles.backdrop}>
      <div className={loginModalStyles.container}>
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={import.meta.env.VITE_FULL_LOGO}
            alt="logo"
            className={loginModalStyles.logo}
          />
        </div>

        {/* Header */}
        <h2 className={loginModalStyles.header}>
          <span className="font-bold">Login</span> to Ark Enterprise Platform
        </h2>

        {/* Global Error */}

        {form.errors.global && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-center">
            <p className="text-sm text-red-600">{form.errors.global}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={loginModalStyles.emailInput}
              placeholder="Enter your email"
              autoComplete="username"
            />

            {form.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.values.password}
              placeholder="Enter your password"
              onChange={(e) => handleChange("password", e.target.value)}
              className={`${loginModalStyles.emailInput} pr-10`}
              autoComplete="current-password"
            />

            {form.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.errors.password}
              </p>
            )}

            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={isLoading}
              className={loginModalStyles.submitButton}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleRegisterClick}
              className={loginModalStyles.registerButton}
            >
              Register
            </button>
          </div>
        </form>

        {/* Register Prompt */}

        {showRegisterPrompt && (
          <div className="mt-5 p-4 border rounded-lg bg-gray-50 text-center">
            <p className="mb-2 font-medium">Do you want to register?</p>
            <p className="text-sm text-gray-600 mb-3">
              Please register using our mobile app:
            </p>
            <div className="flex justify-center space-x-6">
              {/* Play Store */}
              <a
                href="https://play.google.com/store/apps/details?id=com.thearkconnect.social.prod"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </a>

              {/* App Store */}
              <a
                href="https://apps.apple.com/us/app/the-ark-connect-share-pray/id6467191282"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        )}

        {/* Close button */}
        <button onClick={handleClose} className={loginModalStyles.closeButton}>
          ✕
        </button>
      </div>
    </div>
  );
}