var images = new Array();
var current = null;
var VersionNav= navigator.appVersion
var star=null;

function load(image, src) {
  image.lo=new Image();
  image.hi=new Image();
  image.lo.src=src+"_off.gif";
  image.hi.src=src+"_on.gif";
  images[image.name]=image;
  return(true);
}

function set(name) {
  image=images[name];
  if (image!=current) image.src=image.hi.src;
}

function reset(name) {
  image=images[name];
  if (image!=current) image.src=image.lo.src;
}

function AlternarImag (nombre, fuente) {
  if (((navigator.appName == "Netscape") & (VersionNav.substring(0,1) >=3)) || (VersionNav.substring (0,1) >= 4)) {
    imagen = new Object();
    imagen = nombre;
    imagen.src = "imatges/"+fuente+".jpg";
  }
}

function AbreVentana(nombre) {
    window.open(nombre, "_blank", "toolbar=yes,menubar=yes,directories=yes,status=yes,resizable=yes,location=yes,scrollbars=yes")
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function preCargar() { //v3.0
  var d=document; if(d.images){ if(!d.img) d.img=new Array();
    var i,j=d.img.length,a=preCargar.arguments; for(i=0; i<a.length; i++)
    d.img[j]=new Image; d.img[j++].src=a[i];}
}