import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '../hooks/use-auth';
import { Navigate } from 'react-router';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          {...register('email', { required: true })}
          placeholder="Email"
        />
        {errors.email && <span>This field is required</span>}
      </div>

      <div>
        <input
          type="password"
          {...register('password', { required: true })}
          placeholder="Password"
        />
        {errors.password && <span>This field is required</span>}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button disabled={loading} type="submit">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
