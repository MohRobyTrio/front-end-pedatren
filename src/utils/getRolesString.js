export const getRolesString = () => {
  const rolesString = localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]";
  const roles = JSON.parse(rolesString);

  const capitalizedRoles = roles.map(role =>
    role.charAt(0).toUpperCase() + role.slice(1)
  );

  return capitalizedRoles.join(", ");
};
