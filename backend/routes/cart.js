const connection = require("../models/db");

const addToCart = (req, res) => {
  const { productId } = req.body;
  const userId = req.token.userId;

  const query = `INSERT INTO cart (product_id,user_id) VALUES (?,?,?)`;
  const data = [productId, userId];

  connection.query(query, data, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        massage: "Server error",
        err: err,
      });
    }

    res.status(200).json({
      success: true,
      massage: "cart created",
      result: result,
    });
  });
};

const emptyCart = (req, res) => {
  const userId = req.token.userId;
  const query = `UPDATE cart SET is_deleted=1 WHERE user_id=?`;

  const data = [userId];

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
        massage: `The Cart with UserId: ${userId} is not found`,
        err: err,
      });
    }
    res.status(200).json({
      success: true,
      massage: `Succeeded to delete cart with UserId: ${userId}`,
      result: result,
    });
  });
};

const deleteFromCart = (req, res) => {
  const userId = req.token.userId;
  const { productId } = req.body;

  const query = `UPDATE cart SET is_deleted=1 WHERE user_id=? AND product_id=? `;

  const data = [userId, productId];

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
        massage: `The product with productId: ${productId} with UserId: ${userId} is not found`,
        err: err,
      });
    }
    res.status(200).json({
      success: true,
      massage: `Succeeded to delete Product with productId: ${productId} from cart with UserId: ${userId}`,
      result: result,
    });
  });
};

module.exports = {
  addToCart,
  emptyCart,
  deleteFromCart,
  getCartItem,
};
