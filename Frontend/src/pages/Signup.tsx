import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      alert("Signup success 🎉");
      console.log(res.data);

    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg">
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}