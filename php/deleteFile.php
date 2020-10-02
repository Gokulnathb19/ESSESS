<?php
    include "connectDB.php";
    function deleteDir($dirPath) {
        if (! is_dir($dirPath)) {
            throw new InvalidArgumentException("$dirPath must be a directory");
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                deleteDir($file);
            } else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }

    $fileNo = $_POST['fileNo'];
    $deleteStatus = TRUE;
    try {
        deleteDir(dirname(dirname(__FILE__)).'/users/'.strval($fileNo).'/');
    } catch (\Throwable $th) {
        $deleteStatus = FALSE;
    }

    if($deleteStatus) {
        $sql = "delete from files where id = $fileNo";
        $result = $conn->query($sql);
        if ($result == TRUE && $conn->affected_rows == 1) {
            $response = '{"success":true}';
            $sql = "delete from users where fileno = $fileNo";
            $result = $conn->query($sql);
            if ($result == TRUE && $conn->affected_rows == 1) {
                $response = '{"success":true}';
            }
            else {
                $response = '{"success":false, "error": "'.$sql.'"}';
            }
        }
        else {
            $response = '{"success":false, "error": "'.$sql.'"}';
        }
    }
    else {
        $response = '{"success":false, "error": "Error in deleting file '.$fileNo.'"}';
    }

    echo json_encode($response);
?>