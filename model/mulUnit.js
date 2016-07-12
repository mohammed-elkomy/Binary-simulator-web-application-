/**
 * Created by mohammed on 13/05/16.
 */

var utilUnit = require('./../model/utilUnit');
var addUnit = require('./../model/addUnit');


function removeRedundantMULOP(value){

    if(Array.isArray(value))
    {
        for(var i=0 ; i< value.length ; i++){
            if(value[i]=='0')
            { value.splice(i, 1);i--;}
            else break;
        }

    }
    else {

        for(var i=0 ; i< value.length ; i++){
            if(value.charAt(i)=='0')
            {value=utilUnit.replaceAt(value,i,'');i--}
            else break;
        }

    }
    return value;

}

function multBy_I_andExtendTo64Bit(operand,mutiplier,signed){

    switch (mutiplier){
        case '0' :
            if(operand.length == 32)
                return utilUnit.ZeroString32.concat(utilUnit.ZeroString32);
            else if (operand.length == 64)
                return utilUnit.ZeroString32.concat(utilUnit.ZeroString32);
            else  return utilUnit.ZeroString32.concat(utilUnit.ZeroString32)+'00';
            break ;

        case '1' :

            return  utilUnit.extendTo64Bit(operand,signed);
            break ;

        case '2' :

            return utilUnit.shiftLeft(utilUnit.extendTo64Bit(operand,signed),0);
            break ;

        case '-1' :


            return utilUnit.toTwoS_Complemnt(utilUnit.extendTo64Bit(operand,signed));
            break ;

        case '-2' :
            return utilUnit.toTwoS_Complemnt(utilUnit.shiftLeft(utilUnit.extendTo64Bit(operand,signed),0));
            break ;
    }
}


function formattingMultiplicationOperands(operand1,operand2,Signed,NormalMul){
var OP1 =utilUnit.BitstringFormat(operand1);
    var OP2=utilUnit.BitstringFormat( operand2);
  return  '\n  '+(OP1.length <32&&!NormalMul ?'0':'')+OP1+utilUnit.toDecimal(operand1,Signed)+'* '+(OP2.length <32&&!NormalMul ?'0':'')+OP2+utilUnit.toDecimal(operand2,Signed)+utilUnit.shortLine.substring(5*utilUnit.GET_REDUNDANT_BITS()/4,utilUnit.shortLine.length);
}


function normalMul32Bit(operand1,operand2,Signed){
    utilUnit.SET_REDUNDANT_BITS( Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)));
    var outputStirng=formattingMultiplicationOperands(operand1,operand2,Signed,true);


    utilUnit.SET_REDUNDANT_BITS(  64-(32-Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)))*2-2+(Signed?0:+2));

    operand2= removeRedundantMULOP(operand2); //reduction


    var partialProducts=new Array(operand2.length);


    for(var i = operand2.length-1 ; i >0 ; i--){

        partialProducts[i]=multBy_I_andExtendTo64Bit(operand1, operand2.charAt(i),Signed);


        for (var j = 0;j<operand2.length-1-i ;j++){
            partialProducts[i]=  utilUnit.shiftLeft(partialProducts[i],0);
        }

    }

    //sign bit is treated differently according to signed systems with both negatives
    if ( Signed && operand2.length ==32 && operand2.charAt(0)=='1')
        partialProducts[0]=multBy_I_andExtendTo64Bit(operand1,'-1',Signed);
    else
        partialProducts[0]=multBy_I_andExtendTo64Bit(operand1,operand2.charAt(0),Signed);


    for (var j = 0;j<operand2.length-1 ;j++){
        partialProducts[0]= utilUnit. shiftLeft(partialProducts[0],0);
    }

    return outputStirng+addUnit.multiAddition(partialProducts,Signed);
}



