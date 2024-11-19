import React, { useState, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();

  const login = async (username, password) => {
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username: username,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      const decodeUser = jwtDecode(token);
      setState({
        loading: false,
        error: null,
        user: decodeUser,
      });
      navigate("/");
    } catch (error) {
      console.error(
        "Login failed",
        error.response ? error.response.data : error.message
      );
      setState({
        loading: false,
        error: error.response ? error.response.data : error.message,
        user: null,
      });
    }
  };

  const register = () => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token");
    setState({
      loading: false,
      error: null,
      user: null,
    });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
