// import fetch from 'node-fetch';  // not support in react-native now

const POST = (url, body) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        // timeout: 3000
    });
}

export default {
    Post: POST
}



// default timeout is 5s
// function _fetch(url, body, timeout = 5000) {
//     let abort_fn = null;
//
//     let abort_promise = new Promise(function(resolve, reject) {
//
//         abort_fn = function() {
//                 reject(
//                     new Error({
//                         "response": "Response Timedout",
//                         "InteractionContextID": "0b6bbc5b-bb9a-4eab-b239-5b1673867edf"
//                     }))
//         };
//     });
//
//     let abortable_promise = Promise.race([
//         fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(body)
//         }),
//         abort_promise
//     ]);
//
//     setTimeout(function() {
//         abort_fn();
//     }, timeout);
//
//     return abortable_promise;
// }
//
//
//
// export default {
//     Post: _fetch
// }

