import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { div_qr } from "./div_qr";

export function scale( rop: bigint ): bigint
{
    let [ a, tmp ] = div_qr( rop, DIV_DEFAULT_PRECISION );
    if( rop < BigInt(0) && tmp !== BigInt(0) ) {
        a -= BigInt(1);
    }
    return a;
}