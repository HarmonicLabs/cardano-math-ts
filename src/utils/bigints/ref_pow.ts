import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { div_qr } from "./div_qr";
import { ref_exp } from "./ref_exp";
import { ref_ln } from "./ref_ln";
import { scale } from "./scale";

const ONE = DIV_DEFAULT_PRECISION;
export function ref_pow(
    base: bigint,
    exponent: bigint,
    rop: bigint | undefined = undefined
): bigint
{
    /* x^y = exp(y * ln x) */
    let tmp: bigint = BigInt(0);

    if (exponent === BigInt(0) || base === ONE) {
        // any base to the power of zero is one, or 1 to any power is 1
        return ONE;
    }
    if (exponent === ONE) {
        // any base to the power of one is the base
        return base;
    }
    if (base === BigInt(0) && exponent < BigInt(0)) {
        // zero to any positive power is zero
        return BigInt(0) * DIV_DEFAULT_PRECISION;
    }
    if (base === BigInt(0) && exponent < BigInt(0)) {
        throw new Error("zero to a negative power is undefined");
    }
    if (base < BigInt(0)) {
        // negate the base and calculate the power
        const neg_base = -base;
        tmp = ref_ln(tmp, neg_base)!;
        if( typeof tmp !== "bigint" ) {
            throw new Error("ln of a negative base is undefined");
        }
        tmp = tmp * exponent;
        tmp = scale( tmp );
        let [ tmp_rop ] = ref_exp( BigInt(0), tmp );
        const [ n_exponent, rem ] = div_qr(exponent / DIV_DEFAULT_PRECISION, BigInt( 2 ));
        // check if rem is even
        return rem === BigInt(0) ? tmp_rop : -tmp_rop;
    } else {
        // base is positive, ref_ln result is valid
        tmp = ref_ln( tmp, base )!;
        if( typeof tmp !== "bigint" ) {
            throw new Error("ln of a positive base is undefined");
        }
        tmp = tmp * exponent;
        tmp = scale(tmp);
        if( typeof rop !== "bigint" ) {
            throw new Error("rop must be a bigint");
        }
        return ref_exp(rop, tmp)[0];
    }
}