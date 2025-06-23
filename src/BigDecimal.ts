import { isObject } from "@harmoniclabs/obj-utils";
import { _0n, _10n, _2n, _slowBigintPositiveExp, abs, divWithDefaultPrecision, scale } from "./utils/bigints";
import { ref_ln } from "./ref_ln";

export interface IBigDecimal {
    precision: bigint;
    precision_multiplier: bigint;
    data: bigint;
}

export function isIBigDecimal( stuff: any ): stuff is IBigDecimal {
    return isObject( stuff ) && (
        typeof stuff.precision === "bigint" &&
        typeof stuff.precision_multiplier === "bigint" &&
        typeof stuff.data === "bigint"
    );
}

const DEFAULT_PRECISION = BigInt( 34 );

// fromString
// division

export class BigDecimal
    implements IBigDecimal
{
    precision: bigint;
    precision_multiplier: bigint;
    data: bigint;

    constructor({
        precision,
        precision_multiplier,
        data
    }: IBigDecimal) {
        this.precision = precision;
        this.precision_multiplier = precision_multiplier;
        this.data = data;
    }

    round(): BigDecimal
    {
        const result = this.clone();
        const half = this.precision_multiplier / _2n;
        const remainder = result.data % result.precision_multiplier;
        if( abs( remainder ) >= half ) {
            if( this.data < _0n ) {
                result.data -= this.precision_multiplier + remainder;
            } else {
                result.data += this.precision_multiplier - remainder;
            }
        } else {
            result.data -= remainder;
        }
        return result;
    }

    static add(
        a: BigDecimal,
        b: BigDecimal
    ): BigDecimal
    {
        const result = BigDecimal.fromPrecision( a.precision );
        result.data = a.data + b.data;
        return result;
    }
    add( rhs: BigDecimal ): BigDecimal
    {
        return BigDecimal.add( this, rhs );
    }

    static sub(
        a: BigDecimal,
        b: BigDecimal
    ): BigDecimal
    {
        const result = BigDecimal.fromPrecision( a.precision );
        result.data = a.data - b.data;
        return result;
    }
    sub( rhs: BigDecimal ): BigDecimal
    {
        return BigDecimal.sub( this, rhs );
    }

    neg(): BigDecimal
    {
        const result = BigDecimal.fromPrecision( this.precision );
        result.data = -this.data;
        return result;
    }

    ln(): BigDecimal
    {
        let ln_x = BigDecimal.fromPrecision( this.precision );
        const result = ref_ln( ln_x.data, this.data );
        if( typeof result !== "bigint" ) throw new Error("ln of a value in (-inf,0] is undefined");
        ln_x.data = result;
        return ln_x;
    }

    static div(
        a: BigDecimal,
        b: BigDecimal
    ): BigDecimal
    {
        const result = BigDecimal.fromPrecision( a.precision );
        result.data = divWithDefaultPrecision( a.data, b.data );
        return result;
    }
    div( rhs: BigDecimal ): BigDecimal
    {
        return BigDecimal.div( this, rhs );
    }

    static mul(
        a: BigDecimal,
        b: BigDecimal
    ): BigDecimal
    {
        const result = BigDecimal.fromPrecision( a.precision );
        result.data = scale(a.data * b.data);
        return result;
    }
    mul( rhs: BigDecimal ): BigDecimal
    {
        return BigDecimal.mul( this, rhs );
    }

    static fromString(
        s: string,
        precision: bigint = DEFAULT_PRECISION
    ): BigDecimal
    {
        // if the string is not a number
        if( !/^-?\d+$/.test( s ) ) throw new Error("Invalid string format for BigDecimal");

        const decimal = BigDecimal.fromPrecision( precision );
        decimal.data = BigInt( s );
        return decimal;
    }

    // https://github.com/txpipe/pallas/blob/a97bd93cdc55fa2b061a6ad5fd572f5528a912b8/pallas-math/src/math_dashu.rs#L290
    static fromPrecision(
        precision: bigint = DEFAULT_PRECISION,
    ): BigDecimal
    {
        if( precision === DEFAULT_PRECISION ) return DEFAULT_BigDecimal.clone();
        return new BigDecimal({
            precision,
            precision_multiplier: _slowBigintPositiveExp( _10n, precision ),
            data: _0n
        });
    }

    static fromBigint( n: bigint ): BigDecimal
    {
        let result = BigDecimal.fromPrecision( DEFAULT_PRECISION );
        result.data = n * result.precision_multiplier;
        return result;
    }

    clone(): BigDecimal {
        return new BigDecimal({
            precision: this.precision,
            precision_multiplier: this.precision_multiplier,
            data: this.data
        });
    }
}

const DEFAULT_BigDecimal: BigDecimal = new BigDecimal({
    precision: DEFAULT_PRECISION,
    precision_multiplier: _slowBigintPositiveExp( _10n, DEFAULT_PRECISION ),
    data: _0n
});