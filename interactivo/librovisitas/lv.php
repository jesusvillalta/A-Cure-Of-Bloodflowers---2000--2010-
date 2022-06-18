<?php require_once('../../Connections/cure.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Interactivo - Libro de visitas</title>
<link rel="stylesheet" href="../../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#000000;
	scrollbar-3dlight-color:#006868;
	scrollbar-darkshadow-color:#F6A225;
	scrollbar-shadow-color:#000000;
	scrollbar-arrow-color:#F1D17A;
	scrollbar-track-color:#F1D17A;
	color: #FEF5E7;
}

#capaFotoMenuHorizontal {
	padding: 0 0 0 0;
	width: 100%;
	height: 50px;
	background-color:#000000;
}
#capaFotoMenuLateral {
	padding: 0 0 0 0;
	float:left;
	width: 149.5px;
	overflow: hidden;
	height: 455px;
	background-color: #000000;
	text-align:center;
}
#capaFotoContenido {
	padding: 0 0 0 0;
	float:right;
	width: 819px;
	overflow: auto;
	height: 455px;
	background-color: #000000;
	text-align: center;
	background-color:#000000;
}

.clearfloat { /* this class should be placed on a div or break element and should be the final element before the close of a container that should fully contain a float */
	clear:both;
    height:0;
    font-size: 1px;
    line-height: 0px;
}
a:link {
	color: #FFCC00;
}
a:visited {
	color: #FFCC00;
}
a:hover {
	color: #FFEC9D;
}
.titulos{
	color:#FFCC00;
	font-weight:bold;}
.negrita {
	color:#ECC779;}
a {
	font-family: Arial, Helvetica, sans-serif;
}

-->
</style>
<script type="text/javascript">
<!--
function MM_jumpMenu(targ,selObj,restore){ //v3.0
  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if (restore) selObj.selectedIndex=0;
}
//-->
</script>
</head>
<body class="oneColFixCtrHdr">
<div id="container">
<div id="header">
  <?php include("../../principales/menu_acob.html");?>
</div>
<div id="capaFotoMenuLateral">
<?php include("../menuinteractivo.html");?>
</div>
  <div id="capaFotoContenido">
<iframe name="reunion" src="http://www.melodysoft.com/cgi-bin/gbook.cgi?ID=vierkof1" style="width:100%; height:455px;" scrolling="auto" frameborder="0">  </iframe>
</div>
  <br class="clearfloat" />
<div id="footer"><?php include("../../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>