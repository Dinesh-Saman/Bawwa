import React, { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";  // Adjust path if needed

const DebugLogger = () => {
  const { users } = useContext(StoreContext);

  useEffect(() => {
    console.log("🔎 Current Users in Context:", JSON.stringify(users, null, 2));  // ✅ Should now log users
  }, [users]);

  return null; // Does not render anything, only logs to console
};

export default DebugLogger;
