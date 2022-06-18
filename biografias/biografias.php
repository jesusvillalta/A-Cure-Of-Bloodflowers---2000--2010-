<?php require_once('../Connections/cure.php'); ?>
<?php
if (!function_exists("GetSQLValueString")) {
function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") 
{
  $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "defined":
      $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
      break;
  }
  return $theValue;
}
} 

$miembro = $_GET['nombre'];

mysql_select_db($database_cure, $cure);
$query_menuFotografico = "SELECT * FROM biografias WHERE nombre = '$miembro'";
$menuFotografico = mysql_query($query_menuFotografico, $cure) or die(mysql_error());
$row_menuFotografico = mysql_fetch_assoc($menuFotografico);
$totalRows_menuFotografico = mysql_num_rows($menuFotografico);

mysql_select_db($database_cure, $cure);
$query_miembrosActuales = "SELECT nombre FROM biografias WHERE actual = 's'";
$miembrosActuales = mysql_query($query_miembrosActuales, $cure) or die(mysql_error());
$row_miembrosActuales = mysql_fetch_assoc($miembrosActuales);
$totalRows_miembrosActuales = mysql_num_rows($miembrosActuales);

mysql_select_db($database_cure, $cure);
$query_miembrosAnteriores = "SELECT biografias.nombre FROM biografias WHERE biografias.actual ='n';";
$miembrosAnteriores = mysql_query($query_miembrosAnteriores, $cure) or die(mysql_error());
$row_miembrosAnteriores = mysql_fetch_assoc($miembrosAnteriores);
$totalRows_miembrosAnteriores = mysql_num_rows($miembrosAnteriores);

mysql_select_db($database_cure, $cure);
$query_biografiaTexto = "SELECT biografia, nombre FROM biografias WHERE nombre = '$miembro'";
$biografiaTexto = mysql_query($query_biografiaTexto, $cure) or die(mysql_error());
$row_biografiaTexto = mysql_fetch_assoc($biografiaTexto);
$totalRows_biografiaTexto = mysql_num_rows($biografiaTexto);


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Biografías - <?php echo $miembro;?></title>
<link rel="stylesheet" href="../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
	color: #CCCCFF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	scrollbar-face-color:#1F2148;
	scrollbar-highlight-color:#1F2148;
	scrollbar-3dlight-color:#CCCCFF;
	scrollbar-darkshadow-color:#1F2148;
	scrollbar-shadow-color:#1F2148;
	scrollbar-arrow-color:#CCCCFF;
	scrollbar-track-color:#1F2148;
}

#capaBiografiaMenuIzquierdo {
	padding: 0 20px 0 0;
	float:left;
	width: 149.5px;
	background-color: #1C1C37;
	text-align:center;
}

#capaBiografiaMenuDerecho {
	padding: 0 0 0 20px;
	float:right;
	width: 720.5px;
	height: 455px;
	text-align: left;
}
#capaBiografiaFondo {
	padding: 0 0 0 0;
	width: 970px;
	overflow: auto;
	background-color: #1C1C37;
	background-image: url(aforest.jpg);
	height: 455px;
	background-attachment: fixed;
	background-position: 90px 70px;
}
#capaBiografiaContenido {
	padding: 0px 20px 0px 20px;
	width: 930px;
	overflow: auto;
	height: 455px;
}

.negrita {
	font-weight:bold;
	color:#00FFFF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 13px;
	}
	
.clearfloat { /* this class should be placed on a div or break element and should be the final element before the close of a container that should fully contain a float */
	clear:both;
    height:0;
    font-size: 1px;
    line-height: 0px;
}
body {
	background-color: #000000;
}
a:link {
	color: #9FA6DD;
}
a:visited {
	color: #9FA6DD;
}
a:hover {
	color: #AFAEEA;
}
a:active {
	color: #9FA6DD;
}

a.link2:link {
	color: #FFFFFF;
}
a.link2:visited {
	color: #FFFFFF;
}
a.link2:active {
	color: #FFFFFF;
}
-->
</style>
</head>

