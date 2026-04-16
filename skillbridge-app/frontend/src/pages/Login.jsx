import React, { useState } from "react";

const Login3D = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // ✅ STATE
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    role: "",
  });

  // ✅ LOGIN API
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
      } else {
        alert("Login successful ✅");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ REGISTER API
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
      } else {
        alert("Registered successfully 🎉");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {isLogin ? (
        <div className="glass w-full max-w-md p-8 rounded-2xl glow-purple animate-float">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2 glow-text">
              Welcome Back
            </h2>
            <p className="text-purple-300 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="input-glow w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 ring-purple-500/50 transition-all duration-300"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="input-glow w-full pr-12 px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 ring-purple-500/50 transition-all duration-300"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-purple-400"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                👁
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-purple-400">
            Not registered?{" "}
            <button onClick={() => setIsLogin(false)}>
              Create account
            </button>
          </p>
        </div>
      ) : (
        <div className="glass w-full max-w-md p-8 rounded-2xl glow-purple animate-float">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2 glow-text">
              Join SkillBridge
            </h2>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              required
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
              className="input-glow w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
                className="input-glow w-full pr-12 px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowRegisterPassword(!showRegisterPassword)
                }
                className="absolute inset-y-0 right-3"
              >
                👁
              </button>
            </div>

            {/* ROLE */}
            <select
              required
              value={registerData.role}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  role: e.target.value,
                })
              }
              className="input-glow w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white"
            >
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-purple-400">
            Have account?{" "}
            <button onClick={() => setIsLogin(true)}>
              Sign in here
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login3D;