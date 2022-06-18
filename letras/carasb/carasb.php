<?php require_once('../../Connections/cure.php'); ?>
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
/* menu alfabetico */
mysql_select_db($database_cure, $cure);
$query_carasb = "SELECT * FROM carasb ORDER BY cbTitulo";
$carasb = mysql_query($query_carasb, $cure) or die(mysql_error());
$row_carasb = mysql_fetch_assoc($carasb);
$totalRows_carasb = mysql_num_rows($carasb);

/* menu porCd */
mysql_select_db($database_cure, $cure);
$query_carasb_porDisco = "SELECT DISTINCT cbAnio, cbDisco FROM carasb ORDER BY cbOrden, cbAnio";
$carasb_porDisco = mysql_query($query_carasb_porDisco, $cure) or die(mysql_error());
$row_carasb_porDisco = mysql_fetch_assoc($carasb_porDisco);
$totalRows_carasb_porDisco = mysql_num_rows($carasb_porDisco);

$cancion = $_GET['Alfabetico'];

mysql_select_db($database_cure, $cure);
$query_alfabetico = "SELECT * FROM carasb WHERE cbTitulo = '$cancion'";
$alfabetico = mysql_query($query_alfabetico, $cure) or die(mysql_error());
$row_alfabetico = mysql_fetch_assoc($alfabetico);
$totalRows_alfabetico = mysql_num_rows($alfabetico);

$disco = $_GET['porDisco'];

mysql_select_db($database_cure, $cure);
$query_porDisco = "SELECT * FROM carasb WHERE cbDisco = '$disco'";
$porDisco = mysql_query($query_porDisco, $cure) or die(mysql_error());
$row_porDisco = mysql_fetch_assoc($porDisco);
$totalRows_porDisco = mysql_num_rows($porDisco);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Caras B - <?php echo $disco = $row_alfabetico['cbTitulo'];?></title>
<link rel="stylesheet" href="../../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
	color: #33FF99;
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
p {
	text-align:center;
	color: #FB701C;
}

#capaGeneralCarasbMenu {
	padding: 0 0 0 0;
	width: 100%;
	height: 50px;
	/*	background-image: url(../Fondos/faith.jpg);*/
	/*padding-top: 60px;*/
	background-color:#6B1901;
	background-image: url(fondomenu.jpg);
}
#capaGeneralCarasbContenido {
	padding: 0 0 0 0;
	width: 100%;
	overflow: auto;
	height: 405px;/*	background-image: url(../Fondos/faith.jpg);*/
	background-color: #000000;	/*padding-top: 60px;*/
	background-image: url(fondocontenido.jpg);
	background-attachment: fixed;
	background-position: 0px 68%;
}
#capaGeneralCarasbContenido p {
	text-align:center;
	color: #F9BC4D;
}
.cajas {
	background-color: #FB7E33;
	color: #FFFFFF;
	}
.disco {
	font-weight:bold;
	color: #FFFFFF;
	}
-->
</style>
</head>

<body class="oneColFixCtrHdr">
<div id="container">

<div id="header">
  <?php include("../../principales/menu_acob.html");?>
</div>
  <div id="capaGeneralCarasbMenu">
  <table style="width:100%; border:0px;">
    <tr>
      <td style="width:8%; vertical-align:top;"><div style="padding-top:10px; text-align:right; border-width: 0px;"><img src="Carasbindice.gif" alt="Caras B" style="width:116px; height:35px;" /></div></td>
      <td style="width:92%; vertical-align:bottom;"><div style="padding-top:2px; text-align:center; border-width: 0px;">
        <form name="form_Alfabetico" id="form_Alfabetico" method="get" action="carasb.php">
        <select name="Alfabetico" id="Alfabetico" size="1" class="cajas" onchange="this.form.submit()">
        <option value="">Buscar por orden alfab&eacute;tico:</option>
          <?php
