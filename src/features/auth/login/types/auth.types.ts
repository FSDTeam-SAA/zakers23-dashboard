export type AdminLoginCredentials = {
  email: string;
  password: string;
};

export type AdminLoginFormValues = AdminLoginCredentials & {
  remember: boolean;
};

export type AuthenticatedAdmin = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "admin";
};

export type AdminLoginResponse = {
  user: AuthenticatedAdmin;
};
