import authService from "./services/auth.service";

export default {
  install: (app) => {
    app.config.globalProperties.$authx = authService;
    app.provide('authx', authService);
  }
};