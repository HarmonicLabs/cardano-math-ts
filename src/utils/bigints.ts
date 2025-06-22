
export const _0n = BigInt(0);
export const _1n = BigInt(1);
export const _2n = BigInt(2);
export const _10n = BigInt(10);
export const _34n = BigInt(34);

/**
 * we could just do `base ** exp` but we don't have this luxury targeting ES5
 */
export function _slowBigintPositiveExp( base: bigint, exp: bigint ): bigint
{
    if( exp < _0n ) {
        throw new Error("Exponent must be a non-negative bigint");
    }
    while( exp > _1n ) {
        base *= base;
        exp -= _1n;
    }
    return base;
}

export function abs( value: bigint ): bigint
{
    return value < _0n ? -value : value;
}

export function divWithPrecision(
    numerator: bigint,
    denominator: bigint,
    precision_multiplier: bigint
): bigint
{
    return (numerator * precision_multiplier) / denominator;
}