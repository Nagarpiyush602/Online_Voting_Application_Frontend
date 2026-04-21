const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USER_ROLE_MAP_KEY = "votezyUserRoles";
const ADMIN_CREATED_KEY = "votezyAdminCreated";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserRole = () => localStorage.getItem(ROLE_KEY);

export const setUserRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const removeUserRole = () => {
  localStorage.removeItem(ROLE_KEY);
};

export const clearAuthStorage = () => {
  removeToken();
  removeUserRole();
};

const getStoredRoleMap = () => {
  const roleMap = localStorage.getItem(USER_ROLE_MAP_KEY);
  return roleMap ? JSON.parse(roleMap) : {};
};

const setStoredRoleMap = (roleMap) => {
  localStorage.setItem(USER_ROLE_MAP_KEY, JSON.stringify(roleMap));
};

export const getRoleByEmail = (email) => {
  const roleMap = getStoredRoleMap();
  return roleMap[email] || null;
};

export const assignRoleByEmail = (email) => {
  const existingRole = getRoleByEmail(email);

  if (existingRole) {
    return existingRole;
  }

  const adminCreated = localStorage.getItem(ADMIN_CREATED_KEY) === "true";
  const newRole = adminCreated ? "VOTER" : "ADMIN";

  const roleMap = getStoredRoleMap();
  roleMap[email] = newRole;
  setStoredRoleMap(roleMap);

  if (newRole === "ADMIN") {
    localStorage.setItem(ADMIN_CREATED_KEY, "true");
  }

  return newRole;
};
