import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { scale } from "./scale";

/*
// Integer power internal function
fn ipow_(rop: &mut IBig, x: &IBig, n: i64) {
    if n == 0 {
        rop.clone_from(&ONE.value);
    } else if n % 2 == 0 {
        let mut res = IBig::from(0);
        ipow_(&mut res, x, n / 2);
        *rop = &res * &res;
        scale(rop);
    } else {
        let mut res = IBig::from(0);
        ipow_(&mut res, x, n - 1);
        *rop = res * x;
        scale(rop);
    }
}
*/
const ONE = DIV_DEFAULT_PRECISION;
export function ipow_(
    x: bigint,
    n: bigint
): bigint {
    if( n === BigInt(0) ) {
        return DIV_DEFAULT_PRECISION;
    } else if( n % BigInt(2) === BigInt(0) ) {
        const res = ipow_( x, n / BigInt(2) );
        return scale( res * res );
    } else {
        const res = ipow_( x, n - BigInt(1) );
        return scale( res * x );
    }
}