<body class="oneColFixCtrHdr">
<div id="container">
<div id="header">
  <?php include("../principales/menu_acob.html");?>
</div>
  <div id="capaBiografiaFondo">
  <div id="capaBiografiaContenido">
  <div id="capaBiografiaMenuIzquierdo">
    <div align="left" style="margin-top:34px; margin-bottom:30px; padding-left:20px; color:#FFFFFF;">
    Biografías</div>
<?php 
		// para contar cuantas fotos tiene cada miembro contamos primero cuantos campos tiene rellenos count($row_menuFotografico). 
		// quitamos los campos q no son fotos nombre, actual y biografía, o sea (-3)
		// así tenemos cuantas fotos tiene cada miembro y lo metemos en $numFotos.
		$numFotos = count($row_menuFotografico) - 3;
		$inicio = 0;
		$fin = $numFotos;
		
		// pasamos los 3 primeros campos del array, que no son fotos
		for ($a=0;$a<2;$a++){
			next($row_menuFotografico);}
		
		for ($i=$inicio;$i<$fin;$i++){
		$foto= next($row_menuFotografico);
		?>
			<?php if ($foto != '') { ?>
             <img src="biografiaFotos/<?php echo $foto?>" alt="<?php echo $row_menuFotografico['nombre'];?>" /></a>
             <br />
             <br />
            <?php } ?>
        <?php } ?>
        <br />  
  </div>
  <div id="capaBiografiaMenuDerecho">
  <div style="float:left; margin-top:27px; margin-bottom:20px; font-size:24px;"><?php echo $row_biografiaTexto['nombre'];?></div>
<div style="float:left; padding-top:5px; margin-bottom:20px;">
    <table align="left" cellspacing="0px" cellpadding="0px" style="width:720px; border:none;">
    <tr style="background-image:url(actuales.jpg);">
    <td>
  <table align="left" cellspacing="0px" cellpadding="0px" style="width:100%; border:none;">
    <tr> 
          <td><div align="left" style="color:#FFFFFF; font-size:12px; font-family:Arial, Helvetica, sans-serif;">Formaci&oacute;n 
            actual</div></td>
		<?php do { ?>
            <td valign="middle"><div align="center" style="color:#CCCCFF; font-size:12px; font-family:Arial, Helvetica, sans-serif;"><a href="biografias.php?nombre=<?php echo $row_miembrosActuales['nombre'];?>"><?php echo $row_miembrosActuales['nombre'];?></a></div></td>  
        <?php } while ($row_miembrosActuales = mysql_fetch_assoc($miembrosActuales)); ?>
        </tr>
      </table>
      </td>
      </tr>
      <tr style="background-image:url(actuales.jpg);">
      <td>
    <table align="left" cellspacing="0px" cellpadding="0px" style="width:100%; border:none;">
    <tr> 
          <td><div align="left" style="color:#FFFFFF; font-size:12px; font-family:Arial, Helvetica, sans-serif;">Ex-cure</div></td>
		<?php do { ?>
            <td valign="middle"><div align="center" style="color:#CCCCFF; font-size:11px; font-family:Arial, Helvetica, sans-serif;"><a href="biografias.php?nombre=<?php echo $row_miembrosAnteriores['nombre'];?>"><?php echo $row_miembrosAnteriores['nombre'];?></a></div></td>  
        <?php } while ($row_miembrosAnteriores = mysql_fetch_assoc($miembrosAnteriores)); ?>
        </tr>
    </table>
    </td>
            </tr>
    </table>
    </div>
<div style="float:left; margin-top:15px; margin-bottom:20px; width:720.5px">
	<?php echo $row_biografiaTexto['biografia'];?>
</div>
    </div>

  </div>
  </div>
<div id="footer"><?php include("../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>
<?php
mysql_free_result($menuFotografico);

mysql_free_result($miembrosActuales);

mysql_free_result($miembrosAnteriores);

mysql_free_result($biografiaTexto);
?>