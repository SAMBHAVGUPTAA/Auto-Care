import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import Category from "../models/categoryModel.js";
import fs from 'fs';
import slugify from "slugify";
import braintree from "braintree";
import dotenv from 'dotenv'

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {

  try {
    const { name, description, price, category, quantity } = req.fields;
    console.log(category )
   const { photo } = req.files;
    // validation
    if (!name) {
      return res.status(400).send({ error: 'Name is required' });
    }
    if (!description) {
      return res.status(400).send({ error: 'Description is required' });
    }
    if (!price) {
      return res.status(400).send({ error: 'Price is required' });
    }
   if (!category) {
      return res.status(400).send({ error: 'Category is required' });
    }
    if (!quantity) {
      return res.status(400).send({ error: 'Quantity is required' });
    }
    if (photo && photo.size > 1000000) {
      return res.status(400).send({ error: 'Photo is required and should be less than 2 mb' });
    }
    const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).send({ error: 'Invalid category name' });
      }
    const products = new productModel({name,
        description,
        price,
        category: categoryExists.name, // Store category name
        quantity,
        slug: slugify(name),}
  );
    if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      console.log('Product to be saved:', products);
      console.log('Category Exists:', categoryExists);
    try {
      await products.save();
      res.status(201).send({
        success: true,
        message: 'Product created successfully',
        productId: products._id,
        name: products.name,
        slug: products.slug,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: 'Error creating product',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error creating product',
    });
  }
};

//get all products 
export const getProductController =async(req,res) =>{
  try {
    const products = await productModel.find({}).populate('category').select("-photo").sort({createdAt:-1})
    res.status(200).send({
      success: true,
      total:products.length,
      message:"All products",
       products,
    
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting product",
      error: error.message

    })
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
    res.status(200).send({
      success: true,
      message:" Single product fetched",
      product
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting that single product",
      error,
    })
  }
};

// get photo 
export const productPhotoController = async(req,res) =>{
  try {
    const product = await productModel.findById(req.params.pid).select('photo')
    if(product.photo.data){
      res.set('Content-type',product.photo.contentType)
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting product photo",
      error,
    })
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    })
  }
};

// update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    console.log(category )
   const { photo } = req.files;
    // validation
    if (!name) {
      return res.status(400).send({ error: 'Name is required' });

    }
    if (!description) {
      return res.status(400).send({ error: 'Description is required' });
    }
    if (!price) {
      return res.status(400).send({ error: 'Price is required' });
    }
   if (!category) {
      return res.status(400).send({ error: 'Category is required' });
    }
    if (!quantity) {
      return res.status(400).send({ error: 'Quantity is required' });
    }
    if (photo && photo.size > 1000000) {
      return res.status(400).send({ error: 'Photo is required and should be less than 2 mb' });
    }
    const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).send({ error: 'Invalid category name' });
      }
    const products = await productModel.findByIdAndUpdate(req.params.pid,
    {...req.fields,slug:slugify(name)},{new:true}
  )
    if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      console.log('Product to be saved:', products);
      console.log('Category Exists:', categoryExists);
    try {
      await products.save();
      res.status(201).send({
        success: true,
        message: 'Product updated successfully',
        productId: products._id,
        name: products.name,
        slug: products.slug,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: 'Error in updating product',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in updating  product',
    });
  }
}

//filters 

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    console.log(products)
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// count product
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product per page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};


// search product 
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
 // realted product
 export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//get product by category 
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category: category.name }).populate("category");
    console.log(category)
    res.status(200).send({
      success: true,
      category,
      products,

    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payments
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};