do {  
?>
          <option value="<?php echo $row_carasb['cbTitulo']?>"<?php if (!(strcmp($row_carasb['cbDisco'], $row_carasb['cbTitulo']))) {echo "selected=\"selected\"";} ?>><?php echo $row_carasb['cbTitulo']?></option>
          <?php
} while ($row_carasb = mysql_fetch_assoc($carasb));
  $rows = mysql_num_rows($carasb);
  if($rows > 0) {
      mysql_data_seek($carasb, 0);
	  $row_carasb = mysql_fetch_assoc($carasb);
  }
?>
        </select>  
        <select name="porDisco" id="porDisco" size="1" class="cajas" onchange="this.form.submit()">
        <option value="">Buscar por Disco / Cd:</option>
          <?php
do {  
?>
          <option value="<?php echo $row_carasb_porDisco['cbDisco']?>"<?php if (!(strcmp($row_carasb_porDisco['cbDisco'], $row_carasb_porDisco['cbTitulo']))) {echo "selected=\"selected\"";} ?>><?php echo $row_carasb_porDisco['cbDisco'];
		  if ($row_carasb_porDisco['cbAnio'] == 'null')
		  { echo " (" . $row_carasb_porDisco['cbAnio'] . ")";}?></option>
          <?php
} while ($row_carasb_porDisco = mysql_fetch_assoc($carasb_porDisco));
  $rows = mysql_num_rows($carasb_porDisco);
  if($rows > 0) {
      mysql_data_seek($carasb_porDisco, 0);
	  $row_carasb_porDisco = mysql_fetch_assoc($carasb_porDisco);
  }
?>
        </select>  
        </form>
       </div>
      </td>
    </tr>
  </table>
  </div>
  	<div id="capaGeneralCarasbContenido">
    <br />
	<br />
<?php 
if ($_GET['Alfabetico'] != "")
{
 ?>   
   <p>Disco al que pertenece:<br />
<span class="disco"><?php echo $disco = $row_alfabetico['cbDisco'];?></span></p> 
<?php 
	}
 ?>
<?php
 if ($_GET['porDisco'] != "")
{
 ?>   
   <p>Disco al que pertenece/n:<br />
<span class="disco"><?php echo $disco = $row_porDisco['cbDisco'];?></span></p> 
<?php 
	}
 ?>

    <table style="width:97%; border:0px;">
<?php 
if ($_GET['Alfabetico'] != "")
{
 ?>
	  <?php do { ?>
     <tr>
      <td style="width:50%; vertical-align:top">
      <p><span class="disco"><?php echo $disco = $row_alfabetico['cbTitulo'];?><br />
<?php echo $coment = $row_alfabetico['cbComentario'];?></span></p>
      <?php echo $letra = $row_alfabetico['cbLetraUk'];?>
      <br />	  </td> 
      <td style="width:50%; vertical-align:top">
      <p><span class="disco"><?php echo $disco = $row_alfabetico['cbTitulo'];?><br />
<?php echo $coment = $row_alfabetico['cbComentario'];?></span></p>
      <?php echo $letra = $row_alfabetico['cbLetraEs'];?>
      <br />	  </td> 
    </tr>
	  <?php } while ($row_alfabetico = mysql_fetch_assoc($alfabetico)); ?>
 <?php }?>
 
 <?php 
if ($_GET['porDisco'] != "")
{
 ?>
	  <?php do { ?>
     <tr>
      <td style="width:50%; vertical-align:top">
      <p><span class="disco"><?php echo $disco = $row_porDisco['cbTitulo'];?><br />
<?php echo $coment = $row_porDisco['cbComentario'];?></span></p>
      <?php echo $letra = $row_porDisco['cbLetraUk'];?><br />
      <br />	  </td> 
      <td style="width:50%; vertical-align:top">
      <p><span class="disco"><?php echo $disco = $row_porDisco['cbTitulo'];?><br />
<?php echo $coment = $row_porDisco['cbComentario'];?></span></p>
      <?php echo $letra = $row_porDisco['cbLetraEs'];?><br />
      <br />	  </td> 
    </tr>
	  <?php } while ($row_porDisco = mysql_fetch_assoc($porDisco)); ?>
 <?php }?>
   </table>
  </div>
<div id="footer"><?php include("../../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>
<?php
mysql_free_result($alfabetico);

mysql_free_result($porDisco);

mysql_free_result($carasb_porDisco);
?>