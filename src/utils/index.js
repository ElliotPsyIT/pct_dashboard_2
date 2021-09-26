import { SortController } from "ag-grid";


export function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export function delimitNumbers(str) {
  return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
    return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
  })
}

export function totalAndPercent(arr) {
  let group = arr.length != 0 ? addCommas(+arr[0].totalNum) : 0
  let percent = arr.length != 0 ? arr[0].PercentageCPT : 0
  return { 'total' : group, 'percent' : percent}
}

export function totalAndPercent2(filteredArray) {
  // what is comingin
  // console.log('in totalAndPercent2 filteredArray is: ', filteredArray)

  // helper to sum total and percents for regex matches
  const arrSum = arr => arr.reduce((a,b) => a + +b, 0)

  // compute sum
  let sums = filteredArray.map(a => a.totalNum )
  let sumTotal = arrSum(sums)

  // compute percentage
  let percents = filteredArray.map(a => a.PercentageCPT )
  let percentTotal = arrSum(percents)
  // console.log('arrSum for percentTotal is: ', percentTotal)

  // create return object with total and percent
  let Obj = { 'total' : sumTotal.toString(), 'percent' : parseFloat(percentTotal).toFixed(1).toString()}
  // console.log('totalAndPercent2 returns Obj: ', Obj)
  return Obj
}

export function arrayEmpty(arr) {
  return arr.length == 0 ? true : false 
}

// helper for rounding to decimals
export function precise_round(num, dec){
  if (isNaN(num)) num = 0;
  if (isNaN(dec)) dec = 0;
  if ((typeof num !== 'number') || (typeof dec !== 'number')) 
    return false 
  var num_sign = num >= 0 ? 1 : -1
  return (Math.round((num*Math.pow(10,dec))+(num_sign*0.0001))/Math.pow(10,dec)).toFixed(dec)
}

export const apiConfig = { path : 'pct.cgi' }

export function isSelectedDateRangeWhiteListed(range){
  // white list dateRanges to prevent huge data size requests
      // (disallow > 3 month pulls)
      // console.log('in isSelectedDateRangeWhiteListed, range is: ', range)
      let dateRangeAllowed = ['oneweek','onemonth','threemonths']
      let whitelist = dateRangeAllowed.includes(range)
      // console.log('whitelist range? ', whitelist)
      return whitelist

}

