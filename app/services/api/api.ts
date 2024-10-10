/* eslint-disable @typescript-eslint/no-unused-vars */
// import { ApiResponse, ApisauceInstance, create } from "apisauce";
// import type { ApiConfig } from "./api.types";
// import { ApiResponse } from "apisauce";
// import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem";
import AsyncStorage from '@react-native-async-storage/async-storage';


// export const DEFAULT_API_CONFIG: ApiConfig = {
//   url: "http://192.168.18.223:8050/api", // Base URL baru dari API Anda
//   timeout: 10000,
// };



/**
 * Kelas utama untuk manajemen API.
 */
export interface LoginSchema {
  username: string;
  password: string;
}

export interface BearerTokenSchema {
  access_token: string;
  refresh_token: string | null;
}

export const BaseApi = {
  url: "https://api-core-staging.dotsco.re/api",
  timeout: 10000,
}


export class Api {
  /*
  apisauce: ApisauceInstance;
  config: ApiConfig;

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    });
  }
 */

  /**
    * ==================== GET METHOD ====================
  */

  /** (DONE)
     * Api mendapatkan seluruh customer. Menggunkan Fetch Data dan AsynStorage (seperti local storage) untuk passing token
     * @param {string} kind - mengidentifikasi status dari respons yang diterima dari fungsi
     * @param {any} customers - array untuk menaruh seluruh data customers.
     * 
     * "bad-data" dan undefined dieksekusi ketika permintaan (request) untuk mengambil data pelanggan tidak berhasil.
     */
  async getAllCustomers(): Promise<{ kind: "ok"; customers: any[] } | { kind: "bad-data" } | undefined> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const kodeKantor = await AsyncStorage.getItem('kodeKantor'); // Retrieve kodeKantor
      console.log("Token retrieved:", token);
      console.log("Kode Kantor retrieved:", kodeKantor);

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.");
        return { kind: "bad-data" };
      }

      const response = await fetch(`${BaseApi.url}/core/customers`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'X-Tenant-Id': kodeKantor, // Use kodeKantor from AsyncStorage
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch customers. Status:", response.status);
        return { kind: "bad-data" };
      }

      const data = await response.json();
      console.log("Customers data:", data);

      return { kind: "ok", customers: data || [] };
    } catch (error) {
      console.error("Error retrieving customers:", error);
      return undefined;
    }
  }



  /**
    * ==================== POST METHOD ====================
  */

  /** (DONE)
   * Fungsi Authentikasi User
   * @param {string} username - username user.
   * @param {string} password - password user.
   */
  async login(username: string, password: string, kodeKantor: number) { // Change to number type
    try {
      // Convert kodeKantor to string for the header
      const response = await fetch(`${BaseApi.url}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': kodeKantor.toString(), // Use Kode Kantor here as a string
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Error response:', errorResponse);
        throw new Error(`Login failed: ${response.status} ${errorResponse}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }


}

export const api = new Api();
