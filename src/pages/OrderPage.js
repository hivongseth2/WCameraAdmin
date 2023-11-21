import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState, useContext } from 'react';

import { sentenceCase } from 'change-case';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Select,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Box,
  Tab,
  Tabs,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import axios from 'axios';

import CustomerForm from '../view/CustomerForm';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { CustomFetch } from '../utils/CustomFetch';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Họ và Tên', alignRight: false },
  { id: 'phone', label: 'Số điện thoại', alignRight: false },

  { id: 'email', label: 'Email', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'date', label: 'Ngày đặt hàng', alignRight: false },

  { id: 'quantity', label: 'số lượng', alignRight: false },
  { id: 'total', label: 'Tổng tiền', alignRight: false },
  { id: 'statusOrder', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

// --------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.date.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
  // phân tab

  //
  const [value, setValue] = useState(0);

  // Define a function to handle tab changes
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // =========

  function renderOrderListByStatus(status) {
    const filteredOrders = applySortFilter(
      orderData.filter((order1) => {
        return Number(order1.status) === status;
      })
      // getComparator(order, orderBy)
    );
    // const filteredOrders = orderData;
    return (
      <Container>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredOrders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id = row.orderId,
                      name = `${row.customer.firstName} ${row.customer.lastName} `,
                      phone = row.customer.phone,
                      email = row.customer.email,
                      date = row.orderDate,
                      address = row.address,
                      quantity = row.orderDetails.reduce((total, item) => total + item.quantity, 0),
                      total = row.orderDetails.reduce((total, item) => total + item.quantity * item.price, 0),
                      statusOrder,
                    } = row;

                    const selectedUser = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar src={row.image} alt={firstName} />
                            <Typography variant="subtitle2" noWrap>
                              {`${firstName} ${lastName}`}
                            </Typography>
                          </Stack>
                        </TableCell> */}
                        <TableCell align="left">{id}</TableCell>
                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">{new Date(date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="left">{total.toFixed(2)}</TableCell>
                        {/* <TableCell align="left">{statusOrder}</TableCell> */}
                        <TableCell align="left">
                          <Select
                            value={orderStatus[row.orderId] || ''}
                            onChange={(event) => handleStatusChange(event, row.orderId)}
                          >
                            <MenuItem value="0">Hủy</MenuItem>
                            <MenuItem value="1">Đang xử lý</MenuItem>
                            <MenuItem value="2">Đang vận chuyển</MenuItem>
                            <MenuItem value="3">Hoàn thành</MenuItem>
                          </Select>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOrders.length} // Sử dụng độ dài của danh sách khách hàng
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    );
  }

  //
  const handleStatusChange = (event, orderId) => {
    const { value } = event.target;
    setOrderStatus((prevOrderStatus) => ({
      ...prevOrderStatus,
      [orderId]: value,
    }));

    console.log(value, '2222');

    fetch(`http://localhost:8081/order/updateStatus/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: value,
    })
      .then((response) => {
        if (response.status === 200) {
          setFlag(!flag);
          alert('Cập nhật thành công');
        } else {
          alert('Cập nhật thất bại');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Cập nhật thất bại');
      });

    // You should also make an API call here to update the order status on the server
  };

  // ===
  const [orderData, setOrderData] = useState([]);

  const [orderStatus, setOrderStatus] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [flag, setFlag] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const trigger = () => {
    setFlag(!flag);
  };
  // form edit
  const handleEditProduct = () => {
    setOpen(null);

    setIsEditing(true);
  };
  const handleCloseProduct = () => {
    setIsEditing(false);
  };

  // ========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get('http://localhost:8081/order');
        // console.log(data.data);

        if (Array.isArray(data.data)) {
          // Kiểm tra nếu dữ liệu trả về là một mảng

          setOrderData(data.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData(); // Gọi hàm fetchData ngay lập tức khi useEffect được gọi
  }, [flag]);

  // =============
  useEffect(() => {
    const initialStatus = {};
    orderData.forEach((order) => {
      // console.log('o init', order);

      initialStatus[order.orderId] = Number(order.status);
    });
    console.log('init', initialStatus);
    setOrderStatus(initialStatus);
  }, [orderData]);

  // =====
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('date');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setEditCustomer(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setEditCustomer(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderData.length) : 0;

  const filteredUsers = applySortFilter(orderData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản Lý đơn hàng
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}></Button> */}
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="order-status-tabs">
            <Tab label="Hủy" />
            <Tab label="Đang xử lý" />
            <Tab label="Đang vận chuyển" />
            <Tab label="Hoàn thành" />
          </Tabs>
        </Box>
        {/* {console.log('value', value)} */}

        {Number(value) === 0 && (
          // Render content for the 'Hủy' tab
          <div>{renderOrderListByStatus(0)}</div>
        )}

        {Number(value) === 1 && (
          // Render content for the 'Đang xử lý' tab
          <div>{renderOrderListByStatus(1)}</div>
        )}

        {Number(value) === 2 && (
          // Render content for the 'Đang vận chuyển' tab
          <div>{renderOrderListByStatus(2)}</div>
        )}

        {Number(value) === 3 && (
          // Render content for the 'Hoàn thành' tab
          <div>{renderOrderListByStatus(3)}</div>
        )}
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleEditProduct()}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {isEditing ? <CustomerForm user={editCustomer} closeForm={handleCloseProduct} trigger={trigger} /> : null}
    </>
  );
}
