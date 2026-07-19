export default class Database {
  constructor() {}
  pragma() {}
  exec() {}
  prepare() {
    return {
      all: () => [],
      get: () => null,
      run: () => {},
    };
  }
  close() {}
}
