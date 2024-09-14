import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const CreateProduct = () => {
  const navigate= useNavigate()
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    shipping: '',
    photo: null,
  });

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get( 'http://localhost:8080/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong in getting category');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
 
  //create product function
  const handleCreate= async(e)=>{
    e.preventDefault()
    try {
      const productData=new FormData()
      productData.append('name',product.name);
      productData.append('description',product.description);
      productData.append('price',product.price);
      productData.append('quantity',product.quantity);
      productData.append('photo',product.photo);
      productData.append('category',product.category);
      productData.append('shipping',product.shipping);
      productData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      //const response = await axios.post('${process.env.REACT_API_API}/api/v1/product/create-product', productData);
      const response = await axios.post('http://localhost:8080/api/v1/product/create-product', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data.success){
       toast.success('Product created successfully');
       navigate('/dashboard/admin/products');
        
    }else{
      toast.error(response.data.message);
    }
  } catch (error) {
      console.log(error.response);
      toast.error("Something went wrong");
    }
  };
  //working
  const handleInputChange = (field, value) => {
    setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    setProduct((prevProduct) => ({ ...prevProduct, photo: e.target.files[0] }));
  };

  const handleCategoryChange = (value) => {
    handleInputChange('category', value);
  };

  const handleShippingChange = (value) => {
    handleInputChange('shipping', value);
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select
                variant={false}
                placeholder="Select a Category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={handleCategoryChange}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary">
                  {product.photo ? product.photo.name : "upload photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="images/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {product.photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(product.photo)}
                      alt="product_photo"
                      height={'200px'}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={product.name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                type= "text"
                  value={product.description}
                  placeholder="Write Description"
                  className="form-control"
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={product.quantity}
                  placeholder="Write Quantity"
                  className="form-control"
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={product.price}
                  placeholder="Write price"
                  className="form-control"
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={handleShippingChange}
                >
                  <Option value="0">NO</Option>
                  <Option value="1">YES</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className='btn btn-primary'onClick={handleCreate}>CREATE PRODUCT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;