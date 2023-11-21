import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

// ...

export default function OrderPage() {
  // Define the state for managing the active tab
  const [value, setValue] = useState(0);

  // Define a function to handle tab changes
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Add the tabs to switch between different statusOrder values */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="order-status-tabs">
          <Tab label="Hủy" />
          <Tab label="Đang xử lý" />
          <Tab label="Đang vận chuyển" />
          <Tab label="Hoàn thành" />
        </Tabs>
      </Box>

      {/* Render different content based on the active tab value */}
      <CustomTabPanel value={value} index={0}>
        {renderOrderListByStatus('Hủy')}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {renderOrderListByStatus('Đang xử lý')}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {renderOrderListByStatus('Đang vận chuyển')}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {renderOrderListByStatus('Hoàn thành')}
      </CustomTabPanel>
    </>
  );
}
