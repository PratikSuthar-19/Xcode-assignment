import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signup, login } from "@/api/auth"
import { Link, useNavigate } from "react-router-dom"

interface AuthFormProps {
  type: "login" | "signup"
}

export default function AuthForm({ type }: AuthFormProps) {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      if (type === "signup") {
        const res = await signup(formData)
        setMessage("Signup successful!")
        setTimeout(() => navigate("/login"), 1000)
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
        })
        localStorage.setItem("token", res.token)
        setMessage("Login successful!")
        setTimeout(() => navigate("/media"), 1000)
      }
    } catch (err: any) {
      setMessage("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row">
      {/* Left Side (optional image or gradient) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <h1 className="text-5xl font-bold tracking-tight text-gray-200">
          {type === "signup" ? "Join Us 🚀" : "Welcome Back 👋"}
        </h1>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md p-8 rounded-2xl border border-gray-800 bg-neutral-950 shadow-xl transition-all duration-300 hover:shadow-gray-800/30">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {type === "signup" ? "Create Account" : "Log In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {type === "signup" && (
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 focus:ring-0 rounded-xl transition-all duration-300"
              />
            )}

            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 focus:ring-0 rounded-xl transition-all duration-300"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password (minmun 6 length)"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 focus:ring-0 rounded-xl transition-all duration-300"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-2 rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {loading
                ? type === "signup"
                  ? "Creating..."
                  : "Logging in..."
                : type === "signup"
                ? "Sign Up"
                : "Log In"}
            </Button>
          </form>

          {message && (
            <p
              className={`text-center text-sm mt-4 transition-all duration-300 ${
                message.includes("Error") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}

           <p className="text-center text-sm text-gray-400 mt-6">
            {type === "signup" ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  )
}
