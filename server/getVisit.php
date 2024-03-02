
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];

$table_entrance = $_GET["table_entrance"];

$bd = include_once "bdEntrance.php";

$sentencia = $bd->prepare("SELECT id, person_id, age, date_entrance, hour_entrance, obs, visits, status FROM ".$table_entrance." WHERE doc_number = '".$doc_number."' order by date_entrance desc");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$visit = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($visit);
