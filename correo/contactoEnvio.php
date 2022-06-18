<?php

session_start();

$texto_ingresado = $HTTP_POST_VARS["texto_ingresado"];
$captcha_texto = $HTTP_SESSION_VARS["captcha_texto_session"];

if ($texto_ingresado == $captcha_texto) {
?>
<?php if(isset($_POST['nombre']) && $_POST['nombre']!=""){

	$para = "vierkof1@gmail.com";
	$asunto ="ACOB - ". $_POST['asunto'];
	/* $comentario = $_POST['comentarios']; */
	$comentario = "Mensaje enviado por ".$_POST['nombre']."<br />\r\n".$_POST['comentarios'];
	
	/* Para enviar correo HTML, puede definir la cabecera Content-type. */
	$cabecera  = "MIME-Version: 1.0\r\n";
	$cabecera .= "Content-type: text/html; charset=iso-8859-1\r\n";

	/* cabeceras adicionales */
	$cabecera .= "To: vierkof1@gmail.com\r\n";
	/* $cabecera .= "From:". $_POST['nombre']."<". $_POST['correo'].">\r\n."; */
	$cabecera .= "From:".$_POST['correo']."\r\n";

	$resultado = @mail($para,$asunto,$comentario,$cabecera);

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
  <div>
    <table border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td class="fondocuerpo"><table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td style="width:60%; vertical-align:top;">
            <br />
          <?php 
          if(isset($_POST['nombre']) && $_POST['nombre']!=""){  
          if($resultado) {
		echo '<p style="text-align:center;"> Su correo ha sido enviado correctamente, gracias.</p>';
		}
		else{
			echo '<p style="font-size:12px; text-align:center;";>Su correo no se ha podido enviar, inténtelo de nuevo, gracias.</p><br /><br /><br />
			<table width="0%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td><a href="contactoValid.php"><div id="boton" align="center" style="cursor:hand; font-weight:bold; width:100px; background-image: url(images/volver.jpg); color:#FFFFFF; height: 35px; font-size:12px;">Volver a Formulario</div></a></td>
                </tr>
    </table> ';
		}
		}
           ?>
     
      <?php if(isset($_POST['nombre']) && $_POST['nombre']==""){  
			echo '<p style="font-size:12px; text-align:center;";>Su correo no se ha podido enviar, inténtelo de nuevo, gracias.</p><br /><br /><br />
			<table width="0%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td><a href="contactoValid.php"><div id="boton" align="center" style="cursor:hand; font-weight:bold; width:100px; background-image: url(images/volver.jpg); color:#FFFFFF; height: 35px; font-size:12px;">Volver a Formulario</div></a></td>
                </tr>
    </table> ';
		}
           ?>
     
     
	<?php if (($texto_ingresado == $captcha_texto) && (!isset($_POST['nombre'])))
		{
            echo '<br />
<br />
<form action="contactoEnvio.php" method="post" name="formcontacto">
	<table width="650" align="center">
	  <tr>
	    <td width="276">Tu nombre<br />
	        <input name="nombre" type="text" class="inputbox" size="35" /></td>
	    <td width="257" rowspan="3">Comentario<br />
          <textarea name="comentarios" cols="35" rows="9" class="inputbox"></textarea></td>
	  </tr>
	  <tr>
        <td><br />
          Tu mail <br />
          (así te podremos contestar, somos así de agradecidos :)<br />
        <input name="correo" type="text" class="inputbox" size="35" /></td>
      </tr>
	  <tr>
        <td><br />
          Asunto<br />
        <input name="asunto" type="text" class="inputbox" size="35" /></td>
      </tr>
	  <tr>
        <td colspan="2">&nbsp;</td>
      </tr>
    <tr>
      <td colspan="2"><div align="center">
        <p><br />
        <input name="enviar" type="submit" class="buttons" value="Enviar" />
          </p></div></td>
    </tr>
</table>
    <span class="feature"><br />
    </span>
          </form>';}
		  ?>
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
<?php 
} else {
session_unset();
session_destroy();
	header("Location: contactoValid.php");
}?>
<?php 
session_unset();
session_destroy();
?>