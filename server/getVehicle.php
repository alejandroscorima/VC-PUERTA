
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["plate"])) {
    exit("No está en sala");
}
$plate = $_GET["plate"];

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("SELECT a.vehicle_id, a.plate, a.house_id, a.status, a.type, a.reason, CONCAT('Mz: ', b.block, ' Lt: ', b.lot, ' Dpt: ', b.apartment) AS house_address FROM vehicles a JOIN houses b ON a.house_id=b.house_id WHERE a.plate = '".$plate."'");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$vehicle = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($vehicle);
