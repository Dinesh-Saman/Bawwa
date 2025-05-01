import React, { createContext, useState, useEffect } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    // Load from localStorage when the app starts
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const registerUser = (data) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, data];
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save to localStorage
      return updatedUsers;
    });
  };

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users)); // Update localStorage when users change
  }, [users]);
  

 return (
  <StoreContext.Provider value={{ users, setUsers, registerUser }}>
    {children}
  </StoreContext.Provider>
);

};
