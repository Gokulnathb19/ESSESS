<?php

function createDir($fileDir) {
    if (!file_exists($fileDir)) {
        mkdir($fileDir, 0777, true);
    }
}
function saveFiles($files, $fileNames, $fileTypes, $fileNo) {
    try {
        $fileDir = dirname(dirname(__FILE__)).'/users/'.strval($fileNo).'/files/';
        createDir($fileDir);
    }
    catch(Exception $th) {
            $error = $th;
            $upload_success = FALSE;
            return;
    }
    $count = count($files['name']);
    for ($i = 0; $i < $count; $i++) {
        try {
            $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filePath = $fileDir.$fileTypes[$i].'_'.$fileNames[$i].'.'.$ext;
            if (move_uploaded_file($files['tmp_name'][$i], $filePath)) {
                $upload_success = TRUE;
            } else {
                $upload_success = FALSE;
            break;
            }
        } catch (Exception $th) {
            $error = $th;
            $upload_success = FALSE;
            break;
        }
    }
    return $upload_success;
}

function saveUserPdfs($url, $fileNo) {
    try {
        $fileDir = dirname(dirname(__FILE__)).'/users/'.strval($fileNo).'/';
        createDir($fileDir);
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

function saveImages($files, $fileNo) {
    try {
        $fileDir = dirname(dirname(__FILE__)).'/users/'.strval($fileNo).'/images/';
        createDir($fileDir);
    }
    catch(Exception $th) {
            $error = $th;
            $upload_success = FALSE;
            return;
    }
    $count = count($files['name']);
    for ($i = 0; $i < $count; $i++) {
        try {
            $fileName = $files['name'][$i];
            $filePath = $fileDir.$fileName;
            if (move_uploaded_file($files['tmp_name'][$i], $filePath)) {
                $upload_success = TRUE;
            } 
            else {
                $upload_success = FALSE;
                break;
            }
        } catch (Exception $th) {
            $error = $th;
            $upload_success = FALSE;
            break;
        }
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

    $sql = "select * from users where (email != '' and email='$email') or mobile in ('$mobile','$mobile2') or (mobile2 != '' and mobile2 in ('$mobile','$mobile2'))";
    $result = $conn->query($sql);
    if(mysqli_num_rows($result) == 0) {

        if(isset($_FILES['files'])) {
            $upload_success = saveFiles($_FILES['files'], $_POST['fileNames'], $_POST['fileTypes'], $fileNo);
        }
        if(isset($_FILES['images'])) {
            $upload_success = saveImages($_FILES['images'], $fileNo);
        }
        if(isset($_POST['pdfURL'])) {
            $upload_success = saveUserPdfs($_POST['pdfURL'], $fileNo);
        }
        if($upload_success) {
            $sql = "insert into users(title, name, parentTitle, parentName, email, mobile, mobile2, address, district, state, pincode, fileno) values('$title', '$name', '$parentTitle', '$parentName', '$email', '$mobile', '$mobile2', '$address', '$district', '$state', '$pincode', $fileNo)";
            $result = $conn->query($sql);
            if ($result == TRUE && $conn->affected_rows == 1) {
                $response = '{"success":true}';
                $sql = "insert into files(latitude, longitude, day, month, year, valuationType, purposeOfValuation, marketValue, totalExtent) values('$latitude', '$longitude', $day, $month, $year, '$valuationType', '$purposeOfValuation', $marketValue, '$totalExtent')";
                $result = $conn->query($sql);
                if ($result == TRUE && $conn->affected_rows == 1) {
                    $response = '{"success":true}';
                } else {
                    $response = '{"success":false, "sql": "'.$sql.'"}';
                }
            } else {
                $response = '{"success":false, "sql": "'.$sql.'"}';
            }
        }
        else {
            $response = '{"success":false, "error": "files not uploaded successfully"}';
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