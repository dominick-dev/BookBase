import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Authenticate = () => {
  // use the useNavigate and useLocation hooks to get the current history and location objects
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect hook to run the code inside the callback function when the component mounts
  useEffect(() => {
    // get the token from the URL query
    console.log("Authenticate component mounted");
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    console.log("Token from URL query:", token);

    // if token is present, save it to local storage
    if (token) {
      console.log("Token received:", token);
      // save the token to local storage
      localStorage.setItem("token", token);
      // remove the token from the URL
      window.history.replaceState({}, document.title, "/");
      // redirect to home or update your app's state
      navigate("/", { replace: true });
    } else {
      // handle missing token
      alert("Authentication failed. No token received.");
      navigate.replace("/auth");
    }
  }, [navigate, location.search]);

  return null;
};

export default Authenticate;
