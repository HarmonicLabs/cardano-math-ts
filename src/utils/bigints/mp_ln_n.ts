import { abs } from "./abs";
import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { scale } from "./scale";

/*
/// Compute an approximation of 'ln(1 + x)' via continued fractions. Either for a
///    maximum of 'maxN' iterations or until the absolute difference between two
///    succeeding convergents is smaller than 'eps'. Assumes 'x' to be within
///    [1,e).
fn mp_ln_n(rop: &mut IBig, max_n: i32, x: &IBig, epsilon: &IBig) {
    let mut ba: IBig;
    let mut aa: IBig;
    let mut ab: IBig;
    let mut bb: IBig;
    let mut a_: IBig;
    let mut b_: IBig;
    let mut diff: IBig;
    let mut convergent: IBig = IBig::from(0);
    let mut last: IBig = IBig::from(0);
    let mut first = true;
    let mut n = 1;

    let mut a: IBig;
    let mut b = ONE.value.clone();

    let mut an_m2 = ONE.value.clone();
    let mut bn_m2 = IBig::from(0);
    let mut an_m1 = IBig::from(0);
    let mut bn_m1 = ONE.value.clone();

    let mut curr_a = 1;

    while n <= max_n + 2 {
        let curr_a_2 = curr_a * curr_a;
        a = x * IBig::from(curr_a_2);
        if n > 1 && n % 2 == 1 {
            curr_a += 1;
        }

        ba = &b * &an_m1;
        scale(&mut ba);
        aa = &a * &an_m2;
        scale(&mut aa);
        a_ = &ba + &aa;

        bb = &b * &bn_m1;
        scale(&mut bb);
        ab = &a * &bn_m2;
        scale(&mut ab);
        b_ = &bb + &ab;

        div(&mut convergent, &a_, &b_);

        if first {
            first = false;
        } else {
            diff = &convergent - &last;
            if diff.abs() < epsilon.abs() {
                break;
            }
        }

        last.clone_from(&convergent);

        n += 1;
        an_m2.clone_from(&an_m1);
        bn_m2.clone_from(&bn_m1);
        an_m1.clone_from(&a_);
        bn_m1.clone_from(&b_);

        b += &ONE.value;
    }

    *rop = convergent;
}
*/
const ONE = DIV_DEFAULT_PRECISION;
export function mp_ln_n(
    max_n: number,
    x: bigint,
    epsilon: bigint
): bigint {
    let ba: bigint;
    let aa: bigint;
    let ab: bigint;
    let bb: bigint;
    let a_: bigint;
    let b_: bigint;
    let diff: bigint;
    let convergent = BigInt(0);
    let last = BigInt(0);
    let first = true;
    let n = 1;

    let a: bigint;
    let b = ONE;

    let an_m2 = ONE;
    let bn_m2 = BigInt(0);
    let an_m1 = BigInt(0);
    let bn_m1 = ONE;

    let curr_a = 1;

    while( n <= max_n + 2 ) {
        const curr_a_2 = curr_a * curr_a;
        a = x * BigInt(curr_a_2);
        if (n > 1 && n % 2 === 1) {
            curr_a += 1;
        }

        ba = scale(b * an_m1);
        aa = scale(a * an_m2);
        a_ = ba + aa;

        bb = scale(b * bn_m1);
        ab = scale(a * bn_m2);
        b_ = bb + ab;

        convergent = divWithDefaultPrecision(a_, b_);

        if (first) {
            first = false;
        } else {
            diff = convergent - last;
            if( abs(diff) < abs(epsilon) ) {
                break;
            }
        }

        last = convergent;

        n++;
        an_m2 = an_m1;
        bn_m2 = bn_m1;
        an_m1 = a_;
        bn_m1 = b_;

        b += ONE;
    }

    return convergent;
}