/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-throw-literal */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable react/prop-types */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
import React, {createContext, useReducer} from 'react';
import RNSInfo from 'react-native-sensitive-info';
import RestClient from '../query/RestClient';

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext({});
function AuthProvider({children}) {
  const [state, dispatch] = useReducer(AuthReducer, {});

  const setUser = (user, token) => {
    dispatch({
      type: 'SET_USER',
      payload: {user: user, token: token},
    });
  };

  const logout = () => {
    RNSInfo.deleteItem('authInfo', {}).then(() => {
      setUser(null, '');
    });
  };

  const login = async (username, password, tenantID) => {
    try {
      const data = await RestClient.post('/auth/login', {
        username: username,
        password: password,
        clientType: 'CORPORATE',
        tenantID: tenantID,
      });
      let credentialsPayload = JSON.stringify(data.data);

      await RNSInfo.setItem('authInfo',credentialsPayload, {});
      setUser(data.data.user, data.data.accessToken);
    } catch (error) {
      switch (error.response?.status) {
        case 401:
          throw 'Username atau password salah';
        default:
          throw `Terjadi kesalahan saat login (code: ${error.response?.code}): ${error.response}`;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{user: state.user, token: state.token, setUser, logout, login}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
