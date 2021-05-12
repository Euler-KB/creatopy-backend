exports.generatePasswordCode = (length = 4) => {

    let parts = [];
    for(let i = 0 ; i < length ; i++){
        parts.push( Math.round( Math.random() * 9 ) )
    }

    return parts.join('');
}
