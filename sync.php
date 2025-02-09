<?php
$servername = "localhost"; // Ganti dengan host database Anda
$username = "root"; // Ganti dengan username database Anda
$password = ""; // Ganti dengan password database Anda
$database = "nama_database"; // Ganti dengan nama database Anda

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $database);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// API Credentials
$api_username = "nepimoo6aVyga7be9";
$api_key = "f35-0c70-59b4-80fc-d9797733cca9";

function sync_prabayar($conn, $api_username, $api_key) {
    $sign = md5($api_username . $api_key . "pricelist");
    
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.digiflazz.com/v1/price-list',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_POSTFIELDS => json_encode([
            "cmd" => "prepaid",
            "username" => $api_username,
            "sign" => $sign
        ]),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json'
        ],
    ));
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    $data = json_decode($response);
    
    if (!empty($data->data)) {
        $conn->query("TRUNCATE TABLE pulsa");
        foreach ($data->data as $key) {
            $stmt = $conn->prepare("INSERT INTO pulsa (code, name, kategori, brand, price, sale, members, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sale = $key->price + 1750;
            $members = $key->price + 1750;
            $stmt->bind_param("ssssddsss", $key->buyer_sku_code, $key->product_name, $key->category, $key->brand, $key->price, $sale, $members, $key->seller_product_status, $key->desc);
            $stmt->execute();
            echo "Produk: " . $key->product_name . " berhasil disimpan.\n";
        }
    }
}

function sync_pasca($conn, $api_username, $api_key) {
    $sign = md5($api_username . $api_key . "pricelist");
    
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.digiflazz.com/v1/price-list',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_POSTFIELDS => json_encode([
            "cmd" => "pasca",
            "username" => $api_username,
            "sign" => $sign
        ]),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json'
        ],
    ));
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    $data = json_decode($response);
    
    if (!empty($data->data)) {
        $conn->query("TRUNCATE TABLE pasca");
        foreach ($data->data as $key) {
            $stmt = $conn->prepare("INSERT INTO pasca (code, name, kategori, brand, admin, price, sale, members, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sale = $key->commission - 200;
            $members = $key->commission - 300;
            $stmt->bind_param("ssssddsss", $key->buyer_sku_code, $key->product_name, $key->category, $key->brand, $key->admin, $key->commission, $sale, $members, $key->seller_product_status, $key->desc);
            $stmt->execute();
            echo "Produk: " . $key->product_name . " berhasil disimpan.\n";
        }
    }
}

if (isset($_GET['act'])) {
    if ($_GET['act'] == 'prabayar') {
        sync_prabayar($conn, $api_username, $api_key);
    } elseif ($_GET['act'] == 'pasca') {
        sync_pasca($conn, $api_username, $api_key);
    } else {
        echo "Aksi tidak dikenal.";
    }
} else {
    echo "Silakan tentukan parameter action (prabayar/pasca).";
}

$conn->close();
?>
