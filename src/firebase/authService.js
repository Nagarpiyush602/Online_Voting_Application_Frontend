import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  assignRoleByEmail,
  clearAuthStorage,
  getRoleByEmail,
  setToken,
  setUserRole,
} from "../utils/auth";

const saveSession = async (user, email, fallbackRole = "VOTER") => {
  const token = await user.getIdToken();
  const role = getRoleByEmail(email) || fallbackRole;

  setToken(token);
  setUserRole(role);

  return { token, role, user };
};

export const signupUser = async ({ email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const role = assignRoleByEmail(email);

  return saveSession(userCredential.user, email, role);
};

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return saveSession(userCredential.user, email);
};

export const logoutUser = async () => {
  await signOut(auth);
  clearAuthStorage();
};
