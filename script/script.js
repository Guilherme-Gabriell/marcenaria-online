// ===== CONFIGURAÇÕES GLOBAIS =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initLoadingScreen();
    initNavigation();
    initCarousels();
    initLightbox();
    initScrollReveal();
    initContactForm();
    initSmoothScroll();
    initHeaderScroll();
    
    console.log('🚀 Site Mobile Móveis Planejados carregado com sucesso!');
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simular carregamento
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remover do DOM após a transição
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);
}

// ===== NAVEGAÇÃO MÓVEL =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle do menu móvel
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animação do hambúrguer
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Resetar animação do hambúrguer
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== CARROSSÉIS =====
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const category = carousel.dataset.category;
        const track = carousel.querySelector('.carousel-track');
        const cards = track.querySelectorAll('.portfolio-card');
        const prevBtn = document.querySelector(`[data-category="${category}"].carousel-btn-prev`);
        const nextBtn = document.querySelector(`[data-category="${category}"].carousel-btn-next`);
        
        let currentIndex = 0;
        
        function getCardWidth() {
            const card = cards[0];
            if (!card) return 300;
            const cardRect = card.getBoundingClientRect();
            const cardStyle = window.getComputedStyle(card);
            const marginRight = parseInt(cardStyle.marginRight) || 24;
            return cardRect.width + marginRight;
        }
        
        function getVisibleCards() {
            const containerWidth = carousel.offsetWidth;
            const cardWidth = getCardWidth();
            return Math.max(1, Math.floor(containerWidth / cardWidth));
        }
        
        function getMaxIndex() {
            const visibleCards = getVisibleCards();
            return Math.max(0, cards.length - visibleCards);
        }
        
        function updateCarousel() {
            const cardWidth = getCardWidth();
            const translateX = -currentIndex * cardWidth;
            track.style.transform = `translateX(${translateX}px)`;
            
            // Atualizar estado dos botões
            const maxIndex = getMaxIndex();
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            // Adicionar classes visuais para botões desabilitados
            if (currentIndex === 0) {
                prevBtn.style.opacity = '0.5';
            } else {
                prevBtn.style.opacity = '1';
            }
            
            if (currentIndex >= maxIndex) {
                nextBtn.style.opacity = '0.5';
            } else {
                nextBtn.style.opacity = '1';
            }
        }
        
        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        }
        
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
        
        // Event listeners para botões
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
            });
        }
        
        // Touch/swipe support melhorado
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let hasMoved = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            hasMoved = false;
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Se o movimento horizontal é maior que o vertical, prevenir scroll vertical
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
                hasMoved = true;
            }
        }, { passive: false });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging || !hasMoved) {
                isDragging = false;
                return;
            }
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            // Mínimo de 30px para considerar swipe
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            hasMoved = false;
        }, { passive: true });
        
        // Mouse drag support melhorado
        let mouseStartX = 0;
        let isMouseDragging = false;
        let hasMouseMoved = false;
        
        track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            hasMouseMoved = false;
            track.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            
            const diff = Math.abs(e.clientX - mouseStartX);
            if (diff > 5) {
                hasMouseMoved = true;
                e.preventDefault();
            }
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!isMouseDragging || !hasMouseMoved) {
                isMouseDragging = false;
                track.style.cursor = 'grab';
                return;
            }
            
            const endX = e.clientX;
            const diff = mouseStartX - endX;
            
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isMouseDragging = false;
            hasMouseMoved = false;
            track.style.cursor = 'grab';
        });
        
        track.addEventListener('mouseleave', () => {
            isMouseDragging = false;
            hasMouseMoved = false;
            track.style.cursor = 'grab';
        });
        
        // Redimensionamento da janela
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newMaxIndex = getMaxIndex();
                if (currentIndex > newMaxIndex) {
                    currentIndex = newMaxIndex;
                }
                updateCarousel();
            }, 100);
        });
        
        // Inicializar
        setTimeout(() => {
            updateCarousel();
            track.style.cursor = 'grab';
        }, 100);
    });
}

