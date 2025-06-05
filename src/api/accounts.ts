import { checkUnauthorized, get } from "../common/api";
import { GetAccountsResponse, GetAccountResponse } from "../api/types/accountTypes";
import { SyncState } from "../constants/accountConstant";
export const getAccounts = async () => {
  return await get<GetAccountsResponse>("/accounts")
    .then(checkUnauthorized)
    .then(response => {
      if (response && response.data) {
        const updatedAccounts = response.data.map(account => {
          // If already inactive, return as is
          if (account.status === 'inactive') {
            return account;
          }
  
          // Check conversation fetch failures
          if (account.convFetchedFailures && account.convFetchedFailures >= 3) {
            return {
              ...account,
              status: SyncState.INACTIVE
            };
          }
  
          // Check campaign failures
          if (account.accountActions?.campaignFailures && account.accountActions.campaignFailures >= 3) {
            return {
              ...account,
              status: SyncState.INACTIVE
            };
          }
  
          return account;
        });
  
        return {
          ...response,
          data: updatedAccounts
        };
      }
      return response;
    });
};

export const getAccount = async (accountId: string) => {
  return await get<GetAccountResponse>(`/accounts/${accountId}`)
    .then(checkUnauthorized)
    .then(response => {
      const account = response.data;
      // If already inactive, return as is
      if (account.status === 'inactive') return response;

      // Check conversation fetch failures
      if (account.convFetchedFailures && account.convFetchedFailures >= 3) {
        return {
          ...response,
          data: {
            ...account,
            status: SyncState.INACTIVE
          }
        };
      }

      // Check campaign failures
      if (account.campaignFailures && account.campaignFailures >= 3) {
        return {
          ...response,
          data: {
            ...account,
            status: SyncState.INACTIVE
          }
        };
      }

      return response;
    });
};
