import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create query parameters (mimics Angular's ?email=...&password=...)
      const queryParams = new URLSearchParams({
        email,
        password,
      });

      const response = await fetch(`http://127.0.0.1:8000/login?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          // No Content-Type needed since we're not sending a body
        },
        // No body needed, as parameters are in the query string
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.statusText} (${errorText})`);
      }

      const data = await response.json();

      // Store the access token in localStorage
      localStorage.setItem("access_token", data.access_token);

      toast({
        title: "Success",
        description: "You have successfully logged in",
      });

      // Redirect to the main page after login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-gray-200 focus:border-blue-500 transition-all duration-300"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-700">Password</Label>
          <a href="#" className="text-xs text-gray-500 hover:text-blue-600 hover:underline transition-colors duration-200">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-gray-200 focus:border-blue-500 transition-all duration-300"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Signing in...
          </span>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Sign in to your account
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;