// ===== LIGHTBOX =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    let currentImages = [];
    let currentImageIndex = 0;
    
    // Coletar todas as imagens por categoria
    function collectImages() {
        const categories = document.querySelectorAll('.portfolio-category');
        const imagesByCategory = {};
        
        categories.forEach(category => {
            const categoryName = category.querySelector('.category-title').textContent.trim();
            const images = Array.from(category.querySelectorAll('.view-btn')).map(btn => ({
                src: btn.dataset.image,
                alt: btn.closest('.portfolio-card').querySelector('h4').textContent
            }));
            imagesByCategory[categoryName] = images;
        });
        
        return imagesByCategory;
    }
    
    function openLightbox(imageSrc) {
        const imagesByCategory = collectImages();
        
        // Encontrar a categoria da imagem atual
        let foundCategory = null;
        let foundIndex = 0;
        
        Object.keys(imagesByCategory).forEach(category => {
            const index = imagesByCategory[category].findIndex(img => img.src === imageSrc);
            if (index !== -1) {
                foundCategory = category;
                foundIndex = index;
                currentImages = imagesByCategory[category];
            }
        });
        
        if (foundCategory) {
            currentImageIndex = foundIndex;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightboxImage() {
        if (currentImages.length > 0) {
            const currentImage = currentImages[currentImageIndex];
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            
            // Atualizar navegação
            lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
            lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
        }
    }
    
    function nextImage() {
        if (currentImageIndex < currentImages.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0; // Loop para o início
        }
        updateLightboxImage();
    }
    
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = currentImages.length - 1; // Loop para o final
        }
        updateLightboxImage();
    }
    
    // Event listeners
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(btn.dataset.image);
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    
    // Fechar ao clicar no overlay
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Touch/swipe no lightbox
    let lightboxStartX = 0;
    let lightboxIsDragging = false;
    
    lightboxImage.addEventListener('touchstart', (e) => {
        lightboxStartX = e.touches[0].clientX;
        lightboxIsDragging = true;
    });
    
    lightboxImage.addEventListener('touchend', (e) => {
        if (!lightboxIsDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = lightboxStartX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        
        lightboxIsDragging = false;
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.benefit-card, .portfolio-category, .process-step, .testimonial-card');
    
    // Adicionar classe reveal aos elementos
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    function checkReveal() {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }
    
    // Verificar na inicialização
    checkReveal();
    
    // Verificar no scroll
    window.addEventListener('scroll', checkReveal);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(form);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validação básica
            if (!name || !phone || !service) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Criar mensagem para WhatsApp
            let whatsappMessage = `Olá! Gostaria de solicitar um orçamento.\n\n`;
            whatsappMessage += `*Nome:* ${name}\n`;
            whatsappMessage += `*Telefone:* ${phone}\n`;
            whatsappMessage += `*Serviço:* ${service}\n`;
            
            if (message) {
                whatsappMessage += `*Mensagem:* ${message}\n`;
            }
            
            // Codificar mensagem para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=556493087411&text=${encodedMessage}`;
            
            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Limpar formulário
            form.reset();
            
            // Mostrar notificação de sucesso
            showNotification('Redirecionando para o WhatsApp...', 'success');
        });
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #10B981;
            }
            
            .notification-error {
                border-left: 4px solid #EF4444;
            }
            
            .notification-info {
                border-left: 4px solid #3B82F6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
            }
            
            .notification-message {
                flex: 1;
                margin-right: 12px;
                color: #374151;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #9CA3AF;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #374151;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// ===== LAZY LOADING DE IMAGENS =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== PERFORMANCE E OTIMIZAÇÕES =====

// Debounce function para otimizar eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para eventos frequentes
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ANALYTICS E TRACKING =====
function trackEvent(eventName, eventData = {}) {
    // Implementar tracking de eventos (Google Analytics, etc.)
    console.log('Event tracked:', eventName, eventData);
    
    // Exemplo para Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Rastrear cliques em CTAs
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary') || e.target.closest('.btn-primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            page_location: window.location.href
        });
    }
});

// ===== ACESSIBILIDADE =====
function initAccessibility() {
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        // Tab navigation melhorada
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Adicionar estilos para navegação por teclado
    const accessibilityStyles = document.createElement('style');
    accessibilityStyles.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #FF7E5F !important;
            outline-offset: 2px !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(accessibilityStyles);
}

// ===== INICIALIZAÇÃO FINAL =====
window.addEventListener('load', () => {
    initLazyLoading();
    initAccessibility();
    
    // Remover loading screen se ainda estiver presente
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
});

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

