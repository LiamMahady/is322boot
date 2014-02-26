$(function()
  {var zoom=new ZoomView('#zoom','#zoom :first');
  var zoom2=new ZoomView('#zoom2','#zoom2 :first');
  var zoom3=new ZoomView('#zoom3','#zoom3 :first');
  var carousel1=new swipable('#carousel1');
  var myCarousel=new swipable('#myCarousel');
  }
 );
function swipable(carousel)
  {carousel=$(carousel).hammer({prevent_default:true});
  carousel.bind
    ('swipeleft', function(event)
      {carousel.carousel('next');
      }
    );
  carousel.bind
    ('swiperight', function(event)
      {carousel.carousel('prev');
      }
    );
  }
var zIndexBackup=10;

function DragView(target)

  {this.target=target[0];

  this.drag=[];

  this.lastDrag={};

  this.WatchDrag=function()

    {if(!this.drag.length)

      {return;

      }

    for(var d=0;d<this.drag.length;d++)

      {var left=$(this.drag[d].el).offset().left;

      var top=$(this.drag[d].el).offset().top;

      var x_offset=-(this.lastDrag.pos.pageX-this.drag[d].pos.pageX);

      var y_offset=-(this.lastDrag.pos.pageY-this.drag[d].pos.pageY);

      left=left+x_offset;

      top=top+y_offset;

      this.lastDrag=this.drag[d];

      this.drag[d].el.style.left=left+'px';

      this.drag[d].el.style.top=top+'px';

      }

    }

  this.OnDragStart=function(event)

    {var touches=event.gesture.touches||[event.gesture];

    for(var t=0; t<touches.length;t++)

      {var el=touches[t].target.parentNode;

      if(el.className.search('polaroid')>-1)

        {el=touches[t].target.parentNode.parentNode;

        }

      el.style.zIndex=zIndexBackup+1;

      zIndexBackup=zIndexBackup+1;

      if(el&&el==this.target)

        {$(el).children().toggleClass('upSky');

        this.lastDrag={el:el,pos:event.gesture.touches[t]};

        return;

        }

      }

    }

  this.OnDrag=function(event)

    {this.drag=[];

    var touches=event.gesture.touches||[event.gesture];

    for(var t=0; t<touches.length;t++)

      {var el=touches[t].target.parentNode;

      if(el.className.search('polaroid')>-1)

        {el=touches[t].target.parentNode.parentNode;

        }

      if(el&&el==this.target)

        {this.drag.push({el:el,pos:event.gesture.touches[t]});

        }

      }

    }

  this.OnDragEnd=function(event)
    {this.drag=[];
    var touches=event.gesture.touches||[event.gesture];
    for(var t=0;t<touches.length;t++)
      {var el=touches[t].target.parentNode;
      if(el.className.search('polaroid')>-1)
        {el=touches[t].target.parentNode.parentNode;
        }
      $(el).children().toggleClass('upSky');
      }
    }
  }
function ZoomView(container, element)
  {container=$(container).hammer    
    ({prevent_default:true,
    scale_threshold:0,
    drag_min_distance:0});

  element=$(element);
  //These two constants specify the minimum and maximum zoom
  var MIN_ZOOM=1;
  var MAX_ZOOM=3;
  var scaleFactor=1;
  var previousScaleFactor=1;

  //These two variables keep track of the finger when it first
  //the screen
  var startX=0;
  var startY=0;
  var dragview=new DragView($(container));

  container.bind
    ("transformstart",
    function(event)
      {//We save the initial midpoint of the first two touches to
          //say where our transform origin is.
      e=event
      tch1=[e.gesture.touches[0].pageX,e.gesture.touches[0].pageY],
      tch2=[e.gesture.touches[1].pageX,e.gesture.touches[1].pageY]
      tcX=(tch1[0]+tch2[0])/2,
      tcY=(tch1[1]+tch2[1])/2
      toX=tcX
      toY=tcY
      var left=$(element).offset().left;
      var top=$(element).offset().top;
      cssOrigin=(-(left)+toX)/scaleFactor+"px "+(-(top)+toY)/scaleFactor+"px";
      }
    )
  container.bind
    ("transform",
    function(event)
      {scaleFactor=previousScaleFactor*event.gesture.scale;
      scaleFactor=Math.max(MIN_ZOOM,Math.min(scaleFactor,MAX_ZOOM));
      transform(event);
      }
    );
  container.bind
    ("transformend",
    function(event)
      {previousScaleFactor=scaleFactor;
      }
    );
  //on drag    
  container.bind("dragstart",$.proxy(dragview.OnDragStart,dragview));

  container.bind("drag",$.proxy(dragview.OnDrag,dragview));

  container.bind("dragend",$.proxy(dragview.OnDragEnd,dragview));

  setInterval($.proxy(dragview.WatchDrag,dragview),10);

  function transform(e)
    {//We're going to scale the X and Y coordinates by the same amount
    var cssScale="scaleX("+scaleFactor+") scaleY("+scaleFactor+")rotateZ("+e.gesture.rotation +"deg)";
    element.css
      ({webkitTransform:cssScale,
      webkitTransformOrigin:cssOrigin,
      transform:cssScale,
      transformOrigin:cssOrigin,
      });
    }
  }