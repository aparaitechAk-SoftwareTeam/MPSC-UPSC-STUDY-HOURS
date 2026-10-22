import { NavLink, useNavigate as useRRNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function useNavigate() {
  const navigate = useRRNavigate();
  return (to, options) => {
    if (typeof to === "object" && to?.to) {
      navigate(to.to, options);
    } else {
      navigate(to, options);
    }
  };
}

// Drop-in replacement for the TanStack Router <Link> usage in this app:
// supports `to`, `activeProps.className` and `activeOptions.exact`.
export function Link({ to, activeProps, activeOptions, className, children, ...rest }) {
  return (
    <NavLink
      to={to}
      end={activeOptions?.exact ?? false}
      className={({ isActive }) => cn(className, isActive && activeProps?.className)}
      {...rest}
    >
      {children}
    </NavLink>
  );
}
