import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/github", label: "GitHub API" },
  { to: "/login", label: "Login" }
];

function NavBar() {
  return (
    <header className="site-header">
      <h1>Week 7: Advanced React</h1>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default NavBar;
