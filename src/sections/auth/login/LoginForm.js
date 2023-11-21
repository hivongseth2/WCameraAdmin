import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm({ onToast }) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleOnchange= (event) => {
    const { name, value } = event.target;
    if (name === 'userName') {
      setUserName(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
  
    const formData = {
      userName,
      password,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8081/auth/login",
        formData
      );
  
      const data = response.data;
      console.log(data);
  
      if (data) {
        localStorage.setItem("data", JSON.stringify(data));
  
        // Check if roleId is 2
        if (data.roleId === 2) {
          onToast.success(
            `Chào mừng ${data.firstName} ${data.lastName} đã quay trở lại!`
          );
          navigate('/dashboard', { replace: true });
          setIsLoggedIn(true);
        } else {
          // Handle login failure for roleId not equal to 2
          setError("Invalid role for login");
          onToast.error(`Sai tài khoản hoặc mật khẩu!`);
        }
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      onToast.error(`Sai tài khoản hoặc mật khẩu!`);
    }
  };
  

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="userName" label="UserName" value={userName} 
          onChange={handleOnchange} 
          error={error}
          helperText={error}
        />

        <TextField
          name="password"
          label="Password"
          value={password}
          onChange={handleOnchange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSignIn}>
        Login
      </LoadingButton>
    </>
  );
}
