import { Helmet } from 'react-helmet-async';

import { useEffect, useState, useContext } from 'react';

import { Container, Typography, Button, ButtonGroup, Dialog, DialogContent, TextField, Stack } from '@mui/material';

import AddSupplier from '../view/AddSupplier';
import UpdateSupplier from '../view/UpdateSupplier';

import { CustomFetch } from '../utils/CustomFetch';

import Iconify from '../components/iconify';

// Các phần khác của mã

export default function SupplierPage({props}) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [isUpdateSupplierDialogOpen, setIsUpdateSupplierDialogOpen] = useState(false);
  const handleOpenAddSupplierDialog = () => {
    setIsAddSupplierDialogOpen(true);
  };
  const handleOpenUpdateSupplierDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setIsUpdateSupplierDialogOpen(true);
  };


  // Hàm này đóng modal thêm nhà cung cấp
  const handleCloseAddSupplierDialog = () => {
    fetchData();
    setIsAddSupplierDialogOpen(false);
  };
  // Hàm này đóng modal sửa nhà cung cấp
  const handleCloseUpdateSupplierDialog = () => {
    fetchData();
    setIsUpdateSupplierDialogOpen(false);
  };


  const fetchData = async () => {
    try {
      const method = 'GET';
      const header = {
        'Content-Type': 'application/json',
      };
      const body = '';
      const path = '/brand';
      const data = await CustomFetch(path, method, body, header);

      if (data.errorCode !== undefined) {
        // Xử lý lỗi ở đây
        console.error('Error:', data.errorMessage);
      } else {
        // Xử lý dữ liệu khi thành công
        console.log(data);
        setSuppliers(data);
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi xảy ra trong CustomFetch hoặc mạng
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    fetchData(); // Gọi hàm fetchData ngay lập tức
  }, []);

  return (
    <>
      <Button variant="contained" onClick={handleOpenAddSupplierDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
        Thêm nhà cung cấp mới
      </Button>

      {suppliers.length > 0 ? (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên nhà cung cấp</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <th scope="row">{index + 1}</th>
                <td>{supplier.name}</td>
                <td>
                  <img src={supplier.image} alt="Supplier Logo" style={{ width: '100px', height: '100px' }} />
                </td>
                <td>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenUpdateSupplierDialog(supplier)}  // Pass the supplier to the function
                    startIcon={<Iconify icon="eva:edit-2-fill" />}
                  >
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      ) : (
        <p>Danh sách nhà cung cấp trống</p>
      )}

      {/* =========== */}
      <Dialog
        open={isAddSupplierDialogOpen}
        onClose={handleCloseAddSupplierDialog}
        fetchData={fetchData}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <AddSupplier onClose={handleCloseAddSupplierDialog} />
        </DialogContent>
      </Dialog>
      {/* =========== */}
      <Dialog
        open={isUpdateSupplierDialogOpen}
        onClose={handleCloseUpdateSupplierDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <UpdateSupplier onClose={handleCloseUpdateSupplierDialog} initialSupplierInfo={selectedSupplier}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
