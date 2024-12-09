import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import "../App.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex items-center justify-between nav-bar">
        <div className="nav-links flex gap-4">
          <Link to="/" className="nav-link [&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/signIn" className="nav-link [&.active]:font-bold">
            Sign In
          </Link>{" "}
          <Link to="/signUp" className="nav-link [&.active]:font-bold">
            Sign Up
          </Link>{" "}
          <Link to="/forgotPassword" className="nav-link [&.active]:font-bold">
            Forgot Password
          </Link>{" "}
          <Link to="/profile" className="nav-link [&.active]:font-bold">
            Profile
          </Link>{" "}
          {/* <Link to="/deleteProfile" className="nav-link [&.active]:font-bold">
            Delete Profile
          </Link> */}
          <Link to="/resetPassword" className="nav-link [&.active]:font-bold">
            Reset Password
          </Link>{" "}
          <Link to="/createTicket" className="nav-link [&.active]:font-bold">
            Create Ticket
          </Link>{" "}
          <Link to="/users" className="nav-link [&.active]:font-bold">
            Tickets
          </Link>{" "}
          <Link to="/user-management" className="nav-link [&.active]:font-bold">
            Users Details
          </Link>{" "}
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
