var capitalise = function(string){
    if (!string) return string;
    string = string.replace('/', '');
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = {
  capitalise : capitalise
};