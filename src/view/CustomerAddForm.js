import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  RadioGroup,
  Switch,
  FormControlLabel,
  FormLabel,
  Radio,
  FormGroup,
  Snackbar,
  Alert,
  Checkbox,
} from '@mui/material';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Make sure to import the 'toast' module

const CustomerAddForm = ({ loseForm }) => {
  const [closeForm, setCloseForm] = useState(loseForm || {});
  const [personId, setPersionId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [status, setStatus] = useState(null);
  const [roleId, setRoleId] = useState('');
  const [passWord, setPassword] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'user':
        setUserName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'rPassword':
        setRPassword(value);
        break;
      case 'fName':
        setFirstName(value);
        break;
      case 'lName':
        setLastName(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'street':
        setStreet(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'roleId':
        setRoleId(value);
        break;
      default:
        break;
    }
  };
  const user = {
    userName,
    passWord,
    firstName,
    lastName,
    city,
    email,
    street,
    phone,
    roleId,
    status: 1,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passWord !== rPassword) {
      toast.error("Mật khẩu không trùng khớp");
    } else {
      const user = {
        userName,
        passWord,
        firstName,
        lastName,
        city,
        email,
        street,
        phone,
        roleId,
        status: 1,
      };

      try {
        const response = await fetch("http://localhost:8081/customer/add", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          toast.success("Đăng ký thành công");
        } else {
          toast.error("Đăng ký thất bại");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        toast.error("Đăng ký thất bại");
      }
    }
  };



  const handleCancel = () => {
    closeForm();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" position={'fixed'} top={'10%'} left={'0px'}>
      <Grid item xs={8} height={'100%'}>
        <Paper
          elevation={3}
          style={{ padding: '20px', background: '#F6FAFA', boxshadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <form>
            <h2>Chỉnh sửa người dùng</h2>
            <Grid container spacing={2}>
              {/* ====Name */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="lastName">Last Name</InputLabel>
                  <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>
              </Grid>

              {/* =============================================== */}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="dateOfBirth">Thành phố</InputLabel>
                  <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </FormControl>
              </Grid>
              {/* ============== */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <Input id="address" type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
                </FormControl>
              </Grid>

              {/* ============= */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" type="text" value={passWord} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">RePassword</InputLabel>
                  <Input id="password" type="text" value={rPassword} onChange={(e) => setRPassword(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="user">UserName</InputLabel>
                  <Input id="user" type="text" value={phone} onChange={(e) => setUserName(e.target.value)} />
                </FormControl>
              </Grid>

              {/* ============== */}

              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <InputLabel htmlFor="radio" style={{ marginBottom: '20px' }}>
                    Role
                  </InputLabel>
                  <RadioGroup
                    id="radio"
                    value={roleId === 2 ? 'admin' : 'user'}
                    onChange={(e) => setRoleId(e.target.value === 'admin' ? 2 : 1)}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel value="user" control={<Radio />} label="User" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* ============ */}
              <Grid item xs={6}>
                <Button color="success">Save</Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleCancel}>Cancel</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CustomerAddForm;
