const {NormalizeURL,getURLFromHTML}  = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test("test for url",()=>{
    const input = 'http://blog.boot.dev/path/'
    const output = NormalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(output).toEqual(expected)
})

test("getURLs from HTML body",()=>{
    const body = `
    <html>
        <body>
            <a href="http://blog.boot.dev/path1/">Blog</a>
            <a href="/path2/">Blog</a>
            
        </body>
    </html>
    `
    const baseURL = "http://blog.boot.dev"
    const output = getURLFromHTML(body,baseURL)
    const expected = ['http://blog.boot.dev/path1/','http://blog.boot.dev/path2/']
    expect(output).toEqual(expected)
})