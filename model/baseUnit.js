/**
 * Created by mohammed on 13/05/16.
 */

var ZeroString32='00000000000000000000000000000000';
var OneString32= '11111111111111111111111111111111';
var shortLine  = '----------------------------------------- ---------';
var longLine= '---------------------------------------------------------------------------------  -------------';
var LINE='-----------------------------------------'

var PowersOfTwo=[1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824,2147483648,4294967296,8589934592,17179869184,34359738368,68719476736,137438953472,274877906944,549755813888,1099511627776,2199023255552,4398046511104,8796093022208,17592186044416,35184372088832,70368744177664,140737488355328,281474976710656,562949953421312,1125899906842624,2251799813685248,4503599627370496,9007199254740992,18014398509481984,36028797018963970,72057594037927940,144115188075855870,288230376151711740,576460752303423500,1152921504606847000,2305843009213694000,4611686018427388000,9223372036854776000,18446744073709552000];

var REDUNDANT_BITS;



function CalculateRedendandBits(bitstring){
    var length= 0;
    for(var i =0 ; i< bitstring.length  ; i++)
    {
        if(bitstring.charAt(i)=='0'){
            length++;
        }
        else break;
    }
    return length;
}


function removeParenthesis(bitstring){
 return   bitstring.substring(2,bitstring.length-2);
}

function toDecimal(bitstring,Signed){
  if(bitstring.length ==66)bitstring=bitstring.substring(2,bitstring.length)

    var decimal=0;

    if(Signed && bitstring.charAt(0)=='1')
    {
        var val=toTwoS_Complemnt(bitstring);
        decimal=toDecimal(  val     ,false);
        decimal ='-'+removeParenthesis(decimal);

    }
    else

    for(var i =bitstring.length-1 ; i>=0 ; i-- ){

        decimal +=(Number(bitstring.charAt(i)))*PowersOfTwo[(bitstring.length-1-i)];
    }


    return ' ('+decimal+')\n';
}


function BitstringFormat(bitstring) {

    bitstring =(bitstring.substring(  REDUNDANT_BITS ,bitstring .length));


    for (var i = bitstring.length-1; i >0 ; i -= 4){
        bitstring=  replaceAt(bitstring,i,bitstring.charAt(i)+' ');
        }



    if( bitstring.length==83)
        bitstring=bitstring.substring(3,83);



    return bitstring;
}

function fullAdderLogic(x,y,Cin){
    var sum = x ^ y ^ Cin;
    var Cout = (x&y)|(y&Cin)|(x&Cin);
    return {sum :sum,
        carry:Cout}
}

function mltiAdder64Bit(listOfOperands,Signed){
    var ex='';

    if(listOfOperands[0].length !=64)
        ex ='00';

    var tempRes=ex+ZeroString32.concat(ZeroString32); //64bitString of zeros



    for(var i=0 ; i< listOfOperands.length; i++){
        tempRes = addNBits(tempRes, listOfOperands[i],Signed,false/*update flags at the end*/);
    }
    return tempRes ;
}


function addNBits  (operand1,operand2,Signed,IsTWOS_OrDoNotUpdateFlags){
    if(!IsTWOS_OrDoNotUpdateFlags)
        resetFlags();

    var result;

    if(operand1 .length ==32) //normal addition and subtraction (32 bits)
        result=ZeroString32;

    else if (operand1 .length ==64)
        result=ZeroString32.concat(ZeroString32); //signed multiplication (64 bits)
    else if (operand1 .length ==66)
        result=ZeroString32.concat(ZeroString32)+'00';   //unsigned booth (66 bits)
    else
        result=ZeroString32+'0'; //for division (33 bits)


    var tempCarry=0;

    for(var i = operand1.length-1 ; i >-1 ; i--){
        var FullAdderOutput= fullAdderLogic(operand1[i],operand2[i],tempCarry);
        result =replaceAt(result,i,FullAdderOutput.sum);
        if( !IsTWOS_OrDoNotUpdateFlags &&Signed&&(!i)&&(tempCarry^FullAdderOutput.carry) ){ FLAGS.OVERFLOW =true;  }
        tempCarry=FullAdderOutput.carry;
    }

    if(!IsTWOS_OrDoNotUpdateFlags)
         UpdateFlags(result,tempCarry);
    return  result;
}


function sub32Bit(operand1,operand2,Signed){
    return  addNBits  (operand1,  toTwoS_Complemnt(operand2),Signed,false);
}

function multiAddition(listOfOperands,Signed,EXTENDLINE){

    var ex='';

    if(listOfOperands[0].length !=64)
        ex ='00';

    var tempRes=ex+ZeroString32.concat(ZeroString32); //64bitString of zeros


    var outputString ='\n  '+BitstringFormat(listOfOperands[listOfOperands.length-1])+toDecimal(listOfOperands[listOfOperands.length-1],Signed);
    tempRes = addNBits(tempRes, listOfOperands[listOfOperands.length-1],Signed,false/*update flags at the end*/);


    for(var i=listOfOperands.length-2 ; i>=0 ; i--){
        tempRes = addNBits(tempRes, listOfOperands[i],Signed,false/*update flags at the end*/);
        var binary =BitstringFormat(listOfOperands[i]);

        var NoOfSteps=binary.length-listOfOperands.length+i-1;
        for(var j=binary.length-1 ; j>NoOfSteps;j--){
            binary=replaceAt(binary,j,' ');
        }

        outputString += '+ '+binary+toDecimal(listOfOperands[i],Signed) ;
    }

    return  outputString+longLine.substring((5/4)*REDUNDANT_BITS +(EXTENDLINE?-4:0) ,longLine.length)+'\n  '+BitstringFormat( tempRes )+toDecimal(tempRes,Signed);
}

