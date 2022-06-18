<?php
session_start();

$captcha_texto = "";

for ($i = 1; $i <= 6; $i++) {
$captcha_texto .= caracter_aleatorio();
}

$HTTP_SESSION_VARS["captcha_texto_session"] = $captcha_texto;

function caracter_aleatorio() {

mt_srand((double)microtime()*1000000);

$valor_aleatorio = mt_rand(1,3);

switch ($valor_aleatorio) {
case 1:
$valor_aleatorio = mt_rand(97, 122);
break;
case 2:
$valor_aleatorio = mt_rand(48, 57);
break;
case 3:
$valor_aleatorio = mt_rand(65, 90);
break;
}

return chr($valor_aleatorio);
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Enlaces</title>
<link rel="stylesheet" href="../general.css" type="text/css" />
<style type="text/css">
<!--
body {
	color: #FFFFFF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#303030;
	scrollbar-3dlight-color:#D9D9D7;
	scrollbar-darkshadow-color:#000000;
	scrollbar-shadow-color:#303030;
	scrollbar-arrow-color:#D9D9D7;
	scrollbar-track-color:#303030;
}

a {
	font-size: 12px;
	color: #FFFFFF;
	font-weight: bold;
	margin-right: 3px;
}
a:visited {
	color: #FFFFFF;
	text-decoration: none;
}
a:hover {
	color: #FFFFFF;
	text-decoration: none;
}
a:active {
	color: #FFFFFF;
	text-decoration: none;
}
#capaGeneralenlaces {
	background-image: url(../enlaces/imagenes/Fondoagrad.jpg);
	height: 455px;
}

a:link {
	text-decoration: none;
}
-->
</style>
</head>
<body class="oneColFixCtrHdr">
<div id="container">
<div id="header"><?php include("../principales/menu_acob.html");?></div>
<div id="mainContent" style="background-color:#000000">
  <div style="margin-top:100px">
    <table width="486" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td class="fondocuerpo"><table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td style="width:60%; vertical-align:top;">
            <br />   
        <p style="font-weight:bold; font-size:14px;">Contacto</p>
        <p>Por favor ingrese el código que ve en la imagen. Si no puede leerlo actualice la página.</p>
        <p align="center"><img src="crear_imagen.php?<?php echo SID; ?>" /></p>
<form action="contactoEnvio.php" method="POST">
<p>Ingrese el código:
  <input name="texto_ingresado" type="text" id="texto_ingresado" size="30" />
<input type="submit" name="Submit" value="OK" />
</p>
</form>
<p><b>Nota:</b> El código es sensible a  mayúsculas y minúsculas.</p>            
           		  </td>
    </tr>
</table>
</td>
  </tr>
</table>
  </div>
</div>
<div id="footer">
    <?php include("../principales/pie_acob.html");?>
  </div>
<!-- end #container --></div>
</body>
</html>