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
    if (q > BigInt(0) && r !== BigInt(0)) {
        q += BigInt(1);
    }
    return q;
}