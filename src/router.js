export class Router {
  #routes = [];

  addRoute(...routes) {
    this.#routes = [...this.#routes, ...routes];
  }

  match(url) {
    for (const route of this.#routes) {
      const params = route.match(url);
      if (params) {
        return { route, params, url };
      }
    }
    return { route: null, params: null, url };
  }
}
