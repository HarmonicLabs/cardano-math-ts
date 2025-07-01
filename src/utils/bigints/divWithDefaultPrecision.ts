import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { div_qr } from "./div_qr";

// https://github.com/txpipe/pallas/blob/a97bd93cdc55fa2b061a6ad5fd572f5528a912b8/pallas-math/src/math_dashu.rs#L499
export function divWithDefaultPrecision(
    x: bigint,
    y: bigint
): bigint
{
    let tmp_quotient: bigint;
    let tmp_remainder: bigint;
    let tmp: bigint;
    [ tmp_quotient, tmp_remainder ] = div_qr( x, y );

    tmp = tmp_quotient * DIV_DEFAULT_PRECISION;
    tmp_remainder *= DIV_DEFAULT_PRECISION;
    [ tmp_quotient, tmp_remainder ] = div_qr( tmp_remainder, y );

    tmp += tmp_quotient;
    return tmp;
}