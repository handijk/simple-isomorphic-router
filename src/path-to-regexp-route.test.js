import { URL } from 'url';
import { jest, describe, test, expect } from '@jest/globals';
import pathToRegexpRouteModule from './path-to-regexp-route.js';
import { PathToRegexpRoute } from './path-to-regexp-route.js';

describe('path to regexp route', () => {
  test('pathname match against a matching route on pathname', () => {
    const compileSpy = jest.spyOn(pathToRegexpRouteModule, 'compile');
    const matchSpy = jest.spyOn(pathToRegexpRouteModule, 'match');
    const url = new URL('https://www.example.com/test');

    matchSpy.mockReturnValueOnce(() => ({ params: { example: 'test' } }));

    const route = new PathToRegexpRoute(
      {
        pathname: '/:example',
      },
      {
        URLSearchParams: global.URLSearchParams,
      }
    );
    expect(compileSpy).toBeCalledWith('/:example', {});
    expect(matchSpy).toBeCalledWith('/:example', {});
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(route.getPathname({ example: 'test' })).toEqual('/test');
    expect(route.getHostname()).toEqual(undefined);
    expect(route.getHref({ example: 'test' })).toEqual('/test');
    expect(route.getSearch({})).toEqual('');
  });

  test('hostname match against a matching route on hostname', () => {
    const compileSpy = jest.spyOn(pathToRegexpRouteModule, 'compile');
    const matchSpy = jest.spyOn(pathToRegexpRouteModule, 'match');
    const url = new URL('https://test.example.com/test');

    matchSpy.mockReturnValueOnce(() => ({ params: { example: 'test' } }));

    const route = new PathToRegexpRoute(
      {
        hostname: ':example.example.com',
      },
      {
        URLSearchParams: global.URLSearchParams,
      }
    );
    expect(compileSpy).toBeCalledWith(':example.example.com', {});
    expect(matchSpy).toBeCalledWith(':example.example.com', {});
    expect(route.match(url)).toEqual({ example: 'test' });
    expect(route.getPathname({})).toEqual('/');
    expect(route.getHostname({ example: 'test' })).toEqual('test.example.com');
    expect(route.getHref({ example: 'test' })).toEqual('//test.example.com/');
    expect(route.getSearch({})).toEqual('');
  });
});
