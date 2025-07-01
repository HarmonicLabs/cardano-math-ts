import { DIV_DEFAULT_PRECISION } from "./DIV_DEFAULT_PRECISION";
import { divWithDefaultPrecision } from "./divWithDefaultPrecision";
import { E } from "./E";
import { ipow } from "./ipow";
import { scale } from "./scale";

const ONE = DIV_DEFAULT_PRECISION;
export function find_e(x: bigint): bigint {
    let x_ = BigInt(0);
    let x__ = E;

    x_ = divWithDefaultPrecision( ONE, E );

    let l = -1;
    let u = 1;
    while (x_ > x || x__ < x) {
        x_ = scale(x_ * x_);

        x__ = scale(x__ * x__);

        l *= 2;
        u *= 2;
    }

    while( l + 1 !== u ) {
        const mid = l + ((u - l) >> 1);

        x_ = ipow( E, BigInt(mid) );
        if( x < x_ ) {
            u = mid;
        } else {
            l = mid;
        }
    }

    return BigInt(l);
}