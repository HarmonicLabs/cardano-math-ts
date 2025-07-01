export function div_qr(
    x: bigint,
    y: bigint
): [ quotient: bigint, remainder: bigint ]
{
    return [ 
        BigInt(x) / BigInt(y),
        BigInt(x) % BigInt(y)
    ];
}