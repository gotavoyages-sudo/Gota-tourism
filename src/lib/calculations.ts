export type ServiceCalc = {
  supplierCost?: number | null;
  sellingRate?: number | null;
  finalSellingPrice?: number | null;
  quantity: number;
  pricingBasis?: string;
  includedInPackage?: boolean;
  costCovered?: boolean;
  estimatedCost?: number | null;
  actualCost?: number | null;
  estimatedRevenue?: number | null;
  actualRevenue?: number | null;
  classification?: string;
};

export function serviceRevenue(s: ServiceCalc){
  if(s.costCovered || s.includedInPackage) return 0; // prevent double count
  if(s.finalSellingPrice !=null && s.finalSellingPrice !== undefined) return Number(s.finalSellingPrice) * s.quantity;
  if(s.estimatedRevenue !=null) return Number(s.estimatedRevenue);
  if(s.sellingRate !=null) return Number(s.sellingRate) * s.quantity;
  return 0;
}
export function serviceCost(s: ServiceCalc){
  if(s.costCovered) return 0;
  if(s.actualCost !=null) return Number(s.actualCost);
  if(s.estimatedCost !=null) return Number(s.estimatedCost);
  if(s.supplierCost !=null) return Number(s.supplierCost) * s.quantity;
  return 0;
}
export function serviceProfit(s: ServiceCalc){
  return serviceRevenue(s) - serviceCost(s);
}

export function calculateTripFinancials(services: ServiceCalc[], accommodations: any[], payments: any[], extraCharges=0, discount=0){
  let estimatedRevenue = 0;
  let estimatedCost = 0;
  let actualRevenue = 0;
  let actualCost = 0;
  let incomplete=false;

  for(const s of services){
    estimatedRevenue += serviceRevenue(s);
    estimatedCost += s.estimatedCost !=null ? Number(s.estimatedCost) : (s.supplierCost ? Number(s.supplierCost)*s.quantity : 0);
    actualRevenue += s.actualRevenue !=null ? Number(s.actualRevenue) : serviceRevenue(s);
    // actual cost uses actualCost if present else estimated
    let ac = s.actualCost !=null ? Number(s.actualCost) : (s.estimatedCost !=null ? Number(s.estimatedCost) : (s.supplierCost ? Number(s.supplierCost)*s.quantity : 0));
    actualCost += ac;
    if(s.supplierCost==null && s.estimatedCost==null && !s.costCovered) incomplete=true;
  }
  for(const a of accommodations){
    const nights = Number(a.nights||1);
    const rooms = Number(a.rooms||1);
    const selling = a.sellingRate ? Number(a.sellingRate)*nights*rooms : 0;
    const cost = a.supplierCost ? Number(a.supplierCost)*nights*rooms : 0;
    estimatedRevenue += selling;
    estimatedCost += cost;
    actualRevenue += selling;
    actualCost += a.actualCost ? Number(a.actualCost) : cost;
    if(!a.sellingRate || !a.supplierCost) incomplete=true;
  }

  const totalBeforeDiscount = estimatedRevenue;
  const finalPayable = totalBeforeDiscount - discount + extraCharges;
  const estimatedNet = estimatedRevenue - estimatedCost;
  const actualNet = actualRevenue - actualCost;

  const paid = payments.filter(p=>p.payerType==='client' && p.status==='confirmed').reduce((sum:any,p:any)=>sum+Number(p.amount||0),0);
  const outstanding = finalPayable - paid;

  return { estimatedRevenue, estimatedCost, actualRevenue, actualCost, totalBeforeDiscount, finalPayable, estimatedNet, actualNet, paid, outstanding, incomplete };
}

export function calculateBreakfast(accommodations:any[]){
  let included=0, extra=0, extraCost=0;
  for(const a of accommodations){
    const nights = Number(a.nights||1);
    const rooms = Number(a.rooms||1);
    included += (Number(a.breakfastIncludedQty||0))*nights*rooms;
    extra += Number(a.extraBreakfastQty||0);
    extraCost += Number(a.extraBreakfastQty||0) * Number(a.extraBreakfastPrice||0);
  }
  return { included, extra, extraCost };
}
