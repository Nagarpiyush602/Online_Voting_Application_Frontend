import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMksafXHdu6y4nXZvLJOF8n4tSaYqdZOg",
  authDomain: "votezy-2026.firebaseapp.com",
  projectId: "votezy-2026",
  appId: "1:439504773375:web:80dbf97b1b20665500acca",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
