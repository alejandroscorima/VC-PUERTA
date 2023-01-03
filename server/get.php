
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
$bd = include_once "bd.php";
if($selectedSala == 'MEGA'){
  $sentencia = $bd->prepare("SELECT hour_entrance, age FROM visits_mega WHERE doc_number = '".$doc_number."' AND date_entrance = '".$date_entrance."'");
}
if($selectedSala == 'PRO'){
  $sentencia = $bd->prepare("SELECT hour_entrance, age FROM visits_pro WHERE doc_number = '".$doc_number."' AND date_entrance = '".$date_entrance."'");
}
if($selectedSala == 'HUARAL'){
  $sentencia = $bd->prepare("SELECT hour_entrance, age FROM visits_huaral WHERE doc_number = '".$doc_number."' AND date_entrance = '".$date_entrance."'");
}

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$cliente = $sentencia->fetchAll(PDO::FETCH_OBJ);
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($cliente);
