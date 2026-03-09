import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

function HomePage() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: "INCREMENT_VISITS" });
  }, [dispatch]);

  return (
    <section>
      <h2>Home</h2>
      <p>This app demonstrates routing, hooks, global state, and API integration.</p>
      <p>Total Home visits in this session: {state.visits}</p>
      <p>
        Auth status: {state.isAuthenticated ? `Logged in as ${state.user?.email}` : "Not logged in"}
      </p>
    </section>
  );
}

export default HomePage;
