import { BigDecimal } from "../BigDecimal"

// https://github.com/txpipe/pallas/blob/8290c67ff3b2d6c61d11bf81cfffc31e871078e6/pallas-math/src/math.rs#L96
describe("tests from the rust implementation", () => {

    test("fixed precision", () => {
        const fp = BigDecimal.fromPrecision( 34 );
        
        expect( fp.precision ).toBe( 34n );
        expect( fp.toString() ).toBe("0");
    });

    test("fromString", () => {

        let fp = BigDecimal.fromString(
            "1234567890123456789012345678901234",
            34n
        );

        expect( fp.precision ).toBe( 34n );
        expect( fp.toString() ).toBe("0.1234567890123456789012345678901234");
        
        fp = BigDecimal.fromString(
            "-1234567890123456789012345678901234",
            30n
        );

        expect( fp.precision ).toBe( 30n );
        expect( fp.toString() ).toBe("-1234.567890123456789012345678901234");

        fp = BigDecimal.fromString(
            "-1234567890123456789012345678901234",
            34n
        );

        expect( fp.precision ).toBe( 34n );
        expect( fp.toString() ).toBe("-0.1234567890123456789012345678901234");
    });

    test("exp", () => {

        const fp = BigDecimal.from( 1 );

        expect( fp.toString() ).toEqual("1");
        const fp_exp = fp.exp();

        // pure
        expect( fp.toString() ).toEqual("1");
        expect( fp_exp.toString() ).toEqual(
            "2.7182818284590452353602874043083282"
        );
    })

    test("fixed precision mul", () => {

        const fp1 = BigDecimal.fromString(
            "52500000000000000000000000000000000",
            34
        );
        const fp2 = BigDecimal.fromString(
            "43000000000000000000000000000000000",
            34
        );

        const fp3 = fp1.mul( fp2 );
        expect( fp3.toString() ).toEqual(
            "22.575"
        )

        const fp4 = fp1.mul( fp2 );
        expect( fp4.toString() ).toEqual(
            "22.575"
        );
    });
})