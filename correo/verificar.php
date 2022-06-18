<?php

session_start();

$texto_ingresado = $HTTP_POST_VARS["texto_ingresado"];
$captcha_texto = $HTTP_SESSION_VARS["captcha_texto_session"];

if ($texto_ingresado == $captcha_texto) {
echo "Usted ingreso el codigo correctamente.";
header("location:envio.php"); 
} else {
echo "El texto ingresado no coincide. Por favor intentelo de nuevo!";
}

session_unset();
session_destroy();

?> 