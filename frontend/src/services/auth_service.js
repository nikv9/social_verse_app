import apiInstance from "../interceptors";

const authService = {};

authService.signup = (data) => {
  return apiInstance.post("/signup", data);
};

authService.signin = (email, password) => {
  return apiInstance.post("/signin", {
    email: email,
    password: password,
  });
};

authService.forgotPass = (email) => {
  return apiInstance.post("/pass/forgot", {
    email: email,
  });
};
authService.resetPass = (data) => {
  return apiInstance.put("/pass/reset/" + data.token, data);
};

export default authService;
