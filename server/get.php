
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];
$date_entrance = $_GET["date_entrance"];
$selectedSala = $_GET['selectedSala'];
$table_entrance = $_GET['table_entrance'];
$bd = include_once "bd.php";

$sentencia = $bd->prepare("SELECT hour_entrance, age FROM ".$table_entrance." WHERE doc_number = '".$doc_number."' AND date_entrance = '".$date_entrance."'");


$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$cliente = $sentencia->fetchAll(PDO::FETCH_OBJ);
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($cliente);
