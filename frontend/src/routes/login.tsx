import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import { Link, Navigate } from "react-router";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const { login, user, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    await login(data.email, data.password);
  };

  if (user) return <Navigate to="/" />;

  return (
    <main className="w-[300px] mt-18 mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">
          Access your dashboard to track payments easily
        </p>
      </header>
      <form
        className="flex flex-col justify-center items-center gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          {errors.email && <span>This field is required</span>}
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
          {errors.password && <span>This field is required</span>}
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          className="bg-teal-600 rounded-md text-white pb-2 pt-2 text-sm font-semibold mt-4 w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-gray-500">
          Don't have an account? <Link className="underline font-semibold text-teal-600" to={"/"}>Sign up</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
