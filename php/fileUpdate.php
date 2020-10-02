<?php

function saveUserPdfs($url, $fileNo) {
    try {
        $fileDir = dirname(dirname(__FILE__)).'/users/'.strval($fileNo).'/';
        $fileName = $fileDir.'summary.pdf';
        if(file_put_contents( $fileName,file_get_contents($url))) { 
            $upload_success = TRUE;
        } 
        else { 
            $upload_success = FALSE;
        }
    }
    catch(Exception $th) {
            $error = $th;
            $upload_success = FALSE;
            return FALSE;
    }
    return $upload_success;
}

if(isset($_POST["name"])) {
    include "connectDB.php";
    $title = $_POST['userTitle'];
    $name = $_POST['name'];
    $parentTitle = $_POST['parentTitle'];
    $parentName = $_POST['parentName'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $mobile2 = $_POST['mobile2'];
    $address = $_POST['address'];
    $district = $_POST['district'];
    $state = $_POST['state'];
    $pincode = $_POST['pincode'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $day = $_POST['day'];
    $month = $_POST['month'];
    $year = $_POST['year'];
    $valuationType = $_POST['valuationType'];
    $purposeOfValuation = $_POST['purposeOfValuation'];
    $marketValue = $_POST['marketValue'];
    $totalExtent = $_POST['totalExtent'];
    $fileNo = $_POST['fileNo'];
    $upload_success = TRUE;

    $sql = "select * from users where fileno != $fileNo and ((email != '' and email='$email') or mobile in ('$mobile','$mobile2') or mobile2 in ('$mobile','$mobile2'))";
    $result = $conn->query($sql);
    if(mysqli_num_rows($result) == 0) {
        if(isset($_POST['pdfURL'])) {
            $upload_success = saveUserPdfs($_POST['pdfURL'], $fileNo);
        }
        if($upload_success) {
            $sql = "update users set title='$title', name='$name', parentTitle='$parentTitle', parentName='$parentName', email='$email', mobile='$mobile', mobile2='$mobile2', address='$address', district='$district', state='$state', pincode='$pincode' where fileno=$fileNo";
            $result = $conn->query($sql);
            if ($result == TRUE) {
                $response = '{"success":true}';
                $sql = "update files set latitude='$latitude', longitude='$longitude', day=$day, month=$month, year=$year, valuationType='$valuationType', purposeOfValuation='$purposeOfValuation', marketValue=$marketValue, totalExtent='$totalExtent' where id=$fileNo";
                $result = $conn->query($sql);
                if ($result == TRUE) {
                    $response = '{"success":true}';
                } else {
                    $response = '{"success":false, "sql": "'.$sql.'"}';
                }
            } else {
                $response = '{"success":false, "sql": "'.$sql.'"}';
            }
        }
        else {
            $response = '{"success":false, "error": "Failed to generate user pdf file."}';
        }
    }
    else {
        $response = '{"success":false, "error": "Email or Mobile No already exists"}';
    }
}
else {
    $response = '{"success":false, "error": "data not set"}';
}

echo json_encode($response);
?>