// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext, useReducer } from "react";

// Define state type
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  retryCount: 0,
};

// Define action types
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_FAIL = "AUTH_FAIL";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const RESET_ERROR = "RESET_ERROR";

// Reducer function to handle auth-related actions
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload, loading: false };
    case AUTH_FAIL:
      return { ...state, isAuthenticated: false, user: null, loading: false, error: action.payload };
    case SET_LOADING:
      return { ...state, loading: true };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case RESET_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<any | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // JWT token checking and refresh logic
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: SET_LOADING });

        const token = localStorage.getItem("authToken");
        if (!token) {
          dispatch({ type: AUTH_FAIL, payload: "No token found" });
          return;
        }

        // Mocking API request to validate JWT
        const response = await fetch("/api/validate-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const user = await response.json();
        dispatch({ type: AUTH_SUCCESS, payload: user });
      } catch (err: any) {
        dispatch({ type: AUTH_FAIL, payload: err.message });
      }
    };

    checkAuth();
  }, []);

  const refreshAuth = async () => {
    // Implement JWT refresh token flow
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const { newAccessToken } = await response.json();
      localStorage.setItem("authToken", newAccessToken);
      checkAuth();
    } catch (err) {
      dispatch({ type: AUTH_FAIL, payload: err.message });
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};