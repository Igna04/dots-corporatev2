import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authUsername: types.maybe(types.string), // Updated to use types.maybe for consistency
    kodeKantor: types.maybe(types.string), // Add kodeKantor property
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get validationError() {
      if (!store.authUsername || store.authUsername.length === 0) return "Username can't be blank"; // Updated validation message
      if (store.authUsername.length < 6) return "Username must be at least 6 characters"; // Updated for clarity
      if (!store.kodeKantor || store.kodeKantor.length === 0) return "Kode Kantor can't be blank"; // Validate kodeKantor
      if (isNaN(Number(store.kodeKantor))) return "Kode Kantor must be a valid integer"; // Validate if kodeKantor is an integer
      return "";
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
    setAuthUsername(value: string) { // Update to setAuthUsername
      store.authUsername = value.replace(/ /g, "");
    },
    setKodeKantor(value: string) { // Add setKodeKantor action
      store.kodeKantor = value.replace(/ /g, "");
    },
    logout() {
      store.authToken = undefined;
      store.authUsername = ""; // Reset authUsername
      store.kodeKantor = ""; // Reset kodeKantor on logout
    },
  }));

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }
