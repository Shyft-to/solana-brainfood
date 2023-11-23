export const getTokenInfo = (token: string) => {
  switch (token) {
    case "So11111111111111111111111111111111111111112":
      return {
        decimal: 9,
        name: "SOL",
      };
    case "71tMhTspdcJ6pCPxfJZ69zboYSypcK6fDujuK7xRoRPK":
      return {
        decimal: 9,
        name: "FNC",
      };

    case "HAYsDsV8uQVJcrM3NMYrHZUvxoTSfhfns6yNxhPGZyiq":
      return {
        decimal: 9,
        name: "HAY",
      };

    default:
      return {
        decimal: -1,
        name: "N/A",
      };
  }
};
