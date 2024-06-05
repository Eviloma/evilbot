interface IPlural {
  [key: string]: {
    [key: string]: string;
  };
}

const plurals: IPlural = {
  track: {
    one: "трек",
    few: "треки",
    many: "треків",
  },
  message: {
    one: "повідомлення",
    few: "повідомлення",
    many: "повідомлень",
  },
};

export default plurals;
