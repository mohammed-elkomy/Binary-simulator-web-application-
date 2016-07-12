var baseUnit = require('./../model/baseUnit');


function invertBit(bit){
    if(bit=='0')
    return '1';
    else return '0';
}


module.exports = {
    OneString32:baseUnit.OneString32,
    ZeroString32:baseUnit.ZeroString32,
    toTwoS_Complemnt:baseUnit.toTwoS_Complemnt,
    toBitString32:baseUnit.toBitString32,
    extendTo64Bit:baseUnit.extendTo64Bit,
    shiftLeft:baseUnit.shiftLeft,
    shiftRight:baseUnit.shiftRight,
    replaceAt:baseUnit.replaceAt,
    flagsF :baseUnit.flagsF,
    invertBit:invertBit,
    toDecimal:baseUnit.toDecimal,
    BitstringFormat:baseUnit.BitstringFormat,
    CalculateRedendandBits:baseUnit.CalculateRedendandBits,
    shortLine:baseUnit.shortLine,
    LINE:baseUnit.LINE,
    GET_REDUNDANT_BITS: baseUnit.GET_REDUNDANT_BITS,
    SET_REDUNDANT_BITS: baseUnit.SET_REDUNDANT_BITS

};