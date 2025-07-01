import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { ipow_ } from "./ipow_";

/*
/// Integer power
fn ipow(rop: &mut IBig, x: &IBig, n: i64) {
    if n < 0 {
        let mut temp = IBig::from(0);
        ipow_(&mut temp, x, -n);
        div(rop, &ONE.value, &temp);
    } else {
        ipow_(rop, x, n);
    }
}
*/
const ONE = DIV_DEFAULT_PRECISION;
export function ipow(
    x: bigint,
    n: bigint
): bigint {
    if( n < BigInt(0) ) {
        return divWithDefaultPrecision( ONE, ipow_( x, -n ) );
    } else {
        return ipow_(x, n);
    }
}