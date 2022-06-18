<?php function noticiasMenu(){ ?>
<?php echo '<script type="text/javascript">
	<!--
	function MM_jumpMenu(targ,selObj,restore){ //v3.0
	  eval(targ+".location=\'"+selObj.options[selObj.selectedIndex].value+"\'");
	  if (restore) selObj.selectedIndex=0;
	}
	function MM_goToURL() { //v3.0
	  var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
	  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location=\'"+args[i+1]+"\'");
	}
	//-->
	</script>
	'; ?>
	<?php echo '
	
			<div id="noticias" onmouseover=\'document.getElementById("noticias").style.height="122px";\' onmouseout=\'document.getElementById("noticias").style.height="15px";\'>
			  <a class="menuNoticias" href="#">Noticias <img src="http://localhost/curewebwork2/noticias/flecha.jpg" alt="abrir" width="14" height="14" /></a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/noticias/noticias2009.php">Noticias 2009</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/noticias/noticias2008.php">Noticias 2008</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/noticias/noticias2005.php">Noticias 2005</a><br />
			  <span style="color:#CCCCCC;">Noticias 2004</span><br />
			  <span style="color:#CCCCCC;">Noticias 2003</span><br />
			  <span style="color:#CCCCCC;">Noticias 2002</span><br />
			  <span style="color:#CCCCCC;">Noticias 2001</span>
			</div>

	<div id="actuaciones" onmouseover=\'document.getElementById("actuaciones").style.height="95px";\' onmouseout=\'document.getElementById("actuaciones").style.height="15px";\'>
			  <a class="menuNoticias" href="#">Actuaciones <img src="http://localhost/curewebwork2/noticias/flecha.jpg" alt="abrir" width="14" height="14" /></a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/actuaciones/a2009/a2009.php">Actuaciones 2009</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/actuaciones/a2008/a2008.php">Actuaciones 2008</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/actuaciones/a2005/a2005.php">Actuaciones 2005</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/actuaciones/a2004/a2004.php">Actuaciones 2004</a><br />
			  <a class="menuNoticias" href="http://localhost/curewebwork2/noticias/actuaciones/a2002_03/a2002_03.php">Actuaciones 2002/03</a><br />
	</div>
			<div id="proyectos">
			<a class="menuNoticias" href="http://localhost/curewebwork2/noticias/proyectos/proyectos.php">Proyectos</a></div>'; ?>
<?php } ?>