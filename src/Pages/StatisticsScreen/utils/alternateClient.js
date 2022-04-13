const activeClient = (clientArray) => {
  const inactiveClients = clientArray.map((client) => {
    if (!client.active) {
      return {
        ...client,
        name: `${client.name} (desativado)`,
      };
    }
    return client;
  });
  return inactiveClients;
};

export default activeClient;
