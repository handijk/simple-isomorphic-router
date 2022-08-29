import { URL } from 'url';
import { jest, describe, test, expect } from '@jest/globals';
import { Route } from './route.js';

describe('route', () => {
  test('match against a matching route', () => {
    const matchSpy = jest.fn();
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce({ example: 'test' });

    const route = new Route(
      {
        pathname: '/test',
      },
      {
        URLSearchParams: global.URLSearchParams,
        matchers: [matchSpy],
      }
    );
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(matchSpy).toBeCalledWith(url);
    expect(route.getPathname()).toEqual('/test');
    expect(route.getHref()).toEqual('/test');
    expect(route.getHash()).toEqual(undefined);
    expect(route.getHostname()).toEqual(undefined);
    expect(route.getPort()).toEqual(undefined);
    expect(route.getProtocol()).toEqual(undefined);
    expect(route.getUsername()).toEqual(undefined);
    expect(route.getPassword()).toEqual(undefined);
    expect(route.getSearchParams()).toEqual(new global.URLSearchParams());
    expect(route.getSearch()).toEqual('');
    expect(route.getSearch({ animal: 'horse' })).toEqual('animal=horse');
    expect(route.getSearch({ animal: 'horse' }, true)).toEqual('animal=horse');
  });

  test('match against a matching route including hostname', () => {
    const matchSpy = jest.fn();
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce({ example: 'test' });

    const route = new Route(
      {
        pathname: '/test',
        hostname: 'example.com',
      },
      {
        URLSearchParams: global.URLSearchParams,
        matchers: [matchSpy],
      }
    );
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(matchSpy).toBeCalledWith(url);
    expect(route.getPathname()).toEqual('/test');
    expect(route.getHref()).toEqual('//example.com/test');
    expect(route.getHash()).toEqual(undefined);
    expect(route.getHostname()).toEqual('example.com');
    expect(route.getPort()).toEqual(undefined);
    expect(route.getProtocol()).toEqual(undefined);
    expect(route.getUsername()).toEqual(undefined);
    expect(route.getPassword()).toEqual(undefined);
    expect(route.getSearchParams()).toEqual(new global.URLSearchParams());
    expect(route.getSearch()).toEqual('');
    expect(route.getSearch({ animal: 'horse' })).toEqual('animal=horse');
    expect(route.getSearch({ animal: 'horse' }, true)).toEqual('animal=horse');
  });

  test('match against a matching route including search params', () => {
    const matchSpy = jest.fn();
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce({ example: 'test' });

    const route = new Route(
      {
        pathname: '/test',
      },
      {
        URLSearchParams: global.URLSearchParams,
        matchers: [matchSpy],
      }
    );
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(matchSpy).toBeCalledWith(url);
    expect(route.getPathname()).toEqual('/test');
    expect(
      route.getHref(null, {
        searchParams: { animal: 'frog' },
      })
    ).toEqual('/test?animal=frog');
    expect(route.getHash()).toEqual(undefined);
    expect(route.getHostname()).toEqual(undefined);
    expect(route.getPort()).toEqual(undefined);
    expect(route.getProtocol()).toEqual(undefined);
    expect(route.getUsername()).toEqual(undefined);
    expect(route.getPassword()).toEqual(undefined);
    expect(route.getSearchParams()).toEqual(new global.URLSearchParams());
    expect(route.getSearch()).toEqual('');
    expect(route.getSearch({ animal: 'horse' })).toEqual('animal=horse');
    expect(route.getSearch({ animal: 'horse' }, true)).toEqual('animal=horse');
  });

  test('match against a matching route with full parameters', () => {
    const matchSpy = jest.fn();
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce({ example: 'test' });

    const route = new Route(
      {
        pathname: '/test',
        hash: 'hashtest',
        hostname: 'www.example.com',
        port: 364,
        protocol: 'https:',
        username: 'henk',
        password: 'secret',
        searchParams: { animal: 'frog' },
      },
      {
        URLSearchParams: global.URLSearchParams,
        matchers: [matchSpy],
      }
    );
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(matchSpy).toBeCalledWith(url);
    expect(route.getPathname()).toEqual('/test');
    expect(route.getHref()).toEqual(
      'https://henk:secret@www.example.com:364/test?animal=frog#hashtest'
    );
    expect(route.getHash()).toEqual('hashtest');
    expect(route.getHostname()).toEqual('www.example.com');
    expect(route.getPort()).toEqual(364);
    expect(route.getProtocol()).toEqual('https:');
    expect(route.getUsername()).toEqual('henk');
    expect(route.getPassword()).toEqual('secret');
    expect(route.getSearchParams()).toEqual(
      new global.URLSearchParams({ animal: 'frog' })
    );
    expect(route.getSearch()).toEqual('animal=frog');
    expect(route.getSearch({ animal: 'horse' })).toEqual(
      'animal=frog&animal=horse'
    );
    expect(route.getSearch({ animal: 'horse' }, true)).toEqual('animal=horse');
  });

  test('match against multiple non-matching matchers', () => {
    const matchSpy = jest.fn();
    const match2Spy = jest.fn();
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce(null);
    match2Spy.mockReturnValueOnce(null);

    const route = new Route(
      {
        pathname: '/test',
        hash: 'hashtest',
        hostname: 'www.example.com',
        port: 364,
        protocol: 'https:',
        username: 'henk',
        password: 'secret',
        searchParams: { animal: 'frog' },
      },
      {
        URLSearchParams: global.URLSearchParams,
        matchers: [matchSpy, match2Spy],
      }
    );
    expect(route.match(url)).toEqual(null);
    expect(matchSpy).toBeCalledWith(url);
    expect(route.getPathname()).toEqual('/test');
    expect(route.getHref()).toEqual(
      'https://henk:secret@www.example.com:364/test?animal=frog#hashtest'
    );
    expect(route.getHash()).toEqual('hashtest');
    expect(route.getHostname()).toEqual('www.example.com');
    expect(route.getPort()).toEqual(364);
    expect(route.getProtocol()).toEqual('https:');
    expect(route.getUsername()).toEqual('henk');
    expect(route.getPassword()).toEqual('secret');
    expect(route.getSearchParams()).toEqual(
      new global.URLSearchParams({ animal: 'frog' })
    );
    expect(route.getSearch()).toEqual('animal=frog');
    expect(route.getSearch({ animal: 'horse' })).toEqual(
      'animal=frog&animal=horse'
    );
    expect(route.getSearch({ animal: 'horse' }, true)).toEqual('animal=horse');
  });
});
