import { checkUnauthorized, GenericApiResponse, get, post } from "../common/api";
import { Account } from "../types/accounts";
import { GetConversationsResponse, GetMessagesResponse } from "../api/types/inboxTypes";
import { AnswerStatus } from "../constants/inboxConstant";

export const getConversations = async (
  _accountData: Account[],
  search: string,
  _pending: boolean,
  _cursor?: string,
  selectedAccountsIds?: string[],
  _selectedAnswerStatus?: Map<AnswerStatus, boolean>,
) => {
  const params = {
    ...(search && { searchText: search }),
    ...(selectedAccountsIds?.length && { 
      accountIDs: selectedAccountsIds.join(","), 
    }),
  };
  return await get<GetConversationsResponse, typeof params>(
    "/conversations?page=1&pageSize=300",
    params
  ).then(checkUnauthorized);
};

export const getMessages = async (conversationId: string) => {
  const params = {};
  return await get<GetMessagesResponse, typeof params>(`/conversations/${conversationId}`, params).then(
    checkUnauthorized,
  );
};

export const postMessage = async (conversationId: string, text: string) => {
  const data = {
    text: text,
  };
  return await post<GenericApiResponse, typeof data>(`/conversations/${conversationId}`, data).then(checkUnauthorized);
};

export const campaignMessage = async (senderURN: string, url: string, message: string) => {
  const data = {
    senderURN: senderURN,
    url: url,
    message: message,
  };
  return await post<GenericApiResponse, typeof data>(`/linkedin/sendNewMessage`, data).then(checkUnauthorized);
};
