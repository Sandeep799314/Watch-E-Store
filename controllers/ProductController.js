import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import fs from 'fs';
import CategoryModel from "../models/CategoryModel.js";


export const CreateProductController = async(req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !description:
                return res.status(500).send({ error: "description is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case !photo && photo.size > 10000000:
                return res.status(500).send({ error: "Photo is Required and should be less than 1mb" });

        }
        const products = new ProductModel({...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in product create controller"
        })
    }

}

//get all product controller
export const getProductController = async(req, res) => {
    try {
        const products = await ProductModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "ALlProducts ",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
};
//get single product
export const getSingleProductController = async(req, res) => {
        try {
            const product = await ProductModel.findOne({ slug: req.params.slug }).select("-photo").populate('category');
            res.status(200).send({
                success: true,
                message: "successfully single Product fetched",
                product,
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in geting single product',
                error,
            })
        }
    }
    //get photo 
export const productPhotoController = async(req, res) => {
        try {
            const product = await ProductModel.findById(req.params.pid).select("photo")
            if (product.photo.data) {
                res.set('Content-type', product.photo.contentType);
                return res.status(200).send(product.photo.data)
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                error,
                message: "Error in photo getting controller"
            })
        }
    }
    //delete producte
export const deleteProductController = async(req, res) => {
        try {
            await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
            res.status(200).send({
                success: true,
                message: 'Product deleted successfully  ',

            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                error,
                message: "Error in product deleting controller"
            })
        }

    }
    //update product controller
export const updateProductController = async(req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
        req.fields;
        const { photo } = req.files;
        //alidation
        console.log(req.fields.name);
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await ProductModel.findByIdAndUpdate(
            req.params.pid, {...req.fields, slug: slugify(name) }, { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};
//Product filte controller
// filters
export const productFiltersController = async(req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await ProductModel.find(args); // Corrected line
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While Filtering Products",
            error,
        });
    }
};
//product count controller
export const productCountController = async(req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'error in product count',
            error,
            success: false,

        })
    }
}
export const productListController = async(req, res) => {
        try {
            const perPage = 3;
            const page = req.params.page ? req.params.page : 1
            const products = await ProductModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
            res.status(200).send({
                success: true,
                products,
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({
                success: false,
                message: "error in Product list",
                error,
            })
        }
    }
    //search product controller
export const searchProductController = async(req, res) => {
    try {
        const { keyword } = req.params;
        const result = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "error in search controller"
        });
    }
};
//similar product
export const relatedProductController = async(req, res) => {
        try {
            const { pid, cid } = req.params
            const products = await ProductModel.find({
                category: cid,
                _id: { $ne: pid }
            }).select("-photo").limit(3).populate("category")
            res.status(200).send({
                success: true,
                products
            })

        } catch (error) {
            console.log(error);
            res.status(400).send({
                success: false,
                error,
                message: "error in simmilar product"
            })
        }
    }
    //get product by category
export const productCategoryController = async(req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug });
        const products = await ProductModel.find({ category }).populate("category");
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