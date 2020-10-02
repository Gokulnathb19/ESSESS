<?php
    include "connectDB.php";
    $sql = "SELECT Auto_increment FROM information_schema.tables WHERE table_schema='essess' and table_name='files'";
    $result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_NUM);
    echo $row[0];
?>