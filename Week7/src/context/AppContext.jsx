import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const AppContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null,
  visits: 0
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "INCREMENT_VISITS":
      return {
        ...state,
        visits: state.visits + 1
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (baseState) => {
    try {
      const saved = localStorage.getItem("week7-auth");
      if (!saved) {
        return baseState;
      }
      const parsed = JSON.parse(saved);
      return {
        ...baseState,
        isAuthenticated: Boolean(parsed?.isAuthenticated),
        user: parsed?.user ?? null
      };
    } catch {
      return baseState;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "week7-auth",
      JSON.stringify({ isAuthenticated: state.isAuthenticated, user: state.user })
    );
  }, [state.isAuthenticated, state.user]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
