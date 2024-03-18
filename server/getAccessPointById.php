
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");


$accessPoint_id=$_GET['accessPoint_id'];

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("SELECT id, name, image_url, status, table_entrance FROM access_points WHERE id=".$accessPoint_id.";");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$sala = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($sala);
