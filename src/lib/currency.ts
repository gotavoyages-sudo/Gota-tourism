export const EXCHANGE_RATE_DEFAULT = 2.5; // 1 FCFA = 2.5 NGN
export function convertFCFAtoNGN(fcfa:number, rate=2.5){ return fcfa * rate; }
export function convertNGNtoFCFA(ngn:number, rate=2.5){ return ngn / rate; }
export function formatFCFA(amount:number){ return new Intl.NumberFormat('en-US').format(Math.round(amount)) + ' FCFA'; }
export function formatNGN(amount:number){ return '₦' + new Intl.NumberFormat('en-US').format(Math.round(amount)); }
export function formatMoney(amount:number, currency:string){
  if(!amount && amount!==0) return '-';
  if(currency==='FCFA') return formatFCFA(amount);
  if(currency==='NGN') return formatNGN(amount);
  return currency + ' ' + new Intl.NumberFormat('en-US').format(Math.round(amount));
}
export function roundNGN(amount:number){ return Math.round(amount/1000)*1000; }
