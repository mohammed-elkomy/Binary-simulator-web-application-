/**
 * Created by mohammed on 27/04/16.
 */

var divUnit = require('./../model/divUnit');
var mulUnit = require('./../model/mulUnit');
var addUnit = require('./../model/addUnit');
var utilUnit = require('./../model/utilUnit');

module.exports = {
    Subtraction:addUnit.Subtraction,
    Addition:addUnit.Addition,
    toBitString32 :utilUnit.toBitString32,
    NormalMultplication:mulUnit.normalMultplication,
    BoothMultplication:mulUnit.BoothMultplication,
    BitPairMultplication:mulUnit.BitPairMultplication,

    RestoringDivision32Bit:divUnit.RestoringDivision32Bit,
    NonRestoringDivision32Bit:divUnit.NonRestoringDivision32Bit,
    flagsF :utilUnit.flagsF
};

