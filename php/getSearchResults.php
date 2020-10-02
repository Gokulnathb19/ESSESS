<?php
    include "connectDB.php";
    $whereClause = '';
    $addComma = FALSE;
    if(isset($_POST['fileNo'])) {
        if($addComma)
            $whereClause .= ' and ';
        $whereClause .= "u.fileno like '%".$_POST["fileNo"]."%'";
        $addComma = TRUE;
    }
    if(isset($_POST['name'])) {
        if($addComma)
            $whereClause .= ' and ';
        $whereClause .= "u.name like '%".$_POST["name"]."%'";
        $addComma = TRUE;
    }
    if(isset($_POST['mobileNo'])) {
        if($addComma)
            $whereClause .= ' and ';
        $whereClause .= "(u.mobile like '%".$_POST["mobileNo"]."%' or (u.mobile2 != '' and u.mobile2 like '%".$_POST["mobileNo"]."%'))";
        $addComma = TRUE;
    }
    if(isset($_POST['district'])) {
        if($addComma)
            $whereClause .= ' and ';
        $whereClause .= "u.district like '%".$_POST["district"]."%'";
        $addComma = TRUE;
    }
    if(isset($_POST['state'])) {
        if($addComma)
            $whereClause .= ' and ';
        $whereClause .= "u.state like '%".$_POST["state"]."%'";
        $addComma = TRUE;
    }
    if($addComma)
        $whereClause = 'where '.$whereClause;
    $sql = "SELECT u.*, f.* from users u INNER JOIN files f on u.fileno = f.id ".$whereClause;
    $result = $conn->query($sql);
    $rows = array();
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    echo json_encode($rows);
?>