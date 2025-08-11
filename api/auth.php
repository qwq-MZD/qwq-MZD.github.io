<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// 数据库连接
$pdo = getPDO();

// 获取POST数据
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            handleLogin($pdo, $data);
            break;
        case 'register':
            handleRegister($pdo, $data);
            break;
        default:
            echo json_encode(['success' => false, 'message' => '无效操作']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '数据库错误']);
}

function handleLogin($pdo, $data) {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // 验证输入
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => '用户名和密码不能为空']);
        return;
    }

    // 查询用户
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => '用户名或密码错误']);
        return;
    }

    // 验证密码
    if (password_verify($password, $user['password'])) {
        // 登录成功，启动会话
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        echo json_encode(['success' => true, 'message' => '登录成功']);
    } else {
        echo json_encode(['success' => false, 'message' => '用户名或密码错误']);
    }
}

function handleRegister($pdo, $data) {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // 验证输入
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => '用户名和密码不能为空']);
        return;
    }

    // 用户名规则验证
    if (!preg_match('/^[a-zA-Z0-9_]{4,20}$/', $username)) {
        echo json_encode(['success' => false, 'message' => '用户名只能包含字母、数字和下划线(4-20位)']);
        return;
    }

    // 密码长度验证
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => '密码至少需要6位']);
        return;
    }

    // 检查用户名是否存在
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => '用户名已存在']);
        return;
    }

    // 密码加密
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 创建用户
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hashedPassword]);

    echo json_encode(['success' => true, 'message' => '注册成功']);
}

// 获取PDO连接
function getPDO() {
    static $pdo;
    
    if (!$pdo) {
        $config = require '../config/db.php';
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
        
        $pdo = new PDO($dsn, $config['username'], $config['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    return $pdo;
}
?>