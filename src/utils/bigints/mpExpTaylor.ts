import { abs } from "./abs";
import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { scale } from "./scale";

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
const ONE = DIV_DEFAULT_PRECISION;
export function mpExpTaylor(
    rop: bigint,
    max_n: number,
    x: bigint,
    epsilon: bigint
): [ result: bigint, iterations: number ] {
    let divisor = ONE;
    let last_x = ONE;
    rop = ONE;
    let n = 0;
    while( n < max_n ) {
        let next_x = x * last_x;
        next_x = scale( next_x );
        const next_x2 = next_x;
        next_x = divWithDefaultPrecision( next_x2, divisor );

        if( abs( next_x ) < abs( epsilon )) {
            break;
        }

        divisor += ONE;
        rop += next_x;
        last_x = next_x;
        n++;
    }

    return [ rop, n ];
}