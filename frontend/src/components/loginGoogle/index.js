import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../redux/reducers/auth";

import axios from "axios";
const LogGoogle = () => {
  
  const navigate = useNavigate();

  //!redux===============
  const dispatch = useDispatch();
  //!redux===============
  const responseGoogle = (response) => {
    console.log(response.Ru);

    axios
      .post("http://localhost:5000/loginGoogle", {
        firstName: response.Ru.AY,
        lastName: response.QW,
        email: response.Ru.Iv,
      })
      .then((result) => {
        dispatch(loginAction(result.data.token));
        navigate("/");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <div>
      <GoogleLogin
        clientId="994328639474-ub85dkgodp4vrm5nvfaemiklfko5jpt9.apps.googleusercontent.com"
        buttonText="Log in with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default LogGoogle;
