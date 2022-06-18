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

function load2(image1, image2, src) {
  image1.lo=new Image();
  image2.hi=new Image();
  image1.lo.src=src+".jpg";
  image2.hi.src=src+".jpg";
  images[image1.name]=image1;
  images[image2.name]=image2;
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