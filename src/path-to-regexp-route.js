import { compile, match } from 'path-to-regexp';
import { Route } from './route.js';

const pathToRegexpRouteModule = { compile, match };

export class PathToRegexpRoute extends Route {
  #pathCompiler = null;
  #hostCompiler = null;

  constructor(
    { pathname, hostname, ...params },
    { compileOptions, matchOptions, ...options }
  ) {
    const matchers = [];
    let pathCompiler = null;
    let hostCompiler = null;
    if (pathname) {
      const pathMatcher = pathToRegexpRouteModule.match(pathname, {
        ...matchOptions,
      });
      pathCompiler = pathToRegexpRouteModule.compile(pathname, {
        ...compileOptions,
      });
      matchers.push((location) => pathMatcher(location.pathname)?.params);
    }
    if (hostname) {
      const hostMatcher = pathToRegexpRouteModule.match(hostname, {
        ...matchOptions,
      });
      hostCompiler = pathToRegexpRouteModule.compile(hostname, {
        ...compileOptions,
      });
      matchers.push((location) => hostMatcher(location.hostname)?.params);
    }
    super({ pathname, hostname, ...params }, { matchers, ...options });
    this.#pathCompiler = pathCompiler;
    this.#hostCompiler = hostCompiler;
  }

  getPathname(params) {
    return this.#pathCompiler
      ? this.#pathCompiler(params)
      : super.getPathname(params);
  }

  getHostname(params) {
    return this.#hostCompiler
      ? this.#hostCompiler(params)
      : super.getHostname(params);
  }
}

export default pathToRegexpRouteModule;
