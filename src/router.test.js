import { URL } from 'url';
import { describe, test, expect } from '@jest/globals';
import { Router } from './router.js';

describe('router', () => {
  test('match against a matching route', () => {
    const url = new URL('https://www.example.com/test');
    const router = new Router();
    const params = { example: 'test' };
    const route = {
      match: () => {
        return params;
      },
    };
    router.addRoute(route);
    expect(router.match(url)).toEqual({ params, route, url });
  });

  test('match against a non-matching route', () => {
    const url = new URL('https://www.example.com/test');
    const router = new Router();
    const params = null;
    const route = {
      match: () => {
        return params;
      },
    };
    router.addRoute(route);
    expect(router.match(url)).toEqual({ params: null, route: null, url });
  });
});
