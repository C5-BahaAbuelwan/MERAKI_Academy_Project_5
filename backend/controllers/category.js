const connection = require("../models/db")

const Createcategory = (req, res) => {
    const { category,brand_id , image } = req.body;

    const query = `INSERT INTO category (category,brand_id , image) VALUES (?,?,?);`;
    const data = [category,brand_id,image];

    connection.query(query, data, (err, result) => {
        console.log(result);
       if (err) {
        return res.status(500).json({
                success: false,
                massage: "Server error",
                err: err,
            });
        }
        res.status(201).json({
            success: true,
            massage: "category created",
            result: result,
        });
    });
};


const deleteCategoryById = (req, res) => {
    const id = req.params.id;

    const query = `UPDATE category SET is_deleted=1 WHERE id=?;`;

    const data = [id];

    connection.query(query, data, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                massage: "Server Error",
                err: err,
            });
        }
        if (!result.changedRows) {
            return res.status(404).json({
                success: false,
                massage: `The category: ${id} is not found`,
                err: err,
            });
        }
        res.status(200).json({
            success: true,
            massage: `Succeeded to delete category with id: ${id}`,
            result: result,
        });
    });
};

const getAllCategory = (req, res) => {
    const query = `SELECT * ,category.id ,category.image FROM category INNER JOIN brands ON category.brand_id=brands.id WHERE category.is_deleted=0 ;`;
    connection.query(query, (err, result) => {
        console.log(result);
        if (err) {
            return res.status(500).json({
                
                success: false,
                massage: "server error",
                err: err,
            });
        }
        res.status(200).json({
            success: true,
            massage: "All the category",
            result: result,
        });
    });
};


module.exports = {
    Createcategory,
    deleteCategoryById,
    getAllCategory,
}