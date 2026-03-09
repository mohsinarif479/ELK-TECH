import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Enter a valid email format.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

function LoginPage() {
  const { state, dispatch } = useAppContext();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    dispatch({
      type: "LOGIN",
      payload: {
        email: values.email,
        loginAt: new Date().toISOString()
      }
    });

    setSubmitting(false);
    setValues({ email: "", password: "" });
  }

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <section>
      <h2>Mock Authentication Feature</h2>
      {!state.isAuthenticated ? (
        <form onSubmit={handleSubmit} className="card">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={values.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Authenticating..." : "Login"}
          </button>
        </form>
      ) : (
        <div className="card">
          <p>Logged in as: {state.user?.email}</p>
          <p>Login time: {new Date(state.user?.loginAt).toLocaleString()}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </section>
  );
}

export default LoginPage;
