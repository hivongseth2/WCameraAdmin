import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';

const UpdateCategory = ({ onClose, initialSupplierInfo }) => {
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
    fetch(`http://localhost:8081/categories/update/${supplierInfo.categoryId}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          onClose();
          console.log('Category updated successfully.');
        } else {
          console.error('Failed to update Category.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Update Category
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
          <Button type="submit" variant="contained" color="primary" >
            Save
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default UpdateCategory;
