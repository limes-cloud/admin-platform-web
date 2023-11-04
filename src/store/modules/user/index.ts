import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout } from '@/api/basic/auth';
import { currentUser } from '@/api/basic/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { LoginReq } from '@/api/basic/types/auth';
import rsa from '@/utils/rsa';
import { User } from '@/api/basic/types/user';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): User => ({} as User),

  getters: {
    userInfo(state: User): User {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<User>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const { data } = await currentUser();
      this.setInfo(data);
    },

    // Login
    async login(req: LoginReq) {
      const info = {
        ...req,
        password: rsa.encrypt({
          password: req.password,
          time: new Date().getTime(),
        }),
      };
      try {
        const { data } = await userLogin(info as LoginReq);
        setToken(data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    clear() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearApp();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.clear();
      }
    },
  },
});

export default useUserStore;
