import demoConfig from './demos-config.json'

export const getDemoConfigWithId = (id) => {
    const configs = demoConfig.filter(config => config.id === id);
    return configs.length > 0 ? configs[0] : null;
}

 
export const numberWithCommas = (x)  =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  // Warn if overriding existing method
  if(Array.prototype.equals)
  {
      console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  }
  
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
        return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;
  
    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, "equals", {enumerable: false});
  
  