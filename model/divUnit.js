/**
 * Created by mohammed on 13/05/16.
 */

var utilUnit = require('./../model/utilUnit');
var addUnit = require('./../model/addUnit');
var operations={shift:'Shift\n',subtract:'Subtract\n',setQ:'Set Qo\n',restore:'Restore\n',add:'Add\n'};

function RestoringDivision32Bit(dividend,divisor,Signed){
    var SignC1=false;
    var SignC2=false;
    //initialization
    utilUnit.SET_REDUNDANT_BITS(  utilUnit.CalculateRedendandBits(dividend) );
    var cycles=dividend.length-utilUnit.GET_REDUNDANT_BITS();
    var line=utilUnit.LINE.substring(0,cycles+3);

    if(Signed){

        if(dividend.charAt(0)=='1')//is negative
        {
            dividend=utilUnit.toTwoS_Complemnt(dividend);
            SignC1=true;
        }
        if(divisor.charAt(0)=='1')//is negative
        {
            divisor = utilUnit.toTwoS_Complemnt(divisor);
            SignC2=true;
        }

        if(SignC1 &&SignC2 )
       return RestoringDivision32Bit(dividend,divisor,false);
    }

var A,M,MTows;

    A='0'+utilUnit.ZeroString32;
    M='0'+divisor;
             MTows=utilUnit.toTwoS_Complemnt(M);

    var formattedOutput={left:'Initially \n  M\n',
        middle:utilUnit.BitstringFormat(A)+'\n'+utilUnit.BitstringFormat(M)+'\n',
        right:utilUnit.BitstringFormat(dividend)+'\n\n'};


        for (var i=0 ; i <dividend.length ; i++){//each clock cycle

            A=utilUnit.shiftLeft(A,dividend.charAt(0));//shift step

            if( i > dividend.length-cycles-1){
            formattedOutput.left +=operations.shift;
            formattedOutput.middle +=utilUnit.BitstringFormat(A)+'\n';
            formattedOutput.right +=utilUnit.BitstringFormat(dividend.substring(1,dividend.length))+'\n';
            }

            A= addUnit.addNBits (A,MTows,Signed,true/*do not update flags*/); //subtract step

            if( i > dividend.length-cycles-1) {
                formattedOutput.left += operations.subtract + '\n';
                formattedOutput.middle += utilUnit.BitstringFormat(MTows) + '\n' + line + '\n';
                formattedOutput.right += '\n\n';


                formattedOutput.left += operations.setQ;//set Qo
                formattedOutput.middle += utilUnit.BitstringFormat(A) + '\n';
                formattedOutput.right += '\n';
            }

            dividend=utilUnit.shiftLeft(dividend,utilUnit.invertBit(A.charAt(0))) ;


            if (A.charAt(0) =='1')//restore
            {
                A= addUnit.addNBits (A,M,Signed,true); //do not update flags


                if( i > dividend.length-cycles-1) {
                    formattedOutput.left += operations.restore + '\n';//restore
                    formattedOutput.middle += utilUnit.BitstringFormat(M) + '\n' + line + '\n';
                    formattedOutput.right += '\n\n';

                }

            }

            if( i > dividend.length-cycles-1) {
                formattedOutput.left += '\n';
                formattedOutput.middle += utilUnit.BitstringFormat(A) + '\n';
                formattedOutput.right += utilUnit.BitstringFormat(dividend) + '\n';
            }
        }

    formattedOutput.left += '\t\n';
    formattedOutput.middle += 'Remainder ';  //Remainder at the last cycle
    formattedOutput.right += 'Quotient ' ; //Quotient at the last cycle
    var FinalOutput= {};

    FinalOutput.Text ='Restoring division is only concerned with unsigned integers.\n ';

    if((SignC1==true &&SignC2==false)||SignC1==false &&SignC2==true)
        FinalOutput.Text+='The actual Quotient is\n'+utilUnit.BitstringFormat(utilUnit.toTwoS_Complemnt(A))+'\n';
    if(SignC1==true)
        FinalOutput.Text+='The actual Remainder is\n'+utilUnit.BitstringFormat(utilUnit.toTwoS_Complemnt(dividend))+'\n';


    FinalOutput.Arith=formattedOutput;


return FinalOutput;

}


