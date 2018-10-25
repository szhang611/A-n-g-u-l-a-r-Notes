CACHE = {

}
getCache = (key)=>{
    console.log(`reading cache using key ${key}`)
    if(key && CACHE.hasOwnProperty(key)){
        console.log(`return value in cache for key : ${key} , ${CACHE[key]} `)
        return CACHE[key]
    }

    return undefined;

}


addToCache = (key, value) =>{
    console.log(`adding cache for key ${key}`)
    CACHE[key] = value
    CACHE = Object.assign({}, CACHE)

}

export const APICache = {
    addToCache,
    getCache
}