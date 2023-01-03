
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];

$bd = include_once "bdEntrance.php";

$sentencia = $bd->prepare("SELECT doc_number, name, age, gender, address, date_entrance, hour_entrance, obs, visits FROM visits_pro WHERE doc_number = '".$doc_number."' order by date_entrance desc");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$visit = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($visit);
