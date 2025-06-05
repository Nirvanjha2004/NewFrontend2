import { mockConnections } from "src/mocks";

import { State } from "../types/connections";

export const getConnections = async (search: string, _cursor?: string, showPending?: boolean) => {
  // Mocking
  const filteredConnections = (() => {
    const connections = mockConnections.filter((connection) => connection.state !== State.DELETED);
    if (showPending) {
      return connections;
    }
    return connections.filter((connection) => connection.state !== State.INACTIVE);
  })().filter(
    (connection) =>
      connection.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      connection.user.lastName.toLowerCase().includes(search.toLowerCase()),
  );
  return {
    message: "Success",
    data: {
      connectionsCount: filteredConnections.length,
      connections: filteredConnections,
      cursors: {
        previous: null,
        next: null,
      },
    },
  };

  // const params = {
  //   cursor,
  //   ...(search.length > 0 ? { search_str: search } : {}),
  //   ...(showPending ? { states: State.INACTIVE.toString() } : {}),
  // };
  // return await get<GetConnectionsResponse, typeof params>("/platforms/connections/", params).then(checkUnauthorized);
};
