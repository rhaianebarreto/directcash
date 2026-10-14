// Only identify explicit provider quota messages; never expose raw database errors.
export function platformError(error:unknown):{error:string;code:string}|null{
 const parts:string[]=[];let current:unknown=error;
 for(let i=0;i<4&&current instanceof Error;i++){parts.push(current.message);current=current.cause;}
 const message=parts.join(' ');
 if(/exceeded D1.*free tier daily row (read|write) limit/i.test(message))return {code:'D1_DAILY_LIMIT',error:'A cota diária do banco na Cloudflare foi atingida. Confira D1 → Metrics na sua conta. Aguarde a renovação da cota ou avalie o plano Workers Paid. Reinstalar não resolve este limite.'};
 return null;
}
