import { EPSILON, ipow, ref_exp } from "./ref_exp";
import { _0n, _10n, _1n, abs, DIV_DEFAULT_PRECISION, divWithDefaultPrecision, scale } from "./utils/bigints";

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
export function ref_ln(
    rop: bigint,
    x: bigint
): bigint | undefined {
    if (x <= _0n) {
        return undefined; // Return undefined for values outside the domain
    }

    let factor = _0n;
    let x_ = _0n;

    const n = find_e(x);

    rop = n * DIV_DEFAULT_PRECISION;
    [ factor ]= ref_exp(factor, rop);

    x_ = divWithDefaultPrecision(x, factor);

    x_--;

    const x_2 = x_;
    x_ = mp_ln_n( 1000, x_2, EPSILON );

    rop += x_;

    return rop;
}

const [ E ] = ref_exp( _0n, _1n );
/*
fn find_e(x: &IBig) -> i64 {
    let mut x_: IBig = IBig::from(0);
    let mut x__: IBig = E.value.clone();

    div(&mut x_, &ONE.value, &E.value);

    let mut l = -1;
    let mut u = 1;
    while &x_ > x || &x__ < x {
        x_ = &x_ * &x_;
        scale(&mut x_);

        x__ = &x__ * &x__;
        scale(&mut x__);

        l *= 2;
        u *= 2;
    }

    while l + 1 != u {
        let mid = l + ((u - l) / 2);

        ipow(&mut x_, &E.value, mid);
        if x < &x_ {
            u = mid;
        } else {
            l = mid;
        }
    }
    l
}
*/
function find_e(x: bigint): bigint {
    let x_ = _0n;
    let x__ = E;

    x_ = divWithDefaultPrecision(_1n, E);

    let l = -1;
    let u = 1;
    while (x_ > x || x__ < x) {
        x_ = scale(x_ * x_);

        x__ = scale(x__ * x__);

        l *= 2;
        u *= 2;
    }

    while( l + 1 !== u ) {
        const mid = l + ((u - l) >> 1);

        x_ = ipow( E, BigInt(mid) );
        if( x < x_ ) {
            u = mid;
        } else {
            l = mid;
        }
    }

    return BigInt(l);
}

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
function mp_ln_n(
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
    let convergent = _0n;
    let last = _0n;
    let first = true;
    let n = 1;

    let a: bigint;
    let b = _1n;

    let an_m2 = _1n;
    let bn_m2 = _0n;
    let an_m1 = _0n;
    let bn_m1 = _1n;

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

        b++;
    }

    return convergent;
}