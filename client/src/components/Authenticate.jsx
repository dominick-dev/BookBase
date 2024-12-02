import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Authenticate = () => {
  // use the useHistory and useLocation hooks to get the current history and location objects
  const history = useNavigate();
  const location = useLocation();

  // useEffect hook to run the code inside the callback function when the component mounts
  useEffect(() => {
    // get the token from the URL query
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    // if token is present, save it to local storage
    if (token) {
      console.log("Token received:", token);
      // save the token to local storage
      localStorage.setItem("token", token);
      // remove the token from the URL
      window.history.replaceState({}, document.title, "/");
      // redirect to home or update your app's state
      history.replace("/");
    } else {
      // handle missing token
      alert("Authentication failed. No token received.");
      history.replace("/auth");
    }
  }, [history, location.search]);

  return null;
};

export default Authenticate;
