const { error } = require('console')
const {crawlURL} = require('./crawl.js')
const {write} = require('fs')
async function main(){
    if(process.argv.length < 3){
        console.log("no website provided")
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("more than one website provided")
        process.exit(1)
    }
    const baseURL = process.argv[2]
    console.log(`Starting crawling of ${baseURL}`)
    const pages = await crawlURL(baseURL,baseURL,{})
    for(const page in pages){
        console.log(page,pages[page])
        write("page.txt",page,err=>{
            console.log(err)
        })
    }
    
}

main()