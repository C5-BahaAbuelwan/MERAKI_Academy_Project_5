// import ("./style.css")
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";

import Payment from "../payment";

import {
  getCartAction,
  deleteFromCartAction,
  emptyCartAction,
  setTotalPriceAction,
  setquantityAction,
  reducequantityAction,
  iccuresquantityAction,
} from "../../redux/reducers/cart";

import StripeCheckout from "react-stripe-checkout";

import { toast } from "react-toastify";

const Cart = () => {
  //! redux =========
  const dispatch = useDispatch();

  const { token, isLoggedIn, cart, quantity } = useSelector((state) => {
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      cart: state.cart.cart,
      quantity: state.cart.quantity,
    };
  });
  //! redux =========

  // const [availableQuantity, SetAvailableQuantity] = useState(0);
  const [subtotal, SetSubTotal] = useState(0);

  useEffect(() => {
    getCartItems();
  }, [quantity]);

  useEffect(() => {
    func();
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
        let priceTotal = result.data.result.reduce((acc, element, index) => {
          return acc + element.price * element.quantity;
        }, 0);

        SetSubTotal(priceTotal);

        dispatch(setTotalPriceAction(priceTotal));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const func = async () => {
    await axios
      .get(`http://localhost:5000/cart`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(setquantityAction(result.data.result[0].AvailableQuantity));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addToCart = (id, quantity) => {
    if (!token) return alert("Please login to continue buying");
    const orderId = localStorage.getItem("orderId");
    console.log("add to cart orderid", orderId);
    axios
      .post(
        `http://localhost:5000/cart`,
        {
          productId: id,
          quantity: quantity,
          order_id: orderId,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((result) => {
        console.log(result.data);
        
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
                    {element.AvailableQuantity === 0 ? (
                      <p>Sold Out</p>
                    ) : (
                      <div className="information_cart">
                        <button
                          className="decrees"
                          id={element.id}
                          onClick={(e) => {
                            element.AvailableQuantity !== quantity ? (
                              dispatch(iccuresquantityAction())
                            ) : (
                              <></>
                            );

                            element.quantity > 1 ? (
                              addToCart(element.id, -1)
                            ) : (
                              <></>
                            );
                          }}
                        >
                          -
                        </button>

                        <p className="product-quantity">{element.quantity}</p>

                        <button
                          className="increase"
                          id={element.id}
                          onClick={(e) => {
                            

                            quantity - 1 !== 0 ? (
                              addToCart(element.id, 1)
                            ) : (
                              <></>
                            );

                            quantity - 1 === 0 ? (
                              <></>
                            ) : (
                              dispatch(reducequantityAction())
                            );
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}

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
                      <p className="product_details">
                        {"AvailableQuantity : " + (quantity - 1)}
                      </p>
                    </div>
                  </div>
                  <Payment />
                </div>
              </div>
            );
          })
        )
      ) : (
        <h1>Please Login First</h1>
      )}

      {cart.length === 0 ? (
        <></>
      ) : (
        <h4 className="sub_total">{subtotal} JOD</h4>
      )}
      {/* <h4 className="sub_total">{subtotal} JOD</h4> */}

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