function getRedundantBitsForAddORSub(operand1,operand2,Signed){
    REDUNDANT_BITS= (Signed?-2:0)+Math.min(CalculateRedendandBits(operand1),CalculateRedendandBits(operand2));
}

function Addition  (operand1,operand2,Signed){
    getRedundantBitsForAddORSub(operand1,operand2,Signed);
    var addRes=addNBits(operand1,  operand2,Signed,false);
    var outputString ='\n  '+BitstringFormat(operand1)+toDecimal(operand1,Signed)+'+ '+BitstringFormat(operand2)+toDecimal(operand2,Signed)+'-'+shortLine.substring(5*REDUNDANT_BITS/4+1,shortLine.length)+'\n  '+BitstringFormat( addRes )+toDecimal(addRes,Signed);
    return  outputString;
}



function Subtraction(operand1,operand2,Signed){
    getRedundantBitsForAddORSub(operand1,operand2,Signed);
    var outputString ='\n  '+BitstringFormat(operand1)+toDecimal(operand1,Signed)+'- '+BitstringFormat(operand2)+toDecimal(operand2,Signed)+'-'+shortLine.substring((Signed?-1:0)+5*REDUNDANT_BITS/4+1,shortLine.length)+'  '+Addition(operand1,toTwoS_Complemnt(operand2),Signed);
    return  outputString;
}

function flagsF(){
   return '  V: '+Number(FLAGS.OVERFLOW)+'\tC: '+Number(FLAGS.CARRY)+'\tN: '+Number(FLAGS.NEGATIVE)+'\tZ: '+Number(FLAGS.ZERO)+'\n';

}



var FLAGS ={
    OVERFLOW :false,
    CARRY :false,
    NEGATIVE :false,
    ZERO :false,
}


function  resetFlags() {
    FLAGS = {
        OVERFLOW: false,
        CARRY: false,
        NEGATIVE: false,
        ZERO: false,
    }
}

function  UpdateFlags(Result,Carry) {

    if(Carry) FLAGS.CARRY =true;
    if(Result[0] =='1') FLAGS.NEGATIVE=true;
    if(Result == ZeroString32)  FLAGS.ZERO=true;
}
// replace the nth character of 's' with 't'
function replaceAt(s, n, t) {
    return s.substring(0, n) + t + s.substring(n + 1);
}

function toTwoS_Complemnt (value){

    var ONE;

    if(value .length ==32)
        ONE=ZeroString32.substring(0, 31).concat('1'); //normal addition and subtraction (32 bits)

    else if (value .length ==64)
        ONE=(ZeroString32.concat(ZeroString32)).substring(0, 63).concat('1'); //signed multiplication (64 bits)
    else if (value.length ==66)
        ONE='0'+(ZeroString32.concat(ZeroString32)).concat('1');  //unsigned booth (66 bits)
    else
        ONE=ZeroString32+'1'; //for division (33 bits)


    for(var i = 0 ; i<value.length; i ++)
    {
        var ch = value[i]=='0'? '1':'0';
        value =replaceAt(value,i,ch);
    }
    value = addNBits(value,ONE ,false,true);

    return value;
}

function toBitString32  (value, base)  {
    var BinaryEqu;
    switch (base){
        case 8:
            BinaryEqu =parseInt(value, 8).toString(2);
            break;
        case 10:
            BinaryEqu= parseInt(value, 10).toString(2);
            break;
        case 16:
            BinaryEqu=parseInt(value, 16).toString(2);
            break;
        default:
            BinaryEqu=value;
            break;
    }


    if(BinaryEqu[0] == '-'){
        BinaryEqu=ZeroString32.substring(0, 32-BinaryEqu.length+1).concat(BinaryEqu.substring(1,BinaryEqu.length ));

        BinaryEqu =toTwoS_Complemnt(BinaryEqu);
    }
    else
        BinaryEqu=ZeroString32.substring(0, 32-BinaryEqu.length).concat(BinaryEqu);

    return BinaryEqu;
}

function shiftRight(operand,SI) {
    FLAGS.CARRY=operand.charAt(operand.length-1);

    return SI+operand.substring(0,operand.length-1);
}

function shiftLeft(operand,SI) {
    FLAGS.CARRY=operand.charAt(0);
    return operand.substring(1,operand.length)+SI;
}

function extendTo64Bit(value, signed){
    var ex0=''; var ex1='';
    if(value.length != 32)  {ex0='0';ex1='1';}
    var result;
    if(signed && value.charAt(0)=='1')
        result=ex1+OneString32.concat(value);
    else  result=ex0+ZeroString32.concat(value);

    return result;
}


module.exports = {
    OneString32:OneString32,
    ZeroString32:ZeroString32,
    toTwoS_Complemnt:toTwoS_Complemnt,
    toBitString32:toBitString32,
    extendTo64Bit:extendTo64Bit,
    shiftLeft:shiftLeft,
    shiftRight:shiftRight,
    UpdateFlags:UpdateFlags,
    resetFlags:resetFlags,
    replaceAt:replaceAt,
    flagsF :flagsF,
    sub32Bit:sub32Bit,
    addNBits:addNBits,
    Subtraction:Subtraction,
    Addition:Addition,
    multiAddition,multiAddition,
    mltiAdder64Bit:mltiAdder64Bit,
    BitstringFormat:BitstringFormat,
    shortLine:shortLine,
    LINE:LINE,
    GET_REDUNDANT_BITS: function () {
        return REDUNDANT_BITS;
    },
    SET_REDUNDANT_BITS: function (RB) {
        REDUNDANT_BITS=RB;
    },
    toDecimal:toDecimal,
    CalculateRedendandBits,CalculateRedendandBits

};
