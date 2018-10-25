import { HeaderFactory } from "./HeadersFactory";
import {APICache} from './APICache'


/**
 * return FoodList according to lat , lon
 * by default return 10 records if no limit is set
 */

searchFood = async (lat, lon, limit = 10, offset = 0, price = '1,2,3,4',open_now = false, sort_by = 'best_match' , attributes = '', searchText = '') =>  {
    let cacheKey = ['searchFood',lat,lon,limit,offset, price, open_now, sort_by, attributes]
    let cacheValue = APICache.getCache(cacheKey.join())
    if(cacheValue) {
        return cacheValue
    }
    searchText = searchText ? searchText : 'restaurants';
    let uri = `https://api.yelp.com/v3/businesses/search?term=${searchText}&longitude=${lon}&latitude=${lat}&limit=${limit}&offset=${offset}&price=${price}&open_now=${open_now}&sort_by=${sort_by}&attributes=${attributes}`
    let request = new Request(uri, { headers : HeaderFactory.getHeaders('yelp')})
    let response = await fetch(request);
    let resData = await response.json();
    let data = resData.businesses
    console.log(uri)
    console.log(`await Request.Get(Yelp, with lon: ${lon}  and lat : ${lat} ) :1: ` + resData);
    APICache.addToCache(cacheKey, data)
    return data;
}

searchFoodFromInput = async(txt, lat, lon) => {
    let uri = `https://api.yelp.com/v3/autocomplete?longitude=${lon}&latitude=${lat}&text=${txt}`;
    let request = new Request(uri, { headers : HeaderFactory.getHeaders('yelp')})
    let response = await fetch(request);
    let resData = await response.json();
    return resData;
}

 
searchEvent = async (lat, lon, size = 10, page = 0 , segments  = []) =>{
    cacheKey = ['searchEvent',lat,lon,size,page,segments.join(',')]
    cacheValue = APICache.getCache(cacheKey.join())
    if(cacheValue) {
        return cacheValue
    }
    uri = `https://app.ticketmaster.com/discovery/v2/events.json?size=${size}&page=${page}&apikey=hDU5HOiwiIeI4WGkTABAb4DYxxXylJva&geoPoint=${lat},${lon}&&sort=distance,asc`
    if (segments.length != 0 )
    {
        segments = segments.map( (item, idx) => {
            switch(item.toLowerCase()){
                case 'arts & theater' : return 'KZFzniwnSyZfZ7v7na'
                case 'music' : return 'KZFzniwnSyZfZ7v7nJ'
                case 'sports' : return 'KZFzniwnSyZfZ7v7nE'
                case 'miscellaneous' : return 'KZFzniwnSyZfZ7v7n1'
                case 'film' : return 'KZFzniwnSyZfZ7v7nn'
                default : return 'KZFzniwnSyZfZ7v7nJ'
            }
        })

        uri = uri + '&segmentId=' + segments.join(',')

    }
    request = new Request(uri, { headers : HeaderFactory.getHeaders('ticketMaster')})
    let response = await fetch(request);
    let resData = await response.json();
    let data = resData._embedded.events
    console.log(`await Request.Get(ticketMaster, with lon: ${lon}  and lat : ${lat} ) :1: ` + resData);
    APICache.addToCache(cacheKey, data)
    return data;


}

export const ThirdPartyAPI = {
    yelp: {
        searchFoodFromInput,
        searchFood
    }, 
    ticketMaster: {
        searchEvent
    }

}