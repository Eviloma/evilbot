interface IPlural {
  [key: string]: {
    [key: string]: string;
  };
}

const plurals: IPlural = {
  track: {
    one: 'трек',
    few: 'треки',
    many: 'треків',
  },
};

export default plurals;
