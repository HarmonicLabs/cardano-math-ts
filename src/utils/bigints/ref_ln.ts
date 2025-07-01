import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { EPSILON } from "./EPSILON";
import { find_e } from "./find_e";
import { mp_ln_n } from "./mp_ln_n";
import { ref_exp } from "./ref_exp";

/*
/// Entry point for 'ln' approximation. First does the necessary scaling, and
/// then calls the continued fraction calculation. For any value outside the
/// domain, i.e., 'x in (-inf,0]', the function returns '-INFINITY'.
fn ref_ln(rop: &mut IBig, x: &IBig) -> bool {
    let mut factor = IBig::from(0);
    let mut x_ = IBig::from(0);
    if x <= &ZERO.value {
        return false;
    }

    let n = find_e(x);

    *rop = IBig::from(n);
    *rop = &*rop * &PRECISION.value;
    ref_exp(&mut factor, rop);

    div(&mut x_, x, &factor);

    x_ = &x_ - &ONE.value;

    let x_2 = x_.clone();
    mp_ln_n(&mut x_, 1000, &x_2, &EPS.value);
    *rop = &*rop + &x_;

    true
}
*/
const ONE = DIV_DEFAULT_PRECISION;
export function ref_ln(
    rop: bigint,
    x: bigint
): bigint | undefined {
    if (x <= BigInt(0)) {
        return undefined; // Return undefined for values outside the domain
    }

    let factor = BigInt(0);
    let x_ = BigInt(0);

    const n = find_e(x);

    rop = n * DIV_DEFAULT_PRECISION;
    [ factor ]= ref_exp(factor, rop);

    x_ = divWithDefaultPrecision(x, factor);

    x_ -= ONE;

    const x_2 = x_;
    x_ = mp_ln_n( 1000, x_2, EPSILON );

    rop += x_;

    return rop;
}