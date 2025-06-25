import { ipow } from "../ref_exp";

export const _0n = BigInt(0);
export const _1n = BigInt(1);
export const _2n = BigInt(2);
export const _10n = BigInt(10);
export const _34n = BigInt(34);

export function abs( value: bigint ): bigint
{
    return value < _0n ? -value : value;
}

/*
export function divWithPrecision(
    numerator: bigint,
    denominator: bigint,
    precision_multiplier: bigint
): bigint
{
    return (numerator * precision_multiplier) / denominator;
}
//*/

export const DIV_DEFAULT_PRECISION = ipow( _10n, _34n );

export function div_qr(
    x: bigint,
    y: bigint
): [ quotient: bigint, remainder: bigint ]
{
    return [ x / y, x % y ];
}

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

export function scale( rop: bigint ): bigint
{
    let [ a, tmp ] = div_qr( rop, DIV_DEFAULT_PRECISION );
    if( rop < _0n && tmp !== _0n ) {
        a -= _1n;
    }
    return a;
}