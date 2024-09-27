import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Input from "../inputBox/Input";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from 'react-toastify'; // Import toast

const schema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .max(50, "Full name cannot exceed 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}users/signUp`, data);
      toast.success("Sign up successful!"); // Show success message

      console.log("API response:", response.data);

      await login({ email: data.email, password: data.password });

      navigate("/profile");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Sign up failed. Please try again."
      ); // Show error message
      console.error("Error:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full Name"
          {...register("fullname")}
          type="text"
          className={errors.fullname ? "is-invalid" : ""}
        />
        {errors.fullname && (
          <div className="invalid-feedback">{errors.fullname.message}</div>
        )}

        <Input
          label="Username"
          {...register("username")}
          type="text"
          className={errors.username ? "is-invalid" : ""}
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username.message}</div>
        )}

        <Input
          label="Email"
          {...register("email")}
          type="email"
          className={errors.email ? "is-invalid" : ""}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}

        <Input
          label="Password"
          {...register("password")}
          type="password"
          className={errors.password ? "is-invalid" : ""}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <Link to="/home" className="btn btn-secondary mt-3 ms-2">
          Use App as Guest
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
