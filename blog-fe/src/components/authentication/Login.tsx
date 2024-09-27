import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../inputBox/Input";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from 'react-toastify'; // Import toast

const schema = z.object({
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

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { login } = authContext;
  const navigate = useNavigate();

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
      const response = await login(data);
      
      if (response) {
        toast.success("Login successful!"); 
        navigate("/profile"); 
      } else {
        toast.error("Login failed. Please check your credentials."); 
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again."); 
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
