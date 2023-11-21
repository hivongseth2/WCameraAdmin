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
  const [selectedImages, setSelectedImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(item.categoryId || '');
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(item.brandId || '');
  const [description, setDescription] = useState(item.description || '');
  const [image, setImage] = useState([]);
  const [images, setImages] = useState(item.images || []);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [messAlert, setMessAlert] = useState('');
  const [price, setPrice] = useState(item.price || '');
  const [priceImport, setPriceImport] = useState(item.price || '');
  const [productName, setProductName] = useState(item.name || '');
  const [supp, setSupp] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {}, [images]);
  // log;
  const uploadImage = () => {
    axios.defaults.withCredentials = true;

    const uploadNextImage = (index) => {
      if (index < selectedImages.length) {
        const formData = new FormData();
        const currentImage = selectedImages[index];
        formData.append('file', currentImage);

        axios
          .post(`http://localhost:8081/images/${item.productId}`, formData)
          .then((response) => {
            console.log(response);
            const temp = {
              id: response.data,
              imageId: Math.random(),
            };

            setImages((prevImages) => [...prevImages, temp]);

            setMessAlert('Thêm ảnh thành công');
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);

            uploadNextImage(index + 1);
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      }
    };

    uploadNextImage(0);

    setShowSuccessAlert(true);
  };
  const handleSave = async () => {
    try {
      const updatedItem = {
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

      if (product) {
        await axios.put(`http://localhost:8081/product/update/${product.productId}`, updatedItem);
      }
      uploadImage();
      trigger();
      // closeForm();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const removeInListImg = (index) => {
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages.splice(index, 1);
    setSelectedImages(updatedSelectedImages);
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

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // 3 giây
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  useEffect(() => {
    axios
      .get('http://localhost:8081/categories')
      .then((response) => {
        setCategories(response.data);
        console.log('category : ', category);
        console.log('ca : ', categories);
        return axios.get('http://localhost:8081/brand');
      })
      .then((brandResponse) => {
        setBrands(brandResponse.data);

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
      <Grid item xs={8} height={'100%'} className="formEditProduct">
        <Paper
          elevation={3}
          style={{ padding: '20px', background: '#F6FAFA', boxshadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <form>
            <h2>Chỉnh sửa sản phẩm</h2>
            <Grid container spacing={2}>
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
                <InputLabel marginBottom="2em">Images</InputLabel>
                <FormControl fullWidth>
                  <input
                    id="image"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files);
                      setSelectedImages(filesArray); // Sử dụng selectedImages thay vì image
                    }}
                  />
                  <div className="ContainerImgForm">
                    {images.length > 0 &&
                      images.map((item, index) => {
                        return (
                          <div key={item.imageId} style={{ marginRight: '2em' }}>
                            <Button
                              className="close-button"
                              color="secondary"
                              onClick={() => removeInListImg(item, index)}
                            >
                              X
                            </Button>
                            <img
                              className="image"
                              style={{ width: '180px', height: '180px' }}
                              alt="none"
                              src={`${item.id}`}
                              key={item.id} // Thêm key để React có thể xác định các phần tử trong danh sách
                            />
                          </div>
                        );
                      })}
                  </div>
                </FormControl>
              </Grid>

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
              <Grid item xs={12}>
                <Grid item xs={6}>
                  <Button onClick={handleSave} color="success">
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => handleCancel()}>Cancel</Button>
                </Grid>
              </Grid>
              {/* <Grid item xs={12}>
                <Button onClick={() => uploadImage()}>up anh</Button>
              </Grid> */}
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
