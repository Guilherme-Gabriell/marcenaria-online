// Garante que a página abra no topo
window.onload = function () {
    window.scrollTo(0, 0);
};

// Rolagem suave para links de menu
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

console.log("Site carregado com menu de navegação ✅");
