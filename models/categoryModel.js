import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

// Yeh line check karegi agar model already defined hai
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;