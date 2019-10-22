module.exports.capitalizeFirstLetter = function(str){
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1); 
}

module.exports.convertStringToUrlFriendly = function(str){
    return str.toLowerCase().split(" ").join("_");
}

module.exports.convertUrlIdToTitleString = function(str){
    let originalString = str.split("_").join(" ")
    return module.exports.capitalizeFirstLetter(originalString);
}

 