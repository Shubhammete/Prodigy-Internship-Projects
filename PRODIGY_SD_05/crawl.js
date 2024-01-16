const {JSDOM} = require('jsdom')

let crawlURL = async(baseURL,currentURL,pages)=>{
    

    let baseURLObj = new URL(baseURL);
    let currentURLOBj = new URL(currentURL);

    if(baseURLObj.hostname !== currentURLOBj.hostname){
        return pages
    }

    const NormalizedURL = NormalizeURL(currentURL)
    if(pages[NormalizedURL]>0){
        pages[NormalizedURL]++
        return pages
    }else{
    pages[NormalizedURL] = 1
    }
    console.log(`Actively crawling ${currentURL}`)
    try{
    const resp = await fetch(currentURL)
    // checking status code if above 400 it states server or client errors
    if(resp.status > 399){
        console.log(`Error fetching URL with status code ${resp.status}`)
        return pages
    }
    // checking content type  
    if(!resp.headers.get('content-type').includes('text/html')){
        console.log(`Error fetching URL Content type ${contentType}`)
        return pages
    }

    let htmlBody = await resp.text()
    const URLs = getURLFromHTML(htmlBody,baseURL) 
    for(const url of URLs){
        pages = await crawlURL(baseURL,url,pages)
    }
    }catch(err){
        console.log(`Error on crawling ${currentURL} Error Message ${err}`)
    }
    return pages
}

let NormalizeURL=(urlString)=>{
    let URLobj = new URL(urlString)
    let NormalizedURL = `${URLobj.hostname}${URLobj.pathname}`
    if(NormalizedURL.length > 0 && NormalizedURL.slice(-1) === '/'){
        return NormalizedURL.slice(0,-1)
    }
    return NormalizedURL
}

let getURLFromHTML = (htmlBody,baseURL)=>{
    const URLs = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('.puis-card-container')
    for(const link of links){
        // check if URL is relative then add baseURL to it
        if(link.href.slice(0,1)==='/'){
            try{
            let finalURL = new URL(`${baseURL}${link.href}`)
            URLs.push(finalURL.href)
            }catch(err){
                console.log(`Error Message ${err}`)
            }
        }else{
            try{
            let finaleURL = new URL(link.href)
            URLs.push(finaleURL.href)
            }catch(err){
                console.log(`Error Message ${err}`)
            }
        }
    }
    return URLs
}
module.exports = {
    NormalizeURL,
    getURLFromHTML,
    crawlURL
}