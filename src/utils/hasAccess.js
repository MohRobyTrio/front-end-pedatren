import { rolesWithAccess } from "../hooks/config";

export const hasAccess = (action) => {
  const rolesString = localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]";
  const roles = JSON.parse(rolesString);

  const allowedRoles = rolesWithAccess[action] || [];
  return allowedRoles.some(role => roles.includes(role));
};
