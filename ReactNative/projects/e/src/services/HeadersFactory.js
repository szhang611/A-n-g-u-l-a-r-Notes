
getHeaders = (type) => {

    switch (type){
        case 'yelp' : return buildYelpHeaders()
        default:
            return buildGeneralHeaders()
    }

}

buildYelpHeaders = ()=> { 
    var headers = buildGeneralHeaders();
    headers.append("Authorization", "Bearer qWAIVRehahp-D22wcIH_s1Fg-42gBnfHbZ-IytJ2QCjto653ugGD9JIS-C4dJNNQ7MGzXNOcTgpmxVYxrLQSaz6KEIePAnxVRvd5HADikTHcxvtRl1PeY0CJto5yW3Yx")
    return headers
}

buildGeneralHeaders = ()=> {
    return new Headers()
}

export const HeaderFactory = {
    getHeaders
}