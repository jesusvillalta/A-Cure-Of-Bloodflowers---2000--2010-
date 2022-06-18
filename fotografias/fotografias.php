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
mysql_select_db($database_cure, $cure);
$query_conciertos = "SELECT DISTINCT seccion FROM concierto";
$conciertos = mysql_query($query_conciertos, $cure) or die(mysql_error());
$row_conciertos = mysql_fetch_assoc($conciertos);
$totalRows_conciertos = mysql_num_rows($conciertos);

if (isset($_GET['concierto']))
	{$seccion = $_GET['concierto'];}
	
if (isset($_GET['robert']))
	{$seccion = $_GET['robert'];}

if (isset($_GET['banda']))
	{$seccion = $_GET['banda'];}

mysql_select_db($database_cure, $cure);
$query_menuFotografico = "SELECT * FROM concierto WHERE seccion = '$seccion'";
$menuFotografico = mysql_query($query_menuFotografico, $cure) or die(mysql_error());
$row_menuFotografico = mysql_fetch_assoc($menuFotografico);
$totalRows_menuFotografico = mysql_num_rows($menuFotografico);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Fotografías <?php echo $row_menuFotografico['cbTitulo'];?></title>
<link rel="stylesheet" href="../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
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
	font-weight: bold;
}

#capaFotoMenuHorizontal {
	padding: 0 0 0 0;
	width: 100%;
	height: 50px;
	/*	background-image: url(../Fondos/faith.jpg);*/
	/*padding-top: 60px;*/
	background-color:#000000;
}
#capaFotoMenuLateral {
	padding: 0 0 0 0;
	float:left;
	width: 149.5px;
	overflow: auto;
	height: 405px;
	background-color: #000000;
	text-align:center;
}
#capaFotoContenido {
	padding: 0 0 0 0;
	float:right;
	width: 819px;
	overflow: hidden;
	height: 405px;
	background-color: #000000;
	text-align: center;
}
.cajas {
	background-color: #003063;
	color: #FFFFFF;
	}
.clearfloat { /* this class should be placed on a div or break element and should be the final element before the close of a container that should fully contain a float */
	clear:both;
    height:0;
    font-size: 1px;
    line-height: 0px;
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
  <?php include("../principales/menu_acob.html");?>
</div>
  <div id="capaFotoMenuHorizontal">
    <table align="center" width="98%" border="0px" cellspacing="0px" cellpadding="0px" height="58px">
  <tr> 
    <td height="58" width="10%"><img src="fotogr.gif" /><br />
      <br /></td>
    <td width="30%" height="58">
        <form name="form_concierto" id="form_concierto" method="get" action="fotografias.php">
        <div align="center"><img src="candil.gif" alt="vela" width="26" height="17" />Concierto
        <select name="concierto" id="concierto" size="1" class="cajas" onchange="this.form.submit()">
          <option value="" <?php if (!(strcmp("", $row_concierto['pequeno']))) {echo "selected=\"selected\"";} ?>>Salas</option>
          <?php
do {  
?>
          <option value="<?php echo $row_conciertos['seccion']?>"<?php if (!(strcmp($row_conciertos['seccion'], $row_concierto['pequeno']))) {echo "selected=\"selected\"";} ?>><?php echo $row_conciertos['seccion']?></option>
          <?php
} while ($row_conciertos = mysql_fetch_assoc($conciertos));
  $rows = mysql_num_rows($conciertos);
  if($rows > 0) {
      mysql_data_seek($conciertos, 0);
	  $row_conciertos = mysql_fetch_assoc($conciertos);
  }
?>
        </select>
        </div>
    </form></td>
    <td width="30%" height="58"><form name="form1" id="form1">
        <div align="center"><img src="candil.gif" alt="vela" width="26" height="17" />Robert
          <select name="Robert" size="1" onchange="namosw_goto_byselect(this, 'parent.')">
            <option selected="selected">Sin contenido</option>
          </select>
        </div>
    </form></td>
    <td width="30%" height="58"><form name="form4" id="form4">
        <div align="center"><img src="candil.gif" alt="vela" width="26" height="17" />Banda
          <select name="Banda" size="1" onchange="namosw_goto_byselect(this, 'parent.')">
            <option selected="selected">Sin contenido</option>
          </select>
        </div>
    </form></td>
  </tr>
</table>
  </div>

<?php 
	if (isset($_GET['concierto']) || isset($_GET['robert']) || isset($_GET['banda']) || isset($_GET['foto']))
	{ 
?>
<div id="capaFotoMenuLateral">
        <div style="padding: 2px; width:80%; font-family:Arial, Helvetica, sans-serif; font-style:italic; font-size:12px; color:#FFFFFF; border: solid #FFFFFF 1px;">Concierto <?php echo $row_menuFotografico['seccion'];?></div>
    <br />
<br />
	    <?php do { ?>
          <a href="fotografiasMuestra.php?foto=<?php echo $row_menuFotografico['seccion'];?>/<?php echo $row_menuFotografico['grande'];?>&orden=<?php echo $row_menuFotografico['orden'];?>" target="foto"><img src="<?php echo $row_menuFotografico['seccion'];?>/<?php echo $row_menuFotografico['pequeno'];?>" alt="<?php echo $row_menuFotografico['orden'];?>" /></a>
        <br />
        <br />	  
        <?php } while ($row_menuFotografico = mysql_fetch_assoc($menuFotografico)); ?>
  </div>
  <?php }?>
  <?php if (!isset($_GET['concierto']) && !isset($_GET['robert']) && !isset($_GET['banda']) && !isset($_GET['foto']))
  		 { ?>
<div id="capaFotoMenuLateral" style="background-image:url(fondofotos.jpg)">
</div>
<?php } ?>
  <div id="capaFotoContenido">
  <iframe name="foto" src="fotografiasMuestra.php" style="width:100%; height:450px;" scrolling="no" frameborder="0">  </iframe>

  </div>
  <br class="clearfloat" />
<div id="footer"><?php include("../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>
<?php

mysql_free_result($conciertos);

mysql_free_result($menuFotografico);
?>