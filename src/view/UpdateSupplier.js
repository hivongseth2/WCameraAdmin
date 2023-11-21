import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';

const UpdateSupplier = ({ onClose, initialSupplierInfo }) => {
    console.log(initialSupplierInfo);
  const [supplierInfo, setSupplierInfo] = useState(initialSupplierInfo || {
    name: '',
    image: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplierInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierInfo),
    };
    fetch(`http://localhost:8081/brand/update/${supplierInfo.brandId}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          onClose();
          console.log('Supplier updated successfully.');
        } else {
          console.error('Failed to update supplier.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Supplier
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Supplier Name"
            variant="outlined"
            name="name"
            value={supplierInfo.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Image URL"
            variant="outlined"
            name="image"
            value={supplierInfo.image}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" >
            Save
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default UpdateSupplier;
