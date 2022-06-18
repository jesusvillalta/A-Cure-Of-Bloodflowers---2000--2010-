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

$libro = $_GET['libro'];

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

mysql_select_db($database_cure, $cure);
$query_libros = "SELECT lgTitulo FROM bibliografia";
$libros = mysql_query($query_libros, $cure) or die(mysql_error());
$row_libros = mysql_fetch_assoc($libros);
$totalRows_libros = mysql_num_rows($libros);

// if (isset($_GET['menuLg']))
//	{$libro = $_GET['menuLg'];}

mysql_select_db($database_cure, $cure);
$query_menubibliografia = "SELECT * FROM bibliografia WHERE lgTitulo = '$libro'";
$menubibliografia = mysql_query($query_menubibliografia, $cure) or die(mysql_error());
$row_menubibliografia = mysql_fetch_assoc($menubibliografia);
$totalRows_menubibliografia = mysql_num_rows($menubibliografia);

$tituloParaFondo = $row_menubibliografia['lgTitulo'];

// Se sustituyen los espacios en blanco por %20 de aquellos nombres de los libros de gira que los tengan , para que se pueda reconocer la ruta del fonndo de página de las clases en firefox ej: background-image: url(librosdegira/10%20Faith%20Tour%201981/lgFondo.jpg);
$tituloParaFondo = str_replace (" ","%20","$tituloParaFondo");

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A Cure Of Bloodflowers - The Cure - Bibliografía - Libros de gira - <?php echo $_GET['libro'];?></title>
<link rel="stylesheet" href="../general.css" type="text/css" />
<style type="text/css">
<!--
body,td,th {
	color: #FFFFFF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	font-weight: bold;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#000000;
	scrollbar-3dlight-color:#D9D9D7;
	scrollbar-darkshadow-color:#000000;
	scrollbar-shadow-color:#303030;
	scrollbar-arrow-color:#D9D9D7;
	scrollbar-track-color:#000000;
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
	background-color: #000000;
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
#capaFotoMenuHorizontal {
	padding: 0 0 0 0;
	width: 100%;
	height: 50px;
	background-repeat: repeat-x;
	background-image: url(librosdegira/00%20Librosdegira_archivos/planetFondMenuHorizontal.jpg);
}
#capaFotoMenuLateralFondoLibro {
	 background-image:url(librosdegira/<?php echo $row_menubibliografia['lgOrden'] ."%20" .$tituloParaFondo."%20".$row_menubibliografia['lgAnio'];?>/lgFondo.jpg);
	padding: 0 0 0 0;
	float:left;
	width: 149.5px;
	overflow: auto;
	height: 355px;
	text-align:center;
}
#capaFotoMenuLateralFondoGeneral {
	background-image:url(librosdegira/00%20Librosdegira_archivos/planet.jpg);
	padding: 0 0 0 0;
	float:left;
	width: 149.5px;
	overflow: auto;
	height: 355px;
	text-align:center;
}
#capaFotoContenido {
	padding: 0 0 0 0;
	width: 819px;
	overflow: auto;
	height: 355px;
	background-color: #000000;
	text-align: center;
}
-->
</style>
</head>
<body class="oneColFixCtrHdr">
<meta http-equiv="expires" content="-1" />
<div id="container">
<div id="header">
  <?php include("../principales/menu_acob.html");?>
</div>   
  <div id="capaGenerallibroMenu">
   <?php include("bibliografiaMenu.php");?>
  </div>
<div id="capaGenerallibroContenido">  
  <div id="capaFotoMenuHorizontal">
    <table align="center" width="98%" border="0px" cellspacing="0px" cellpadding="0px" height="58px">
  <tr>
    <td width="39%"><div align="left" style="font-size:15px; padding-bottom:5px;"><?php echo $row_menubibliografia['lgTitulo'];?> <?php echo $row_menubibliografia['lgAnio'];?></div></td>
    <td width="61%" height="58">
        <form name="form_libro" id="form_libro" method="get" action="bibliografiaLg.php">
        <div align="left"><img src="../fotografias/candil.gif" alt="vela" width="26" height="17" />Libros de Gira
          <select name="libro" id="libro" size="1" class="cajas" onchange="this.form.submit()">
          <option value="" <?php if (!(strcmp("", $row_libro['pequeno']))) {echo "selected=\"selected\"";} ?>>Elige un Libro</option>
          <?php
do {  
?>
          <option value="<?php echo $row_libros['lgTitulo']?>"<?php if (!(strcmp($row_libros['lgTitulo'], $row_libro['lgAnio']))) {echo "selected=\"selected\"";} ?>><?php echo $row_libros['lgTitulo']?></option>
          <?php
} while ($row_libros = mysql_fetch_assoc($libros));
  $rows = mysql_num_rows($libros);
  if($rows > 0) {
      mysql_data_seek($libros, 0);
	  $row_libros = mysql_fetch_assoc($libros);
  }
?>
        </select>
        </div>
    </form></td>
  </tr>
</table>
  </div>

<?php 
	if (isset($_GET['libro']))
	{ 
?>
<div id="capaFotoMenuLateralFondoLibro">
    <br />
<br />

<?php // -------------------------------------------------------------------------------------------------------
		// para contar cuantas fotos tiene cada miembro contamos primero cuantos campos tiene rellenos count($row_menuFotografico). 
		// quitamos los campos q no son fotos nombre, actual y biografía, o sea (-3)
		// así tenemos cuantas fotos tiene cada miembro y lo metemos en $numFotos.
				$numFotos = count($row_menubibliografia) - 4;
		$inicio = 0;
		$fin = $numFotos;
		
		// pasamos los 3 primeros campos del array, que no son fotos
		 $numFoto = 0;
		for ($a=1;$a<4;$a++){
			next($row_menubibliografia);}
		
		for ($i=$inicio;$i<$fin;$i++){
		$foto= next($row_menubibliografia);
		?>
		<?php if ($foto != '') { ?>

        <?php $numFoto++;?>
        <a href="bibliografiaLgMuestra.php?foto=<?php echo $numFoto;?>&amp;anio=<?php echo $row_menubibliografia['lgAnio'];?>&amp;orden=<?php echo $row_menubibliografia['lgOrden']?>&amp;lg=<?php echo $row_menubibliografia['lgTitulo']?>&amp;fondo=<?php echo $row_menubibliografia['lgFondo']?>&amp;tituloParaFondo=<?php echo $tituloParaFondo?>" target="fotopagina"><img src="librosdegira/<?php echo $row_menubibliografia['lgOrden'] ." " .$row_menubibliografia['lgTitulo']." ".$row_menubibliografia['lgAnio'];?>/lgFoto_<?php echo $numFoto;?>_p.jpg" alt="<?php echo $row_menubibliografia['lgTitulo'];?>" style="width:75px;" /></a><br />
        <br />	  
             
            <?php } ?>
        <?php } ?>
<?php // ------------------------------------------------------------------------------------------------------------------- ?>

</div>
  <?php }?>
  <?php if (!isset($_GET['libro']))
  		 { ?>
<div id="capaFotoMenuLateralFondoGeneral"></div>
<?php } ?>
  <div id="capaFotoContenido">
  <iframe name="fotopagina" src="bibliografiaLgMuestra.php" style="width:100%; height:355px;" scrolling="no" frameborder="0">  </iframe>

  </div>
</div>
<div id="footer"><?php include("../principales/pie_acob.html");?></div>
<!-- end #container --></div>
</body>
</html>
<?php
mysql_free_result($Libro);

mysql_free_result($lgmMenu);
?>