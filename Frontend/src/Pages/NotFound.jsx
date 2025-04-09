import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="fw-bold text-dark">Oops! Page Not Found</h2>
      <p className="text-muted w-75">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="Not Found"
        className="img-fluid mb-4"
        style={{ maxWidth: "400px" }}
      />
      <Link to="/" className="btn btn-primary btn-lg px-4">
        Go Home
      </Link>
    </div>
  );
}
