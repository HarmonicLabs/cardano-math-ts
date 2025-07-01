import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divRoundCeil } from "./divRoundCeil";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { EPSILON } from "./EPSILON";
import { ipow } from "./ipow";
import { mpExpTaylor } from "./mpExpTaylor";

const ONE = DIV_DEFAULT_PRECISION;

export function ref_exp(
    rop: bigint,
    x: bigint
): [ result: bigint, iterations: number ] {
    let iterations = 0;
    if (x === BigInt(0)) {
        // rop = 1
        rop = ONE;
    } else if (x < BigInt(0)) {
        const x_ = -x;
        let temp = BigInt(0);
        [ temp, iterations ] = ref_exp(temp, x_);
        rop = divWithDefaultPrecision( ONE, temp );
    } else {
        const n_exponent = divRoundCeil(x, DIV_DEFAULT_PRECISION);
        const x_ = x / n_exponent;
        [ rop, iterations ] = mpExpTaylor(rop, 1000, x_, EPSILON);

        // rop = rop.pow(n)
        rop = ipow( rop, n_exponent )
    }

    return [ rop, iterations ];
}