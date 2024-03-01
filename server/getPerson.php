
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("SELECT user_id, colab_id, type_doc, doc_number, first_name, paternal_surname, maternal_surname, gender, birth_date, civil_status, profession, cel_number, email, address, district, province, region, username, entrance_role, latitud, longitud, photo_url, house_id FROM users WHERE doc_number = '".$doc_number."'");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$cliente = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($cliente);
