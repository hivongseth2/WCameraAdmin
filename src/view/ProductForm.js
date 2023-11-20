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
  AlertTitle,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import '../style/general.css';
import axios from 'axios';

const ProductForm = ({ product, closeForm, trigger, handleUpdate }) => {
  const [item, setItem] = useState(product || {});
  const initialDate = product && product.importDate ? new Date(product.importDate) : new Date();
  const [importDateStr, setImportDateStr] = useState(initialDate.toISOString().split('T')[0]);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(item.brand || '');
  const [description, setDescription] = useState(item.description || '');
  const [image, setImage] = useState([]);
  const [images, setImages] = useState(item.imageProducts || []);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [messAlert, setMessAlert] = useState('');
  const [price, setPrice] = useState(item.price || '');
  const [priceImport, setPriceImport] = useState(item.priceImport || '');
  const [productName, setProductName] = useState(item.productName || '');
  const [supp, setSupp] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [quantity, setQuantity] = useState(item.quantity);

  //   ===========
  // const getRandomId = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8521/api/v1/products/randomId');
  //     return response.data; // Use response.data to access the response body
  //     // return response.data; // You can return the data if needed
  //   } catch (err) {
  //     console.error('Error fetching randomId:', err);
  //     return null;
  //   }
  // };

  const uploadImage = () => {
    const formData = new FormData();

    for (let i = 0; i < image.length; i += 1) {
      formData.append('multipartFiles', image[i]);
    }

    axios
      .post(`http://localhost:8521/api/v1/imageProducts/saveOrUpdateForList/${item.id}`, formData)
      .then((response) => {
        // Xóa tất cả các tệp tin sau khi tải lên thành công
        console.log(response);
        //  thêm responda vào images để cập nhật list ảnh
        setImages([...images, ...response.data]);
        setImage([]);

        setShowSuccessAlert(true); // Hiển thị thông báo thành công
        setMessAlert('Thêm ảnh thành công');
        // Tạm dừng hiển thị thông báo sau một khoảng thời gian
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // 3 giây
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  useEffect(() => {}, [image]);

  // const handleSave = async () => {
  //   try {
  //     const updatedItem = {
  //       name: productName,
  //       modelYear: importDateStr,
  //       status: 1,
  //       price: price || 0,
  //       quantity: quantity || 0,
  //       brand: {
  //         brandId: brand,
  //       },
  //       category: {
  //         categoryId: category,
  //       },
  //     };
  //     console.log('images : ', brand);
  //     console.log('images : ', category);
  //     console.log('images : ', updatedItem.quantity);
  //     console.log('images : ', quantity);

  //     // Gửi dữ liệu lên server
  //     await axios.post('http://localhost:8081/product/add', updatedItem);
  //     trigger();
  //     closeForm();
  //     console.log('save success');
  //   } catch (err) {
  //     console.error('Error saving product:', err);
  //   }
  // };

  const handleSave = async () => {
    try {
      const updatedItem = {
        id: item.id,
        name: productName,
        modelYear: importDateStr,
        status: 1,
        price: price || 0,
        quantity: quantity || 0,
        brand: {
          brandId: brand,
        },
        category: {
          categoryId: category,
        },
      };

      if (product && product.id) {
        await axios.put(`http://localhost:8081/product/update/${product.id}`, updatedItem);
      } else {
        await axios.post('http://localhost:8081/product/add', updatedItem);
      }

      trigger();
      closeForm();
      console.log('Save success');
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // remove in list tạm
  const removeInListImg = (item, index) => {
    const updatedImage = [...image];
    updatedImage.splice(index, 1);
    setImage(updatedImage);
  };

  const removeImgFetch = (item, index) => {
    axios
      .delete(`http://localhost:8521/api/v1/imageProducts/delete/${item.id}`)
      .then((response) => {
        const updatedImage = [...images];
        updatedImage.splice(index, 1);
        setImages(updatedImage);
        setShowSuccessAlert(true); // Hiển thị thông báo thành công
        setMessAlert('Đã xóa ảnh thành công');

        // Tạm dừng hiển thị thông báo sau một khoảng thời gian
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // 3 giây
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  //   fetch category
  useEffect(() => {
    axios
      .get('http://localhost:8081/categories')
      .then((response) => {
        setCategories(response.data);
        // setCategory(product ? product.categories.categoriesId : '');
        console.log('category : ', category);
        console.log('ca : ', categories);
        return axios.get('http://localhost:8081/brand');
      })
      .then((brandResponse) => {
        setBrands(brandResponse.data);

        // setBrand(product ? product.brand.id : '');
        console.log('brand : ', brand);
        console.log('brands : ', brands);
      })
      .catch((error) => {
        console.error('Error fetching categories or brands:', error);
      });
  }, []);

  //   ===============
  const handleCancel = () => {
    closeForm();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" position={'relative'} top={'-30%'}>
      <Grid item xs={8} height={'100%'}>
        <Paper
          elevation={3}
          style={{ padding: '20px', background: '#F6FAFA', boxshadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <form>
            <h2>Chỉnh sửa sản phẩm</h2>
            <Grid container spacing={2}>
              {/* <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="brand">Brand</InputLabel>
                  <Input id="brand" type="text" value={brand.name} onChange={(e) => setBrand(e.target.value)} />
                </FormControl>
              </Grid> */}

              <Grid item xs={6}>
                <InputLabel htmlFor="brand">Brand</InputLabel>

                <FormControl fullWidth>
                  <Select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand.brandId} value={brand.brandId}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <InputLabel htmlFor="category">Category</InputLabel>

                <FormControl fullWidth>
                  <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="description">Description</InputLabel>
                  <Input
                    id="description"
                    type="text"
                    // value={item.description}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel marginBottom="2em">Images</InputLabel>
                <FormControl fullWidth>
                  <input
                    id="image"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files);
                      setImage(filesArray);
                    }}
                  />
                  <div className="ContainerImgForm">
                    {image.length > 0 &&
                      image.map((item, index) => {
                        return (
                          <div style={{ marginRight: '2em' }}>
                            <Button
                              className="close-button"
                              color="secondary"
                              onClick={() => removeInListImg(item, index)}
                            >
                              X
                            </Button>
                            <img
                              className="image"
                              style={{ width: '180px', height: 'auto' }}
                              alt="none"
                              src={URL.createObjectURL(item)}
                              key={item.name} // Thêm key để React có thể xác định các phần tử trong danh sách
                            />
                          </div>
                        );
                      })}
                  </div>
                </FormControl>
              </Grid>

              <div className="ContainerImgForm">
                {images.map((item, index) => (
                  <div style={{ marginRight: '2em' }}>
                    <Button
                      className="close-button"
                      variant="outlined"
                      color="error"
                      onClick={() => removeImgFetch(item, index)}
                    >
                      X
                    </Button>
                    <img className="imgInForm" alt="none" src={item.imageLink} />
                  </div>
                ))}
              </div>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="importDate">Import Date</InputLabel>
                  <Input
                    id="importDate"
                    type="date"
                    onChange={(e) => setImportDateStr(e.target.value)}
                    value={importDateStr}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="price">Price</InputLabel>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="priceImport">Price Import</InputLabel>
                  <Input
                    id="priceImport"
                    type="number"
                    value={priceImport}
                    onChange={(e) => setPriceImport(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="quantity">Quantity</InputLabel>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="productName">Product Name</InputLabel>
                  <Input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {/* <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="category">Nhà cung cấp</InputLabel>

                  <Select id="category" value={supp} onChange={(e) => setSupp(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {suppliers.map((sup) => (
                      <MenuItem key={sup.id} value={sup.id}>
                        {sup.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={6}>
                <Button onClick={handleSave} color="success">
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={() => handleCancel()}>Cancel</Button>
              </Grid>

              <Grid item xs={12}>
                <Button onClick={() => uploadImage()}>up anh</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      {showSuccessAlert && (
        <Alert severity="success" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <AlertTitle>Success</AlertTitle>
          <strong>{messAlert}</strong>
        </Alert>
      )}
    </Grid>
  );
};

export default ProductForm;
