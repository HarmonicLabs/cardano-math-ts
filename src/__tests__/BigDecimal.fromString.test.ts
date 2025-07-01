import { BigDecimal } from "../BigDecimal";

describe("BigDecimal.fromString", () => {

    test("CERTIFIED_NATURAL_MAX", () => {

        let CERTIFIED_NATURAL_MAX!: BigDecimal;
        expect(()=>{
            CERTIFIED_NATURAL_MAX = BigDecimal.fromString("1157920892373161954235709850086879078532699846656405640394575840079131296399360000000000000000000000000000000000", 34n);
        }).not.toThrow();

    })
});