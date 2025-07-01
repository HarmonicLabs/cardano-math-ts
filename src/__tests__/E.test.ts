import { DIV_DEFAULT_PRECISION } from "../utils/bigints/DIV_DEFAULT_PRECISION";
import { ref_exp } from "../utils/bigints/ref_exp"

describe("BigDecimal.fromString", () => {

    test("CERTIFIED_NATURAL_MAX", () => {

        console.log( ref_exp( BigInt(0), DIV_DEFAULT_PRECISION ) );

    });

});