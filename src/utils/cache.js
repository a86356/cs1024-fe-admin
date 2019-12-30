export const setCacheData= params =>{
  var storage=window.localStorage;

  storage.setItem(params.k,params.v)
}

export const getCacheData=key=> {
  return window.localStorage.getItem(key);
}

export const clearCacheData=arrkeys=> {
  var storage=window.localStorage;

  for (let i = 0; i < arrkeys.length; i++) {
    storage.removeItem(arrkeys[i]);
  }
}
