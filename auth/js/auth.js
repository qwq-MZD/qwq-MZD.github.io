document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户存储
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // 登录表单提交
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                showMessage('请输入用户名和密码', 'error');
                return;
            }
            
            // 获取存储的用户
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.username === username);
            
            if (!user) {
                showMessage('用户名不存在', 'error');
                return;
            }
            
            // 简单密码验证（实际项目中应该加密）
            if (user.password !== password) {
                showMessage('密码错误', 'error');
                return;
            }
            
            // 登录成功，存储会话
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('currentUser', username);
            
            showMessage('登录成功！即将跳转...', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        });
    }
    
    // 注册表单提交
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            
            // 验证输入
            if (!username || !password || !confirmPassword) {
                showMessage('请填写所有字段', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('两次密码输入不一致', 'error');
                return;
            }
            
            if (username.length < 4 || username.length > 20) {
                showMessage('用户名长度应在4-20个字符之间', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('密码长度至少6个字符', 'error');
                return;
            }
            
            // 检查用户名是否存在
            const users = JSON.parse(localStorage.getItem('users'));
            if (users.some(u => u.username === username)) {
                showMessage('用户名已存在', 'error');
                return;
            }
            
            // 存储用户（注意：实际项目中应该加密密码！）
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage('注册成功！即将跳转到登录页...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
    
    // 显示消息函数
    function showMessage(message, type) {
        const messageDiv = document.getElementById('authMessage') || createMessageDiv();
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
    
    function createMessageDiv() {
        const div = document.createElement('div');
        div.id = 'authMessage';
        div.style.display = 'none';
        document.querySelector('.auth-container').prepend(div);
        return div;
    }
});