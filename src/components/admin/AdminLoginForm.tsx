import { useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { TextField, IconButton, InputAdornment, FormLabel, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '../../store/useAuthStore';
import { LoginDataProps } from '../../types';
import { useNavigate } from 'react-router-dom';

/**
 * A component for handling admin login
 * @returns {JSX.Element} A form component for admin login
 */
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthStore();
  // Schema for login form validation using Zod
  const LoginDataSchema: ZodType = z.object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required')
  });

  // Toggle password visibility
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // Form handling with react-hook-form

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(LoginDataSchema)
  });

  const navigate = useNavigate();

  /**
   * Handles form submission for admin login.
   * @param {LoginDataProps} data - Form data
   * @returns {Promise<void>} A promise that resolves when the login action completes
   */
  const onSubmit: SubmitHandler<LoginDataProps> = async (data) => {
    setIsSubmitting(true); // Set submitting state to true
    try {
      data.email = data.email.toLowerCase(); // Convert email to lowercase
      navigate('/admin');
      await login(data); // Perform login action
    } catch (error) {
      console.error('Login error:', error); // Log error if login fails
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success or failure
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <FormLabel>Email</FormLabel>
          <TextField
            fullWidth
            autoComplete="email"
            id="email"
            type="text"
            placeholder="Enter Email"
            sx={{
              outline: 'none',
              mt: 1.5,
              mb: 4
            }}
            {...register('email')}
            error={Boolean(errors.email && errors.email)}
            helperText={errors.email?.message}
          />
          <FormLabel>Password</FormLabel>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Your Password"
            id="password"
            {...register('password')}
            sx={{
              outline: 'none',
              mt: 1.5,
              mb: 3
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(errors.password && errors.password)}
            helperText={errors.password && errors.password?.message}
          />

          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />
        </Stack> */}

          <LoadingButton
            fullWidth
            size="large"
            sx={{
              mt: 3,
              backgroundColor: '#2E4AE6',
              color: 'white',
              '&:hover': {
                color: '#3449DD',
                backgroundColor: '#fff'
              }
            }}
            type="submit"
            loading={isSubmitting}
            id="login-button"
          >
            Login
          </LoadingButton>
        </Container>
      </form>
    </>
  );
};

export default LoginForm;
