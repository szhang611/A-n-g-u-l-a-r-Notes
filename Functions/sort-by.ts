
// array sort by

SortBy (name) { 
    return function(o, p){
    let a, b;
    if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
        return 0;
        }
        if (typeof a === typeof b) {
        return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
    }
    else {
        throw ("error");
    }
    }
}
