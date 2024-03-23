
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("SELECT a.user_id, a.colab_id, a.type_doc, a.doc_number, a.first_name, a.paternal_surname, a.maternal_surname, a.gender, a.birth_date, a.civil_status, a.profession, a.cel_number, a.email, a.address, a.district, a.province, a.region, a.username, a.entrance_role, a.latitud, a.longitud, a.photo_url, a.house_id, a.status, a.reason, COALESCE(CONCAT('Mz: ', b.block, ' Lt: ', b.lot, ' Dpt: ', b.apartment),'SN') AS house_address FROM users a LEFT JOIN houses b ON a.house_id=b.house_id WHERE a.doc_number = '".$doc_number."'");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$person = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($person);
