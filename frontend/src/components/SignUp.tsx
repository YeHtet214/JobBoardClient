import { useRef, FormEvent, useState } from "react";
import axios from "axios";

interface SignUpResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        }
    }
}

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const role = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate form fields
        if (!firstName.current?.value || !lastName.current?.value || 
            !email.current?.value || !password.current?.value || !role.current?.value) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post<SignUpResponse>("http://localhost:3000/api/auth/sign-up", {
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                email: email.current.value,
                password: password.current.value,
                role: role.current.value
            });

            // Handle successful signup
            if (response.data.success) {
                // Store tokens if needed
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                
                // You might want to redirect or show a success message here
                alert(response.data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during sign up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        ref={firstName}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <div>
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        ref={lastName}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <div>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        ref={email}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        ref={password}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <div>
                    <input
                        name="role"
                        type="text"
                        placeholder="Role"
                        ref={role}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
                <div>
                    <div className="text-center relative">
                        <div className="absolute left-0 top-1/2 w-full border-t bg-gray-500"></div>
                        <span className="relative px-4 z-10 bg-white">OR</span>
                    </div>
                </div>
                <a
                    href="http://localhost:3000/api/auth/google"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 text-center"
                >
                    Login with Google
                </a>
                <div>
                    <p>Already have an account? <a href="/login" className="text-blue-500">Log In</a></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;