function BoothMul32Bit(operand1,operand2,Signed){

    utilUnit.SET_REDUNDANT_BITS( Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)));

    var OP1=utilUnit.BitstringFormat(operand1);
    var text1=    '\n  '+(OP1.length <32 ?'0':'')+OP1+utilUnit.toDecimal(operand1,Signed);
    var outputString=formattingMultiplicationOperands(operand1,operand2,true);

    var RBM=utilUnit.GET_REDUNDANT_BITS();

    utilUnit.SET_REDUNDANT_BITS(  64-(32-Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)))*2);


    var partialProducts;
    if(!Signed)
     {
        operand1='0'+operand1;//n+1 system
        operand2='0'+operand2;//n+1 system

    }

    operand2 =BoothEndcoding(operand2);//generate the encoding
    operand2= removeRedundantMULOP(operand2); //reduction



    outputString +=text1+(' '+operand2.join(' ')).replace(/ 1/g, " +1")+'(encoded)\n'+utilUnit.LINE.substring(RBM*4/5,utilUnit.LINE.length);

    partialProducts=[];

    for(var i = operand2.length-1 ; i >-1 ; i--){

        partialProducts[i]=multBy_I_andExtendTo64Bit(operand1, operand2[i],true);
        for (var j = 0;j<operand2.length-1-i ;j++){
            partialProducts[i]=  utilUnit.shiftLeft(partialProducts[i],0);
        }
    }

    return outputString+addUnit.multiAddition(partialProducts,true,!Signed);
}

function BitPairMul32Bit(operand1,operand2,Signed){
    utilUnit.SET_REDUNDANT_BITS( Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)));
    var OP1=utilUnit.BitstringFormat(operand1);
    var text1=    '\n  '+(OP1.length <32 ?'0':'')+OP1+utilUnit.toDecimal(operand1,Signed);
    var outputStirng=formattingMultiplicationOperands(operand1,operand2,true);
    var RBM=utilUnit.GET_REDUNDANT_BITS();

    utilUnit.SET_REDUNDANT_BITS(  64-(32-Math.min(utilUnit.CalculateRedendandBits(operand1),utilUnit.CalculateRedendandBits(operand2)))*2);


    if(!Signed)
     {
        operand1='0'+operand1;//n+1 system
        operand2='0'+operand2;//n+1 system
    }

    operand2 =BitPairEndcoding(operand2);//generate the encoding
    operand2= removeRedundantMULOP(operand2); //reduction


    outputStirng +=text1+(' '+operand2.join(' ')).replace(/ 1/g, " +1").replace(/ 2/g, " +2")+'(encoded)\n'+utilUnit.LINE.substring(RBM*4/5,utilUnit.LINE.length);


    var partialProducts=[];
    for(var i = operand2.length-1 ; i >-1 ; i--){
        partialProducts[i]=multBy_I_andExtendTo64Bit(operand1, operand2[i],true);

        for (var j = 0;j<operand2.length-1-i ;j++){
            partialProducts[i]= utilUnit. shiftLeft(partialProducts[i],0);
            partialProducts[i]= utilUnit. shiftLeft(partialProducts[i],0);
        }
    }

    return outputStirng+addUnit.multiAddition(partialProducts,true,!Signed );

}

function BoothEndcoding(operand){
    operand= operand+'0';
    var encoding =[];
    for(var i = operand.length-1 ; i >0 ; i--){
        switch (operand[i-1]+operand[i]){
            case '00':
            case '11':
                encoding[i-1]='0';
                break;
            case '01':
                encoding[i-1]='1';
                break;
            case '10':
                encoding[i-1]='-1';
                break;
        }
    }

    return encoding;
}


function BitPairEndcoding(operand){
    operand= operand+'0';

    if(operand.length % 2 == 0)
        operand=operand.charAt(0)+operand;

    var encoding =[];

    var j = Math.ceil(operand.length/2)-2;

    for(var i = operand.length-2;  i >0 ; i-=2,j--){
        switch (operand[i-1]+operand[i]+operand[i+1]){
            case '000':
            case '111':
                encoding[j]='0';
                break;
            case '001':
            case '010':
                encoding[j]='1';
                break;
            case '101':
            case '110':
                encoding[j]='-1';
                break;
            case '011':
                encoding[j]='2';
                break;
            case '100':
                encoding[j]='-2';
                break;
        }
    }

    return encoding;
}





module.exports = {
    normalMultplication:normalMul32Bit,
    multBy_I_andExtendTo64Bit:multBy_I_andExtendTo64Bit,
    BoothMultplication:BoothMul32Bit,
    BitPairMultplication:BitPairMul32Bit
};
