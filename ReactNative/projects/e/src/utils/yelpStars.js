import small_1 from '../assets/yelp/small/small_1.png'
import small_0 from '../assets/yelp/small/small_0.png'
import small_1_half from '../assets/yelp/small/small_1_half.png'
import small_2 from '../assets/yelp/small/small_2.png'
import small_2_half from '../assets/yelp/small/small_2_half.png'
import small_3 from '../assets/yelp/small/small_3.png'
import small_3_half from '../assets/yelp/small/small_3_half.png'
import small_4 from '../assets/yelp/small/small_4.png'
import small_4_half from '../assets/yelp/small/small_4_half.png'
import small_5 from '../assets/yelp/small/small_5.png'



export const starsUtil = {

    getStars(rate){
        switch (rate){
            case 0: return small_0
            case 1: return small_1
            case 1.5 : return small_1_half
            case 2: return small_2
            case 2.5: return small_2_half
            case 3: return small_3
            case 3.5: return small_3_half
            case 4: return small_4
            case 4.5: return small_4_half
            case 5: return small_5
            default: return small_0
        }  
    }
,
    getDistance(m) {
         
        var mi = Number(m) * 0.000621371
       
            return Number(mi).toFixed(2) + ' mi'
    

    }
    ,
    getDistanceMiles(m) {
        return this.getDistance( m * 1609.344)
    },
    getRandomN(n){
        return Math.floor(Math.random() * 10)
    }
}
