import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import { Link, Navigate, useNavigate } from "react-router";
import ErrorMessage from "../components/error-message";

export type CreateUserForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const Login = () => {
  const { register: userRegister, user, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserForm>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreateUserForm> = async (data) => {
    await userRegister(data);
    navigate("/login");
  };

  if (user) return <Navigate to="/" />;

  return (
    <main className="w-[300px] mt-18 mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-800">Register</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create an account to access your dashboard and track payments easily
        </p>
      </header>
      <form
        className="flex flex-col justify-center items-center gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <label htmlFor="email" className="text-sm text-gray-600">
            First Name
          </label>
          <input
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm placeholder:text-sm"
            type="text"
            {...register("firstName", { required: true })}
            placeholder="First Name"
          />
          {errors.email && <ErrorMessage error="This field is required" />}
        </div>

        <div className="w-full">
          <label htmlFor="lastName" className="text-sm text-gray-600">
            Last Name
          </label>
          <input
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm placeholder:text-sm"
            type="text"
            {...register("lastName", { required: true })}
            placeholder="Last Name"
          />
          {errors.lastName && <ErrorMessage error="This field is required" />}
        </div>

        <div className="w-full">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm placeholder:text-sm"
            type="email"
            {...register("email", { required: true })}
            placeholder="usuario@email.com"
          />
          {errors.email && <ErrorMessage error="This field is required" />}
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-sm text-gray-600">
            Password
          </label>
          <input
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm placeholder:text-sm"
            type="password"
            {...register("password", { required: true })}
            placeholder="*******"
          />
          {errors.password && <ErrorMessage error="This field is required" />}
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          className="bg-teal-600 rounded-md text-white pb-2 pt-2 text-sm font-semibold mt-4 w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link className="underline font-semibold text-teal-600" to={"/"}>
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
