var express = require('express');
var Comp = require('./../model/Computations');

var router = express.Router();

/* GET simulator page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res) {

  var params=JSON.parse(req.body.params);

  var operand1=Comp.toBitString32(params.Field1,params.Base);
  var operand2=Comp.toBitString32(params.Field2,params.Base);



  var Response={};
  switch (params.Operation){
    case 0: //Addition
      Response.Arith=Comp.Addition(operand1,operand2,params.Signed);
    break;

    case 1: //Subtraction
      Response.Arith=Comp.Subtraction(operand1,operand2,true);
    break;

    case 2: //Normal Mult
      Response.Arith=Comp.NormalMultplication(operand1,operand2,params.Signed);
      break;

    case 3: //Booth Mult
      Response.Arith=Comp.BoothMultplication(operand1,operand2,params.Signed);
      break;

    case 4: //Bit-pair Mult
      Response.Arith=Comp.BitPairMultplication(operand1,operand2,params.Signed);
      break;

    case 5: //Restoring division

      Response=Comp.RestoringDivision32Bit(operand1,operand2,params.Signed);
      break;

    case 6: //Non-restoring Division
      Response=Comp.NonRestoringDivision32Bit(operand1,operand2,params.Signed);
      break;
  }
  if(params.Operation <5)
  Response.Text=Comp.flagsF();

  res.send(Response);
});


module.exports = router;


