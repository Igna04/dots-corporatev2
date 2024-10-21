import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authUsername: types.maybe(types.string),
    kodeKantor: types.maybe(types.string),
    isAuthenticationLoading: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get validationError() {
      if (!store.authUsername || store.authUsername.length === 0) return "Username can't be blank";
      if (store.authUsername.length < 6) return "Username must be at least 6 characters";
      if (!store.kodeKantor || store.kodeKantor.length === 0) return "Kode Kantor can't be blank";
      if (isNaN(Number(store.kodeKantor))) return "Kode Kantor must be a valid integer";
      return "";
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
    setAuthUsername(value: string) {
      store.authUsername = value.replace(/ /g, "");
    },
    setKodeKantor(value: string) {
      store.kodeKantor = value.replace(/ /g, "");
    },
    setIsAuthenticationLoading(value: boolean) {
      store.isAuthenticationLoading = value;
    },
    logout() {
      store.authToken = undefined;
      store.authUsername = "";
      store.kodeKantor = "";
      store.isAuthenticationLoading = false;
    },
  }));

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }