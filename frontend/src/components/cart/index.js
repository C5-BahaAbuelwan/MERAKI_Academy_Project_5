// import ("./style.css")
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
// import {useNavigate} from ("react-router-dom")
import { loginAction } from "../../redux/reducers/auth";
import {
  getCartAction,
  addToCartAction,
  deleteFromCartAction,
  emptyCartAction,
} from "../../redux/reducers/cart";

const Cart = () => {
  // const navigate=useNavigate()
  //! redux =========
  const dispatch = useDispatch();

  const { token, isLoggedIn, cart } = useSelector((state) => {
    // console.log(state);

    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      cart: state.cart.cart,
    };
  });
  //! redux =========

  // const [cart, setCart] = useState([]);
  const [total, SetTotal] = useState(0);

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    await axios
      .get(`http://localhost:5000/cart`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(getCartAction(result.data.result));
        console.log(cart);
        console.log(result.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addToCart = (id, quantity) => {
    if (!token) return alert("Please login to continue buying");
    axios
      .post(
        `http://localhost:5000/cart`,
        {
          productId: id,
          quantity: quantity,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((result) => {
        // dispatch(addToCartAction(result.data.result))
        console.log(result.data.result);
        // setCart(result.data.result);
        getCartItems();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emptyCart = async () => {
    await axios
      .delete(
        "http://localhost:5000/cart/",

        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((result) => {
        dispatch(emptyCartAction());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteItemsFromCart = async (id) => {
    await axios
      .delete(`http://localhost:5000/cart/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(deleteFromCartAction(id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="cart_container">
      {isLoggedIn ? (
        cart.length === 0 ? (
          <h1>Your shopping cart is empty!</h1>
        ) : (
          cart.length &&
          cart.map((element, index) => {
            // SetTotal(total+element.price)
            // console.log(element);
            return (
              <div className="product_details" key={index}>
                <p
                  className="delete"
                  id={element.id}
                  onClick={(e) => {
                    deleteItemsFromCart(element.id);
                  }}
                >
                  ×
                </p>
                <div className="image_button">
                  <img
                    className="product_image"
                    src={element.image}
                    alt="product image"
                  />
                  <br></br>
                  <div className="all_detals">
                    <div className="information_cart">
                      <button
                        className="decrees"
                        id={element.id}
                        onClick={(e) => {
                          addToCart(element.id, -1);
                        }}
                      >
                        -
                      </button>
                      <p className="product-quantity">{element.quantity}</p>
                      <button
                        className="increase"
                        id={element.id}
                        onClick={(e) => {
                          addToCart(element.id, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="details">
                      <p className="product_title">
                        {"Title : " + element.title}
                      </p>
                      <p className="product_total">
                        {"Total : " + element.price * element.quantity}JOD
                      </p>
                      <p className="product_details">
                        {"Description : " + element.description}
                      </p>
                    </div>
                  </div>
                </div>
               

                <h6 className="sub_total">{}</h6>
              </div>
            );
                        
          })
        )
        
      ) : (
        <h1>Please Login First</h1>
      )}
       <button
                  className="empty_cart"
                  onClick={(e) => {
                    emptyCart();
                  }}
                >
                  Empty Cart
                </button>
    </div>
  );
};

export default Cart;
