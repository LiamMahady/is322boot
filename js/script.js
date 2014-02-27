$(function()
  {var digit1=new swipeDigit('#digit1', '1');
  var digit2=new swipeDigit('#digit2','2');
  var digit3=new swipeDigit('#digit3','3');
  var digit4=new swipeDigit('#digit4','4');
  var digit5=new swipeDigit('#digit5', '5');
  var digit6=new swipeDigit('#digit6','6');
  var digit7=new swipeDigit('#digit7','7');
  var digit8=new swipeDigit('#digit8','8');
  var digit9=new swipeDigit('#digit9','9');
  var digit0=new swipeDigit('#digit0','0');
  var opPlus=new swipeOp('#opPlus','+');
  var opMinus=new swipeOp('#opMinus','-');
  var opMult=new swipeOp('#opMult','x');
  var opDiv=new swipeOp('#opDiv','/');
  var calculate=new swipeCalc('#calculate');
  }
 );
function swipeDigit(digit, value)
  {digit=$(digit).hammer({prevent_default:true});
  digit.bind
    ('swipeleft', function(event)
      {$('#leftOp').append(value);
      }
    );
  digit.bind
    ('swiperight', function(event)
      {$('#rightOp').append(value);
      }
    );
  }
function swipeOp(op, value)
  {op=$(op).hammer({prevent_default:true});
  op.bind
    ('swipedown', function(event)
      {$('#opDisplay').text(value);
      }
    );
  }
function swipeCalc(ident)
  {ident=$(ident).hammer({prevent_default:true});
  ident.bind
    ('swipedown', function(event)
      {var left=parseInt($('#leftOp').text());
      var right=parseInt($('#rightOp').text());
      $('#leftOp').text("");
      $('#rightOp').text("");
      var out;
      switch ($('#opDisplay').text())
        {case '+': out=left+right; break;
        case '-': out=left-right; break;
        case 'x': out=left*right; break;
        case '/': out=left/right;
        }
     $('#result').text(out);
      }
    );
  }