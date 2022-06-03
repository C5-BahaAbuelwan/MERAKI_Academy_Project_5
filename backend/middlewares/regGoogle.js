const connection = require("../models/db");
const bcrypt = require("bcrypt");
const regGoogle = (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  const query1 = "SELECT * FROM users WHERE email =? AND is_deleted =0";
  const data1 = [email];
  connection.query(query1, data1, (err, result) => {
    if (err) {
      res.json({ err });
    }

    if (result.length == 0) {
      let password = Math.random() + "";

      bcrypt.hash(password, 10).then((result) => {
        let role_id = 1;

        const query = `INSERT INTO users (firstName,lastName,email,password,role_id) VALUES (?,?,?,?,?)`;
        const data = [firstName, lastName, email, result, role_id];
        connection.query(query, data, (err, result) => {
          if (err) {
            res.json({ err });
          }
          next();
        });
      });
    } else {
      next();
    }
  });
};

module.exports = regGoogle;
