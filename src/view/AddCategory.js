import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';

const AddSupplier = ({ onClose }) => {
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    image: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplierInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    console.log(supplierInfo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierInfo),
    };

    try {
      const response = await fetch('http://localhost:8081/categories/add', requestOptions);
      if (response.ok) {
        onClose();
        console.log('Category added successfully.');
      } else {
        console.error('Failed to add Category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Category Name"
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
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default AddSupplier;
