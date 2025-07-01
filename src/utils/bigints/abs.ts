export function abs( value: bigint ): bigint
{
    return value < BigInt(0) ? -value : value;
}