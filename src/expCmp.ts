import { BigDecimal, IBigDecimal } from "./BigDecimal";
import { abs } from "./utils/bigints/abs";
import { DIV_DEFAULT_PRECISION } from "./utils/bigints/DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./utils/bigints/divWithDefaultPrecision";
import { ipow_ } from "./utils/bigints/ipow_";
import { scale } from "./utils/bigints/scale";

export enum ExpOrd {
    GT = 1,
    LT = -1,
    UNKNOWN = NaN,
}
Object.freeze( ExpOrd );

interface ExpCmpOrdering {
    readonly iterations: bigint;
    readonly estimation: ExpOrd;
    readonly approx: BigDecimal;
}

export function expCmp(
    decimal: IBigDecimal,
    max_n: bigint,
    bound_x: bigint,
    compare: IBigDecimal
): ExpCmpOrdering
{
    const output = BigDecimal.fromPrecision( decimal.precision );
    return refExpCmp(
        output.data,
        max_n,
        decimal.data,
        bound_x,
        compare.data
    );
}



const ONE = DIV_DEFAULT_PRECISION;
const EPS_THRESHOLD = ipow_( BigInt(10), BigInt(10) );

/// `bound_x` is the bound for exp in the interval x is chosen from
/// `compare` the value to compare to
///
/// if the result is GT, then the computed value is guaranteed to be greater, if
/// the result is LT, the computed value is guaranteed to be less than
/// `compare`. In the case of `UNKNOWN` no conclusion was possible for the
/// selected precision.
///
/// Lagrange remainder require knowledge of the maximum value to compute the
/// maximal error of the remainder.
export function refExpCmp(
    rop: bigint,
    max_n: bigint,
    x: bigint,
    bound_x: bigint,
    compare: bigint
): ExpCmpOrdering
{
    // const precision = BigInt( 34 );
    // const precision_multiplier = ipow_( BigInt(10), precision );
    
    rop = ONE;
    let n = BigInt(0);
    let divisor: bigint = ONE;
    let next_x: bigint;
    let error: bigint = x;
    let upper: bigint;
    let lower: bigint;
    let error_term: bigint;

    let estimate = ExpOrd.UNKNOWN;
    
    while( n < max_n )
    {
        next_x = error;
        
        // Check if error is below epsilon threshold
        if( abs( next_x ) < abs( EPS_THRESHOLD ) ) {
            break;
        }
        
        divisor += ONE;

        // Update error estimation: bound_x * x^(n+1)/(n + 1)!
        // error stores the x^n part
        error = scale( error * x );
        error = divWithDefaultPrecision( error, divisor );
        error_term = (error * bound_x);

        rop = rop + next_x;
        
        // Compare is guaranteed to be above overall result
        upper = rop + error_term;
        if( compare > upper ) {
            estimate = ExpOrd.GT;
            n += BigInt(1);
            break;
        }

        // Compare is guaranteed to be below overall result
        lower = rop - error_term;
        if( compare < lower ) {
            estimate = ExpOrd.LT;
            n += BigInt(1);
            break;
        }
        
        n++;
    }

    const approx = BigDecimal.fromPrecision(); // DEFAULT_PRECISION
    approx.data = rop;

    return {
        iterations: n,
        estimation: estimate,
        approx
    };
}