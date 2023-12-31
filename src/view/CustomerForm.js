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

const CustomerForm = ({ user, closeForm, trigger }) => {
  const [userData, setUserDate] = useState(user || {});

  // const [importDateStr, setImportDateStr] = useState(initialDate.toISOString().split('T')[0]);
  const [personId, setPersionId] = useState(userData.personId || '');
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [email, setEmail] = useState(userData.email || 0);
  const [city, setCity] = useState(userData.city || 0);
  const [phone, setPhone] = useState(userData.phone || '');
  const [street, setStreet] = useState(userData.street || '');
  const [status, setStatus] = useState(userData.status);
  const [roles, setRoles] = useState(userData.account.role.roleName === 'admin' ? 2 : 1);
  const [passWord, setPassWord] = useState(userData.account.password || '');
  const [checked, setChecked] = useState(userData.status || false);

  const consoleLog = () => {
    console.log('personId: ', personId);
    console.log('role: ', roles);
    console.log('status: ', status);
    console.log('phone: ', phone);
    console.log('passWord: ', passWord);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8081/customer/update/${personId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          city,
          phone,
          street,
          passWord,
          status,
          userName: phone,
          roleId: roles,
        }),
      });

      if (!response.ok) {
        console.error('Error updating customer:', response.status, response.statusText);
        return;
      }

      const responseData = await response.json();
      console.log(responseData);
      trigger();
      closeForm();
    } catch (error) {
      console.error('Error updating customer:', error.message);
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
                  <Input id="password" type="text" value={passWord} onChange={(e) => setPassWord(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <FormControl fullWidth>
                  <Switch
                    id="status"
                    checked={status === 1}
                    onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                    name="status"
                  />
                </FormControl>
              </Grid>


              {/* ============== */}

              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <InputLabel htmlFor="radio" style={{ marginBottom: '10px' }}>Role</InputLabel>
                  <RadioGroup
                    id="radio"
                    value={roles === 2 ? 'admin' : 'user'}
                    onChange={(e) => setRoles(e.target.value === 'admin' ? 2 : 1)}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel value="user" control={<Radio />} label="User" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* ============ */}
              <Grid item xs={6}>
                <Button color="success" onClick={handleUpdate}>
                  Save
                </Button>
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

export default CustomerForm;
