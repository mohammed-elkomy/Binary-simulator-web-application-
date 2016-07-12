/**
 * Created by mohammed on 25/04/16.
 *
 *
 * http://stackoverflow.com/questions/35783797/set-material-design-lite-radio-button-option-with-jquery
 */


var RHSlist= document.getElementById("operations_list").getElementsByTagName("input");
var LHSlist= document.getElementById("LHS_parameters").getElementsByTagName("input");

var base =2;
var operNumber;

LHSlist[2].onclick= function() { base=2;  };
LHSlist[3].onclick= function() { base=10; };
LHSlist[4].onclick= function() { base=8;  };
LHSlist[5].onclick= function() { base=16; };



for(var i=0 ; i < RHSlist.length;i++){
    RHSlist[i].onclick= function() {operNumber =i;};
}


RHSlist[1].onclick= function() {operNumber =1; LHSlist[6].parentNode.MaterialSwitch.on();};

LHSlist[6].onclick= function() { if(operNumber==1) LHSlist[6].parentNode.MaterialSwitch.on(); };


function isBinary(field){
    for(var i=0 ; i<field.length ; i++ ){
        var charCode=field.charCodeAt(i);
        if (  !(charCode ==48 || charCode ==49 ))
           return false;
    }
    return true;
}

function isDecimal(field){
    for(var i=0 ; i<field.length ; i++ ){
        var charCode=field.charCodeAt(i);
        if (  !(charCode > 47 && charCode < 58 ))
            return false;
    }
    return true;
}

function isOctal(field){
    for(var i=0 ; i<field.length ; i++ ){
        var charCode=field.charCodeAt(i);
        if (  !(charCode > 47 && charCode < 56 ))
            return false;
    }
    return true;
}
function isOverflow(Signed,field){


    switch (base){
        case 8:
            if(field.length > 10)
                return true;
            break;
        case 10:
            if(!((field < (Math.pow(2,32)-1)&& !Signed)  ||(   field < (Math.pow(2,31)-1) && field > -(Math.pow(2,31)) && Signed ) ))
                return true;
            break;
        case 16:
            if(field.length > 8 )
            return true;
            break;
    }

    return false;
}

function isValidNumbers(){

    var field1=LHSlist[0].value;
    var field2=LHSlist[1].value;

    if(LHSlist[6].checked){
       if(field1.charAt(0)=='-') field1= field1.substring(1, field1.length) ;
       if(field2.charAt(0)=='-') field2= field2.substring(1, field2.length) ;
    }


    if(!(field1.length && field2.length) )
        return false;


    var IsValid1=true;
    var IsValid2=true;
    switch (base){
        case 2:
            IsValid1=isBinary(field1);
            IsValid2=isBinary(field2);
            break;
        case 8:
            IsValid1=isOctal(field1);
            IsValid2=isOctal(field2);
            break;
        case 10:
            IsValid1=isDecimal(field1);
            IsValid2=isDecimal(field2);
            break;
    }

    return IsValid1 && IsValid2;
}


function isValidKey(evt,trigger){

    var charCode = (evt.which) ? evt.which : event.keyCode;

    field =  Number(trigger.value+String.fromCharCode(charCode));


    if(  LHSlist[6].checked && charCode==45 && trigger.value.charAt(0) !='-'
        &&
        ( (trigger.value.length < 32 && base==2)||
            (base==16 && trigger.value.length < 8) ||
            (base==8 && trigger.value.length < 10) ||
            (base==10 && (((field < (Math.pow(2,32)-1)&& !LHSlist[6].checked)  && (   field < (Math.pow(2,31)-1) && field > -(Math.pow(2,31)) &&  LHSlist[6].checked  ) )) )
        )

    )

    {  trigger.value='-'+trigger.value; return false;}


    else if(base==2 && trigger.value.length > 31)
        return false;
    else if(base==16 && trigger.value.length > 7)
        return false;
    else if(base==8 && trigger.value.length > 9)
        return false;
    else if(base==10 && (!((field < (Math.pow(2,32)-1)&& !LHSlist[6].checked)  ||(   field < (Math.pow(2,31)-1) && field > -(Math.pow(2,31))&&  LHSlist[6].checked    ) )) )
        return false;

    if (  (charCode ==48 || charCode ==49) && base==2  )
        return true;

    else  if (charCode > 47 && charCode < 58 && base==10 )
        return true;
    else if  (charCode > 47 && charCode < 56 && base==8 )
        return true;

    else if  ( ((charCode > 64 && charCode < 71 )  || (charCode > 47 && charCode < 58) )  && base==16 )
        return true;

    return false;
}

function Getparameters(){

    for (operNumber=0 ;operNumber <7;operNumber++)
        if(RHSlist[operNumber].checked)
            break;
    return {Operation:operNumber,
        Field1 : LHSlist[0].value,
        Field2 : LHSlist[1].value,
        Base:base,
        Signed:LHSlist[6].checked
    }
}

function ComputationRequest(){
    var params=Getparameters();

    if(isOverflow(params.Signed,params.Field1) || isOverflow(params.Signed,params.Field2)  ){
       return;
    }

    if(isValidNumbers()){
    $.post("/", //jquery
        { params:JSON.stringify(params)},
        function(data, status){//callback
            if(status==='success')
            {
                    $('#output').empty();

                if(params.Operation>4)//division
                {
                    $("#output").append('<table > <tr id="outputBars"> </tr></table>').css('margin-left', ((data.Arith.middle.substring(1,data.Arith.middle.length).indexOf('\n'))*-.95+40)+''+'%');

                    $("#outputBars").append($("<td id='operDiv'></td>") .html( '<pre width="30">' + data.Arith.left.replace(/\n/g, "<br />"  )+ '</pre>' ));
                    $("#outputBars").append($("<td></td>") .html('<pre width="30">' +  data.Arith.middle.replace(/\n/g, "<br />")+ '</pre>'));
                    $("#outputBars").append($("<td></td>") .html( '<pre width="30">' + data.Arith.right.replace(/\n/g, "<br />")+ '</pre>'));


                    $("pre") .hover(function(){
                        $(this).css("background-color", "#ddd");
                    }, function(){
                        $(this).css("background-color", "white");
                    });

                }else
                {//other than division

                    $("#output").html('<pre width="30">' + data.Arith.replace(/\n/g, "<br />") + '</pre>').css('margin-left', (((data.Arith.substring(1,data.Arith.length).indexOf('\n'))))*-.87+48.7+''+'%');
                    $("pre") .hover(null,null);
                }
               $('p').html(data.Text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
            }
        });
    }else {
        var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Check your inputs'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}

function Reset(){
    LHSlist[0].value=null;
    LHSlist[1].value=null;
    $("#output").empty();
    $('p').empty();
    RHSlist[0].parentNode.MaterialRadio.check();
    for (i=1 ;i <7;i++)
        RHSlist[i].parentNode.MaterialRadio.uncheck();
    LHSlist[2].parentNode.MaterialRadio.check();
    LHSlist[3].parentNode.MaterialRadio.uncheck();
    LHSlist[4].parentNode.MaterialRadio.uncheck();
    LHSlist[5].parentNode.MaterialRadio.uncheck();
    LHSlist[6].parentNode.MaterialSwitch.on();
}

function  Dialog(){
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = {message: 'This web application is an interactive tool, which simulatesBoolean arithmetics with detailed steps .    Credits: Mohammed Alaa el komy   '
        ,timeout: 7000};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);

}
