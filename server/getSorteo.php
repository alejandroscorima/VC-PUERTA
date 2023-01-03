
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
$sala=$_GET['sala'];
$dia=$_GET['dia'];
$hora=$_GET['hora'];
$bd = include_once "bdActas.php";
//$sentencia = $bd->query("select id, nombre, raza, edad from mascotas");
if($sala=='MEGA'){
  $sentencia = $bd->prepare("select * from sorteos_mega where dia = '".$dia."' AND hora = '".$hora."'");
}
if($sala=='PRO'){
  $sentencia = $bd->prepare("select * from sorteos_pro where dia = '".$dia."' AND hora = '".$hora."'");
}
if($sala=='HUARAL'){
  $sentencia = $bd->prepare("select * from sorteos_huaral where dia = '".$dia."' AND hora = '".$hora."'");
}
//where birth_date like '%?%'
$sentencia -> execute();
//[$fecha_cumple]
//$mascotas = $sentencia->fetchAll(PDO::FETCH_OBJ);
//$sorteo = $sentencia->fetchAll(PDO::FETCH_OBJ);
$sorteo = $sentencia->fetchObject();
//echo json_encode($mascotas);
echo json_encode($sorteo);

?>
