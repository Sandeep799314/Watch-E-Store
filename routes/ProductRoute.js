import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { CreateProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/ProductController.js';
import formidable from 'express-formidable';
const router = express.Router();


//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), CreateProductController);
//get products
router.get('/get-product', getProductController)
    //single product
router.get('/get-product/:slug', getSingleProductController);

// get photo 
router.get('/product-photo/:pid', productPhotoController);
//delete product
router.delete("/delete-product/:pid", deleteProductController);
//upadate Product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);
//filter Product
router.post('/product-filter', productFiltersController);
//product count
router.get('/product-count', productCountController);
//product per page
router.get('/product-list/:page', productListController);
//search product 
router.get('/search/:keyword', searchProductController);
//similar products
router.get('/related-product/:pid/:cid', relatedProductController);
//category  wise  product
router.get('/product-category/:slug', productCategoryController)
export default router;