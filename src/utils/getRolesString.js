export const getRolesString = () => {
  const rolesString = localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]";
  const roles = JSON.parse(rolesString);

  return roles.join(", ");
};
