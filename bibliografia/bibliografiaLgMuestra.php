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
 
if (isset($_GET['foto']))
{ 
$tituloParaFondo = $_GET['tituloParaFondo'];
$tituloParaFondo = str_replace (" ","%20","$tituloParaFondo");
$lgfoto = "lgFoto_" . $_GET['foto'].".jpg";
$lgtitulo = $_GET['lg']; 
$anios = $_GET['anio']; 
$orden = $_GET['orden'];
$fondo = $_GET['fondo'];
}
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="expires" content="-1" />
<style type="text/css">
<!--
body {
	<?php	if (isset($_GET['foto']))
	{?> 
	background-image:url(librosdegira/<?php echo $orden;?>%20<?php echo $tituloParaFondo?>%20<?php echo $anios;?>/<?php echo $fondo;?>);
	<?php }?>
	background-color:#000000;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#303030;
	scrollbar-3dlight-color:#D9D9D7;
	scrollbar-darkshadow-color:#000000;
	scrollbar-shadow-color:#303030;
	scrollbar-arrow-color:#D9D9D7;
	scrollbar-track-color:#303030;
	margin-top: 0px;
}
-->
</style>
</head>

<body class="oneColFixCtrHdr">
  <?php 
	if (isset($_GET['foto']))
	{ 
?>
<div align="center" style="height:355px; overflow:auto;">
  <br />
<img src="librosdegira/<?php echo $orden;?> <?php echo $lgtitulo;?> <?php echo $anios;?>/<?php echo $lgfoto;?>" alt="<?php echo $lgtitulo;?>" /><br />
<br />
</div>
<?php }?>
  <?php 
	if (!isset($_GET['foto']))
	{ 
	?>
<div align="center" style="height:138px; overflow:auto; padding-top: 255px; background-image:url(librosdegira/00%20Librosdegira_archivos/planet.jpg)">
<div align="right" id="intro" style="color:#B8A89A; font-family:Arial, Helvetica, sans-serif; font-size:12px; padding-right: 10px;">
      <div align="right"><p>Meanwhile 
        millions of miles away in space<br>
        The incoming comet brushes jupiter's face<br>
    And disappears away with barely a trace...</p></div>
  </div>
</div>
<?php }?>
</body>
</html>
<?php
mysql_free_result($paginaLg);
?>