function NonRestoringDivision32Bit(dividend,divisor,Signed){

    //initialization

    var SignC1=false;
    var SignC2=false;

    utilUnit.SET_REDUNDANT_BITS(  utilUnit.CalculateRedendandBits(dividend) );
    var cycles=dividend.length-utilUnit.GET_REDUNDANT_BITS();
    var line=utilUnit.LINE.substring(0,cycles+3);



    if(Signed){
        if(dividend.charAt(0)=='1')//is negative
        {
            dividend=utilUnit.toTwoS_Complemnt(dividend);
            SignC1=true;
        }
        if(divisor.charAt(0)=='1')//is negative
        {
            divisor = utilUnit.toTwoS_Complemnt(divisor);
            SignC2=true;
        }

        if(SignC1 && SignC2 )
            return NonRestoringDivision32Bit(dividend,divisor,false);
    }


    var A,M,MTows;

    A='0'+utilUnit.ZeroString32;
    M='0'+divisor;
    MTows=utilUnit.toTwoS_Complemnt(M);


    var formattedOutput={left:'Initially \n  M\n',middle:utilUnit.BitstringFormat(A)+'\n'+utilUnit.BitstringFormat(M)+'\n',right:utilUnit.BitstringFormat(dividend)+'\n\n'};


    for (var i=0 ; i <dividend.length ; i++) {//each clock cycle

        A = utilUnit.shiftLeft(A, dividend.charAt(0));//shift step

        if (i > dividend.length - cycles - 1) {


            formattedOutput.left += operations.shift;
            formattedOutput.right += utilUnit.BitstringFormat(dividend.substring(1, dividend.length)) + '\n';
            if(i-dividend.length + cycles ==0 ){
                formattedOutput.middle += utilUnit.BitstringFormat(utilUnit.shiftLeft( '0'+utilUnit.ZeroString32,dividend.charAt(0) ) ) + '\n';
            }else {
                formattedOutput.middle += utilUnit.BitstringFormat(A) + '\n';
            }


        }


        var tempAn =A.charAt(0) == '1'&&!(i-dividend.length + cycles ==0)  ;


        if (A.charAt(0) == '1')//add{
            A = addUnit.addNBits(A, M, Signed, true); //do not update flags
         else //sub
            A= addUnit.addNBits (A,MTows,Signed,true); //do not update flags

        dividend=utilUnit.shiftLeft(dividend,utilUnit.invertBit(A.charAt(0))) ;

        if( i > dividend.length-cycles-1) {
            formattedOutput.left += (tempAn?operations.add:operations.subtract) + '\n';
            formattedOutput.middle += utilUnit.BitstringFormat( (tempAn?M:MTows)) + '\n' + line + '\n';
            formattedOutput.right += '\n\n';


            formattedOutput.left += operations.setQ+'\n';//set Qo
            formattedOutput.middle += utilUnit.BitstringFormat(A) + '\n\n';
            formattedOutput.right += utilUnit.BitstringFormat(dividend) +'\n\n';
        }
    }


    if (A.charAt(0) =='1')//restore
        {
            A= addUnit.addNBits (A,M,Signed,true); //do not update flags

            formattedOutput.left += operations.restore + '\n';//restore
            formattedOutput.middle += utilUnit.BitstringFormat(M) + '\n' + line + '\n';
            formattedOutput.right += '\n\n';

            formattedOutput.left += '\n';
            formattedOutput.middle += utilUnit.BitstringFormat(A) + '\n';
            formattedOutput.right += utilUnit.BitstringFormat(dividend) + '\n';

        }


    formattedOutput.left += '\t \n';
    formattedOutput.middle += 'Remainder ';  //Remainder at the last cycle
    formattedOutput.right += 'Quotient ' ; //Quotient at the last cycle

    var FinalOutput={};

    FinalOutput.Text ='Non-Restoring division is only concerned with unsigned integers.\n ';

    if((SignC1==true &&SignC2==false)||SignC1==false &&SignC2==true)
        FinalOutput.Text+='The actual Quotient is\n'+utilUnit.BitstringFormat(utilUnit.toTwoS_Complemnt(A))+'\n';
    if(SignC1==true)
        FinalOutput.Text+='The actual Remainder is\n'+utilUnit.BitstringFormat(utilUnit.toTwoS_Complemnt(dividend))+'\n';


    FinalOutput.Arith=formattedOutput;


    return FinalOutput;
}




module.exports = {
    NonRestoringDivision32Bit:NonRestoringDivision32Bit,
    RestoringDivision32Bit:RestoringDivision32Bit
};

