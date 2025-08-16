function toggleLanguage() {
    const html = document.documentElement;
    if (html.lang === 'zh - CN') {
        html.lang = 'en';
        document.querySelectorAll('.zh - CN').forEach(element => element.style.display = 'none');
        document.querySelectorAll('.en').forEach(element => element.style.display = 'block');
    } else {
        html.lang = 'zh - CN';
        document.querySelectorAll('.en').forEach(element => element.style.display = 'none');
        document.querySelectorAll('.zh - CN').forEach(element => element.style.display = 'block');
    }
}
