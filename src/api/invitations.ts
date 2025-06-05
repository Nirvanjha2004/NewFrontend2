import { checkUnauthorized, get } from "../common/api";
import { GetInvitationsResponse } from "../api/types/invitationsTypes";

export const getInvitations = async (search: string, cursor?: string) => {
  const params = {
    cursor,
    ...(search.length > 0 ? { search_str: search } : {}),
  };
  return await get<GetInvitationsResponse, typeof params>("/platforms/invitations/", params).then(checkUnauthorized);
};
