<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
<!--
body {
	background-color:#000000;
	scrollbar-face-color:#000000;
	scrollbar-highlight-color:#303030;
	scrollbar-3dlight-color:#D9D9D7;
	scrollbar-darkshadow-color:#000000;
	scrollbar-shadow-color:#303030;
	scrollbar-arrow-color:#D9D9D7;
	scrollbar-track-color:#303030;
}
-->
</style>
</head>

<body class="oneColFixCtrHdr">
  <?php 
	if (isset($_GET['foto']))
	{ 
?>
<div align="center" style="height:393px; overflow:auto;">
  <img src="<?php echo $_GET['foto'];?>" alt="<?php echo $_GET['orden'];;?>" /></div>
<?php }?>
  <?php 
	if (!isset($_GET['foto']))
	{ 
	?>
<div align="center" style="height:393px; overflow:auto; background-image:url(fondofotos.jpg); padding-top: 335px;">
	<div align="right" id="intro" style="color:#CCCCCC; font-family:Arial, Helvetica, sans-serif; font-size:12px; padding-right: 10px;">
      <div align="right"><span style="font-weight:bold;">Llevo tanto tiempo mirando esas fotografías tuyas<br>
        Que casi creo que son reales...</span>
        <br />
        Pictures of you (Disintegration 1989)</div>
  </div>
</div>
<?php }?>
</body>
</html>