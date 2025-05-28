import { defineStore } from "pinia";
import { login, register, logout, checkAuth } from "../apis/user_Api.js";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    isEditing: false,
  }),
  actions: {
    async login(userData: object) {
      const data = await login(userData);
      this.user = data._id;
    },
    async register(userData: object) {
      const data = await register(userData);
      this.user = data.user;
    },
    async logout() {
      await logout();
      this.user = null;
    },
    async checkAuth() {
      const data = await checkAuth();
      this.user = data.user;
    },
    showEdit() {
      if (this.isEditing === true && this.user) {
        return true;
      } else {
        return false;
      }
    },
  },
  persist: true,
});
