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
} ?>
<?php
/* menu Libro */

$libro = $_GET['Libro'];

mysql_select_db($database_cure, $cure);
$query_Libro = "SELECT * FROM bibliografia WHERE lgTitulo = '$libro'";
$Libro = mysql_query($query_Libro, $cure) or die(mysql_error());
$row_Libro = mysql_fetch_assoc($Libro);
$totalRows_Libro = mysql_num_rows($Libro);

mysql_select_db($database_cure, $cure);
$query_lgmMenu = "SELECT * FROM bibliografia";
$lgmMenu = mysql_query($query_lgmMenu, $cure) or die(mysql_error());
$row_lgmMenu = mysql_fetch_assoc($lgmMenu);
$totalRows_lgmMenu = mysql_num_rows($lgmMenu);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Bibliografía</title>
<link rel="stylesheet" href="../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
	color: #33FF99;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	font-weight:bold;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#303030;
	scrollbar-3dlight-color:#D9D9D7;
	scrollbar-darkshadow-color:#000000;
	scrollbar-shadow-color:#303030;
	scrollbar-arrow-color:#D9D9D7;
	scrollbar-track-color:#303030;
}
p {text-align:center;
	color: #2D57B0;}

#capaGenerallibroMenu {
	padding: 0 0 0 0;
	width: 100%;
	height: 50px;
	/*	background-image: url(../Fondos/faith.jpg);*/
	/*padding-top: 60px;*/
	background-color:#171723;
}
#capaGenerallibroContenido {
	padding: 0 0 0 0;
	width: 100%;
	overflow: auto;
	height: 405px;
	background-image:url(fotos/fondo.gif);
	background-repeat:repeat;
}
#capaGenerallibroContenido p {
	text-align:center;
	color: #977BEA;
}
.cajas {
	background-color: #003063;
	color: #FFFFFF;
	}
.disco {
	font-weight:bold;
	color: #FFFFFF;
	}
a:link {
	color: #FCFEFC;
	text-decoration: none;
}
a:visited {
	text-decoration: none;
	color: #FCFEFC;
}
a:hover {
	text-decoration: none;
	color: #D4C2AC;
}
a:active {
	text-decoration: none;
}
-->
</style>
</head>
<body class="oneColFixCtrHdr">
<div id="container">
<div id="header">
  <?php include("../principales/menu_acob.html");?>
</div>   
  <div id="capaGenerallibroMenu">
   <?php include("bibliografiaMenu.php");?>
  </div>
<div id="capaGenerallibroContenido">  
<div align="center" style="height:405px; overflow:auto; background-image:url(fotos/fondo.gif); background-repeat: repeat; width:80%;">
<div id="intro" align="right" style="color:#CCCCCC; font-family:Arial, Helvetica, sans-serif; margin-top: 200px;"><img src="fotos/bibliografia.gif" alt="Bibliografia" width="317px" height="69px" /></div></div>
</div>
<div id="footer"><?php include("../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>
<?php
mysql_free_result($Libro);

mysql_free_result($lgmMenu);
?>