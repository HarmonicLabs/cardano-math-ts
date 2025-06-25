import { _0n, _10n, _1n, _2n, abs, DIV_DEFAULT_PRECISION, divWithDefaultPrecision, scale } from "./utils/bigints";

/*
/// Entry point for 'exp' approximation. First does the scaling of 'x' to [0,1]
/// and then calls the continued fraction approximation function.
fn ref_exp(rop: &mut IBig, x: &IBig) -> i32 {
    let mut iterations = 0;
    match x.cmp(&ZERO.value) {
        Ordering::Equal => {
            // rop = 1
            rop.clone_from(&ONE.value);
        }
        Ordering::Less => {
            let x_ = -x;
            let mut temp = IBig::from(0);
            iterations = ref_exp(&mut temp, &x_);
            // rop = 1 / temp
            div(rop, &ONE.value, &temp);
        }
        Ordering::Greater => {
            let n_exponent = div_round_ceil(x, &PRECISION.value);
            let x_ = x / &n_exponent;
            iterations = mp_exp_taylor(rop, 1000, &x_, &EPS.value);

            // rop = rop.pow(n)
            let n_exponent_i64: i64 = i64::try_from(&n_exponent).expect("n_exponent to_i64 failed");
            ipow(rop, &rop.clone(), n_exponent_i64);
        }
    }

    iterations
}
*/
export const EPSILON = ipow( _10n, _10n );
export function ref_exp(
    rop: bigint,
    x: bigint
): [ result: bigint, iterations: number ] {
    let iterations = 0;
    if (x === _0n) {
        // rop = 1
        rop = _1n;
    } else if (x < _0n) {
        const x_ = -x;
        let temp = _0n;
        [ temp, iterations ] = ref_exp(temp, x_);
        rop = _1n / temp;
    } else {
        const n_exponent = divRoundCeil(x, DIV_DEFAULT_PRECISION);
        const x_ = x / n_exponent;
        [ rop, iterations ] = mpExpTaylor(rop, 1000, x_, EPSILON);

        // rop = rop.pow(n)
        rop = ipow( rop, n_exponent )
    }

    return [ rop, iterations ];
}

/*
fn div_round_ceil(x: &IBig, y: &IBig) -> IBig {
    let (q, r) = x.div_rem(y);
    if q.sign() == Sign::Positive && r != IBig::ZERO {
        q + IBig::ONE
    } else {
        q
    }
}
*/
export function divRoundCeil(
    a: bigint,
    b: bigint
): bigint {
    let [ q, r ] = [ a / b, a % b ];
    if (q > _0n && r !== _0n) {
        q += _1n;
    }
    return q;
}

/*
/// Taylor / MacLaurin series approximation
fn mp_exp_taylor(rop: &mut IBig, max_n: i32, x: &IBig, epsilon: &IBig) -> i32 {
    let mut divisor = ONE.value.clone();
    let mut last_x = ONE.value.clone();
    rop.clone_from(&ONE.value);
    let mut n = 0;
    while n < max_n {
        let mut next_x = x * &last_x;
        scale(&mut next_x);
        let next_x2 = next_x.clone();
        div(&mut next_x, &next_x2, &divisor);

        if (&next_x).abs() < epsilon.abs() {
            break;
        }

        divisor += &ONE.value;
        *rop = &*rop + &next_x;
        last_x.clone_from(&next_x);
        n += 1;
    }

    n
}
*/
export function mpExpTaylor(
    rop: bigint,
    max_n: number,
    x: bigint,
    epsilon: bigint
): [ result: bigint, iterations: number ] {
    let divisor = _1n;
    let last_x = _1n;
    rop = _1n;
    let n = 0;
    while( n < max_n ) {
        let next_x = x * last_x;
        next_x = scale( next_x );
        const next_x2 = next_x;
        next_x = divWithDefaultPrecision( next_x2, divisor );

        if( abs( next_x ) < abs( epsilon )) {
            break;
        }

        divisor++;
        rop += next_x;
        last_x = next_x;
        n++;
    }

    return [ rop, n ];
}

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
export function ipow(
    x: bigint,
    n: bigint
): bigint {
    if( n < _0n ) {
        return divWithDefaultPrecision( _1n, ipow_( x, -n ) );
    } else {
        return ipow_(x, n);
    }
}

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
export function ipow_(
    x: bigint,
    n: bigint
): bigint {
    if( n === _0n ) {
        return _1n;
    } else if( n % _2n === _0n ) {
        const res = ipow_( x, n / _2n );
        return scale( res * res );
    } else {
        const res = ipow_( x, n - _1n );
        return scale( res * x );
    }
}
