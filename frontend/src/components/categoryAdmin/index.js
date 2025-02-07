import axios from "axios";
import Upload from "../upload";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryAction,
  addToCategoryAction,
  deleteFromCategory,
} from "../../redux/reducers/categoryAdmin";
import("./style.css");


const CategoryAdmin = () => {
  const [image, setImage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [brand, setBrand] = useState("");
  //! redux =========
  const dispatch = useDispatch();

  const { token, isLoggedIn, category, cloudinary ,brands} = useSelector((state) => {
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      category: state.category.category,
      cloudinary: state.cloudinary.cloudinary,
      brands: state.brands.brands,
    };
  });
  console.log(brand);
  //! redux =========
  const navigate = useNavigate();

  const addCategoryAdmin = (categoryName) => {
    axios
      .post(
        `http://localhost:5000/category`,
        { category: categoryName, image: cloudinary, brand_id:brand },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((result) => {
        console.log(result);
        dispatch(
          addToCategoryAction({
            id: result.data.result.insertId,
            category: categoryName,
            image: cloudinary,
            brand_id: brand,
            is_deleted: 0,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSubCategoryAdmin = (subCategory) => {
    axios
      .post(
        `http://localhost:5000/category/sub`,
        { sub_category: subCategory },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategoryAdmin = () => {
    axios
      .get(`http://localhost:5000/category`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(getCategoryAction(result.data.result));
        console.log(result);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCategoryAdmin = (id) => {
    axios
      .delete(`http://localhost:5000/category/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(deleteFromCategory(id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategoryAdmin();
  }, []);

  return (
    <div className="category_Admin">
      <div className="category_contener">
        <table id="categryT">
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Category Name</th>
            <th>Brand</th>

            <th>Actions</th>
          </tr>

          {category.length &&
            category.map((element, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><img src={element.image} style={{width:"100px" , aspectRatio:"1/1.25"}}/></td>
                  <td>{element.category}</td>
                  <td>{element.brand}</td>

                  <td>
                    <p
                      onClick={() => {
                        deleteCategoryAdmin(element.id);
                      }}
                    >
                      Delete
                    </p>
                  </td>
                </tr>
              );
            })}
        </table>
      </div>

      <h6>Add Category</h6>
      <h5>Picture</h5>
      <Upload />
      

      <h5>Title</h5>
      <input
        className="category"
        placeholder="category Name"
        onChange={(e) => {
          setCategoryName(e.target.value);
        }}
      />
      <h5>Brand</h5>

        <select onClick={(e)=>{setBrand(e.target.value)}}>
        <option value="0">Select</option> 
          {brands&& brands.map((element,index)=>{
            return (<>
              
              <option value={element.id}>{element.brand}</option>   
              </>
                      )
          })}
        </select>
      {/* <input
        className="category"
        placeholder="category Name"
        onChange={(e) => {
          setBrand(e.target.value);
        }}
      /> */}
      <button
        className="add_category"
        onClick={() => {
          addCategoryAdmin(categoryName);
        }}
      >
        Add Category{" "}
      </button>
    </div>
  );
};

export default CategoryAdmin;
