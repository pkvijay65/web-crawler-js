const { test, expect } = require('@jest/globals');
const { normalizeUrl } = require('./crawl');
const { getURLsFromHTML } = require('./crawl');

//write some tests for normalizeUrl

test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL http', () => {
    const input = 'http://BLOG.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })

  describe('getURLsFromHTML', () => {
        it('converts relative URLs to absolute URLs', () => {
            const htmlBody = `
                <html>
                    <body>
                        <a href="/relative/path">Relative Link</a>
                    </body>
                </html>`;
            const baseURL = 'https://example.com';

            const result = getURLsFromHTML(htmlBody, baseURL);
            expect(result).toContain('https://example.com/relative/path');
        });

        it('finds all <a> tags in a body of HTML', () => {
            const htmlBody = `
                <html>
                    <body>
                        <a href="https://blog.boot.dev">Boot.dev Blog</a>
                        <a href="https://example.com">Example</a>
                    </body>
                </html>`;
        
            const result = getURLsFromHTML(htmlBody, '');
            expect(result).toEqual(['https://blog.boot.dev/', 'https://example.com/']);
        });
    });

    test('getURLsFromHTML absolute', () => {
        const inputURL = 'https://blog.boot.dev'
        const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
        const actual = getURLsFromHTML(inputBody, inputURL)
        const expected = [ 'https://blog.boot.dev/' ]
        expect(actual).toEqual(expected)
      })
      
      test('getURLsFromHTML relative', () => {
        const inputURL = 'https://blog.boot.dev'
        const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
        const actual = getURLsFromHTML(inputBody, inputURL)
        const expected = [ 'https://blog.boot.dev/path/one' ]
        expect(actual).toEqual(expected)
      })
      
      test('getURLsFromHTML both', () => {
        const inputURL = 'https://blog.boot.dev'
        const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
        const actual = getURLsFromHTML(inputBody, inputURL)
        const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
        expect(actual).toEqual(expected)
      })
      
      test('getURLsFromHTML handle error', () => {
        const inputURL = 'https://blog.boot.dev'
        const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
        const actual = getURLsFromHTML(inputBody, inputURL)
        const expected = [ ]
        expect(actual).toEqual(expected)
      })