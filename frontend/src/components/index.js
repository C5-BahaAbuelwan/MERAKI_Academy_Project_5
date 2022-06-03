import Register from "./register";
import Login from "./login";
import Product from "./product/uu";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/reducers/auth";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
    };
  });

  return (
    <div>
      {state.isLoggedIn ? (
        <>
          <Link to="/cart">Cart</Link>
          <button
            className="logout"
            onClick={() => {
              dispatch(logoutAction());
              navigate("/");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </>
      )}

      <Link to="product">All Product</Link>
      
    </div>
  );
};

export default Dashboard;
