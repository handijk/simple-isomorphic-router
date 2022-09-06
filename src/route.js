export class Route {
  #pathname = null;
  #hash = null;
  #hostname = null;
  #port = null;
  #protocol = null;
  #username = null;
  #password = null;
  #searchParams = null;

  #URLSearchParams = null;
  #matchers = [];

  constructor(
    {
      pathname,
      hash,
      hostname,
      port,
      protocol,
      username,
      password,
      searchParams,
    },
    { matchers, URLSearchParams }
  ) {
    this.#pathname = pathname;
    this.#hash = hash;
    this.#hostname = hostname;
    this.#port = port;
    this.#protocol = protocol;
    this.#username = username;
    this.#password = password;
    this.#searchParams = new URLSearchParams(searchParams);
    this.#matchers = matchers;

    this.#URLSearchParams = URLSearchParams;
  }

  static getHostPart({ hostname, port, protocol, username, password }) {
    return `${protocol ?? ''}//${
      username && password ? `${username}:${password}@` : ''
    }${hostname}${port ? `:${port}` : ''}`;
  }

  #mergeSearchParams(searchParams = null, replace = false) {
    return this.mergeSearchParams(this.#searchParams, searchParams, replace);
  }

  mergeSearchParams(searchParams1, searchParams2, replace = false) {
    const entries = new this.#URLSearchParams(searchParams1);
    const newEntries = new this.#URLSearchParams(searchParams2);
    if (replace) {
      for (const [key, value] of newEntries.entries()) {
        entries.set(key, value);
      }
    } else {
      for (const [key, value] of newEntries.entries()) {
        entries.append(key, value);
      }
    }
    return entries;
  }

  match(location) {
    return this.#matchers.reduce((params, matcher) => {
      if (!params) {
        return null;
      }
      const match = matcher(location);
      return match
        ? {
            ...params,
            ...match,
          }
        : null;
    }, {});
  }

  getPathname() {
    return this.#pathname ?? '/';
  }

  getHash() {
    return this.#hash;
  }

  getHostname() {
    return this.#hostname;
  }

  getPort() {
    return this.#port;
  }

  getProtocol() {
    return this.#protocol;
  }

  getUsername() {
    return this.#username;
  }

  getPassword() {
    return this.#password;
  }

  getHref(params, { searchParams, replace = false } = {}) {
    const search = this.getSearch(searchParams, replace);
    const host = this.getHostname(params);
    const hash = this.getHash(params);
    return `${
      host
        ? Route.getHostPart({
            protocol: this.getProtocol(params),
            hostname: host,
            port: this.getPort(params),
            username: this.getUsername(params),
            password: this.getPassword(params),
          })
        : ''
    }${this.getPathname(params)}${search ? `?${search}` : ''}${
      hash ? `#${hash}` : ''
    }`;
  }

  getSearchParams(searchParams = null, replace = false) {
    return this.#mergeSearchParams(searchParams, replace);
  }

  getSearch(searchParams = null, replace = false) {
    return this.getSearchParams(searchParams, replace).toString();
  }
}
