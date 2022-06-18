<?php /*?><?php require_once('../Connections/cure.php'); ?>

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
?>

<?php
        
mysql_select_db($database_cure, $cure);
$query_miembrosAnteriores = "SELECT nombre FROM biografias WHERE actual = 'n'";
$miembrosAnteriores = mysql_query($query_miembrosAnteriores, $cure) or die(mysql_error());
$row_miembrosAnteriores = mysql_fetch_assoc($miembrosAnteriores);
$totalRows_miembrosAnteriores = mysql_num_rows($miembrosAnteriores);

mysql_select_db($database_cure, $cure);
$query_miembrosActuales = "SELECT biografias.nombre FROM biografias WHERE biografias.actual = 's'";
$miembrosActuales = mysql_query($query_miembrosActuales, $cure) or die(mysql_error());
$row_miembrosActuales = mysql_fetch_assoc($miembrosActuales);
$totalRows_miembrosActuales = mysql_num_rows($miembrosActuales);
?>

<?php /*?> <?php function menuMiembrosActuales(){ ?>
<?php do { ?>
            <td valign="middle"><div align="center" style="color:#CCCCFF; font-size:11px; font-family:Arial, Helvetica, sans-serif;"><a href="biografias.php?nombre=<?php echo $row_miembrosActuales['nombre'];?>"><?php echo $row_miembrosActuales['nombre'];?></a></div></td>  
        <?php } while ($row_miembrosActuales = mysql_fetch_assoc($miembrosActuales)); ?>
        <?php *
        

<?php } ?>

<?php function menuMiembrosAnteriores(){ ?>

        
        <?php do { ?>
        <td valign="middle"><div align="center" style="color:#CCCCFF; font-size:11px; font-family:Arial, Helvetica, sans-serif;"><a href="biografias.php?nombre=<?php echo $row_miembrosAnteriores['nombre'];?>"><?php echo $row_miembrosAnteriores['nombre'];?></a></div></td>  
        <?php } while ($row_miembrosAnteriores = mysql_fetch_assoc($miembrosAnteriores)); ?>

        <p>
          <?php } 

mysql_free_result($miembrosAnteriores);

mysql_free_result($miembrosActuales);
?>
        </p>
        <p>&nbsp;</p>
        <p>&nbsp; </p>
<?php */?>