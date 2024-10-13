// Ensure the imports are correct
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BaseApi = {
  url: "https://api-core-staging.dotsco.re/api",
  timeout: 10000,
};

export class Api {
  /**
   * ==================== GET METHOD ====================
   */

  async getAllCustomers(): Promise<{ kind: "ok"; customers: any[] } | { kind: "bad-data" } | undefined> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const kodeKantor = await AsyncStorage.getItem('kodeKantor');

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.");
        return { kind: "bad-data" };
      }

      const response = await fetch(`${BaseApi.url}/core/customers`, {
        method: "GET",
        headers: {
          Accept: 'application/json',
          'X-Tenant-Id': kodeKantor,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch customers. Status:", response.status);
        return { kind: "bad-data" };
      }

      const data = await response.json();
      return { kind: "ok", customers: data || [] };
    } catch (error) {
      console.error("Error retrieving customers:", error);
      return undefined;
    }
  }

  /**
   * Fetch customer savings data based on CIF.
   * @param {string} cif - Customer Information File identifier.
   * @returns {Promise<{ kind: "ok"; savings: any } | { kind: "bad-data" } | undefined>}
   */
  async getCustomerSavingsByCif(
    cif: string,
  ): Promise<{ kind: "ok"; savings: any } | { kind: "bad-data" } | undefined> {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const kodeKantor = await AsyncStorage.getItem("kodeKantor") // Retrieve kodeKantor

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.")
        return { kind: "bad-data" }
      }

      const response = await fetch(`${BaseApi.url}/core/customers/${cif}/savings`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Id": kodeKantor, // Use kodeKantor from AsyncStorage
        },
      })

      if (!response.ok) {
        console.error(
          "Failed to fetch savings for customer with CIF:",
          cif,
          ". Status:",
          response.status,
        )
        return { kind: "bad-data" }
      }

      const data = await response.json()
      console.log("Savings data:", data)

      return { kind: "ok", savings: data || [] }
    } catch (error) {
      console.error("Error retrieving savings for CIF:", cif, error)
      return undefined
    }
  }

  /**
   * Fetch customer loans data based on CIF.
   * @param {string} cif - Customer Information File identifier.
   * @returns {Promise<{ kind: "ok"; loans: any } | { kind: "bad-data" } | undefined>}
   */
  async getCustomerLoansByCif(
    cif: string,
  ): Promise<{ kind: "ok"; loans: any } | { kind: "bad-data" } | undefined> {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const kodeKantor = await AsyncStorage.getItem("kodeKantor") // Retrieve kodeKantor

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.")
        return { kind: "bad-data" }
      }

      const response = await fetch(`${BaseApi.url}/core/customers/${cif}/loans`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Id": kodeKantor, // Use kodeKantor from AsyncStorage
        },
      })

      if (!response.ok) {
        console.error(
          "Failed to fetch loans for customer with CIF:",
          cif,
          ". Status:",
          response.status,
        )
        return { kind: "bad-data" }
      }

      const data = await response.json()

      if (data && data.length > 0) {
        console.log("Loans data found:", data)
      } else {
        console.log("No loans data found for CIF:", cif)
      }

      return { kind: "ok", loans: data || [] }
    } catch (error) {
      console.error("Error retrieving loans for CIF:", cif, error)
      return undefined
    }
  }

  // Fungsi untuk mendapatkan daftar batch transaksi
  async getTransactionBatches() {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const kodeKantor = await AsyncStorage.getItem("kodeKantor") // Retrieve kodeKantor

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.")
        return { kind: "bad-data" }
      }

      const response = await fetch(`${BaseApi.url}/mobile-corporate/transaction-batches`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Id": kodeKantor, // Use kodeKantor from AsyncStorage
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch transaction batches")
        return { kind: "bad-data" }
      }

      const data = await response.json()
      console.log("API Data:", data) // Log data yang diterima dari API
      return { kind: "ok", transactionBatches: data }
    } catch (error) {
      console.error("Error in getTransactionBatches:", error)
      return { kind: "bad-data" }
    }
  }

  async getTransactionBatchById(
    id: string
  ): Promise<{ kind: "ok"; transactionBatch: any } | { kind: "bad-data" } | undefined> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const kodeKantor = await AsyncStorage.getItem("kodeKantor");

      if (!token || !kodeKantor) {
        console.error("Token or Kode Kantor not found! Make sure the user is logged in.");
        return { kind: "bad-data" };
      }

      const response = await fetch(`${BaseApi.url}/mobile-corporate/transaction-batches/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Id": kodeKantor,
        },
      });

      if (!response.ok) {
        console.error(
          "Failed to fetch transaction batch with ID:",
          id,
          ". Status:",
          response.status
        );
        return { kind: "bad-data" };
      }

      const data = await response.json();
      console.log("Transaction batch data:", data);

      return { kind: "ok", transactionBatch: data };
    } catch (error) {
      console.error("Error retrieving transaction batch with ID:", id, error);
      return undefined;
    }
  }




  /**
   * ==================== POST METHOD ====================
   */

  async login(username: string, password: string, kodeKantor: number) {
    try {
      const response = await fetch(`${BaseApi.url}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': kodeKantor.toString(),

        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Login failed: ${response.status} ${errorResponse}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async createTransactionBatch(
    id: string,
    createdBy: number,
    status: number,
    branchId: string,
    coreTrxGroupId: string,
    isActive: boolean
  ) {

    try {
      const kodeKantor = await AsyncStorage.getItem('kodeKantor');
      const token = await AsyncStorage.getItem('authToken');

      if (!kodeKantor) {
        console.error("Kode Kantor not found! Make sure the user is logged in.");
        return { kind: "bad-data" };
      }
      const response = await fetch(`${BaseApi.url}/mobile-corporate/transaction-batches`, {


        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': kodeKantor.toString(),
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({
          id,
          created_by: createdBy,
          created_at: new Date().toISOString(),
          status,
          is_active: isActive,
          branch_id: branchId,
          core_trx_group_id: coreTrxGroupId,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorResponse}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * ==================== PATCH METHOD ====================
   */

  async updateTransactionBatch(trxBatchId: any, status: any, settledAt: any, settledBy: any, isActive: any) {
    try {
      const kodeKantor = await AsyncStorage.getItem('kodeKantor');
      const token = await AsyncStorage.getItem('authToken');

      if (!kodeKantor) {
        console.error("Kode Kantor not found! Make sure the user is logged in.");
        return { kind: "bad-data" };
      }

      const response = await fetch(`${BaseApi.url}/mobile-corporate/transaction-batches/${trxBatchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': kodeKantor.toString(),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          settled_at: settledAt,
          settled_by: settledBy,
          is_active: isActive,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorResponse}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request error:', error);
      return { success: false, error: error.message };
    }
  }




}




export const api = new Api();
