<?php
    include "connectDB.php";
    $sql = "select f.id as fileno, u.name, u.email, u.mobile, u.mobile2, u.district, u.state from users u inner join files f on u.fileno = f.id";
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