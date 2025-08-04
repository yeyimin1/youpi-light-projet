// nav.js - Gestion dynamique de la navigation
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    // État du sidebar
    let isCollapsed = false;
    let isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Fonction pour basculer l'état du sidebar
    function toggleSidebar() {
        if (isMobile) {
            sidebar.classList.toggle('active');
        } else {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            
            // Sauvegarder l'état dans localStorage
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }
        
        // Mettre à jour l'attribut aria-expanded
        const expanded = isMobile ? sidebar.classList.contains('active') : !isCollapsed;
        menuToggle.setAttribute('aria-expanded', expanded);
    }
    
    // Fonction pour gérer le redimensionnement de la fenêtre
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (wasMobile !== isMobile) {
            if (isMobile) {
                sidebar.classList.remove('collapsed');
                content.classList.remove('collapsed');
                sidebar.classList.remove('active');
            } else {
                // Restaurer l'état précédent sur desktop
                const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
                if (savedState) {
                    sidebar.classList.add('collapsed');
                    content.classList.add('collapsed');
                    isCollapsed = true;
                }
            }
        }
    }
    
    // Charger l'état initial
    function loadInitialState() {
        if (!isMobile) {
            const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
            if (savedState) {
                sidebar.classList.add('collapsed');
                content.classList.add('collapsed');
                isCollapsed = true;
            }
        }
        menuToggle.setAttribute('aria-expanded', !isCollapsed);
    }
    
    // Gestion des clics sur les liens
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMobile) {
                sidebar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    });
    
    // Écouteurs d'événements
    menuToggle.addEventListener('click', toggleSidebar);
    window.addEventListener('resize', handleResize);
    
    // Initialisation
    loadInitialState();
    
    // Gestion dynamique du contenu
    function loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.querySelector('.content').innerHTML;
                document.querySelector('.content').innerHTML = newContent;
                
                // Mettre à jour l'URL sans recharger la page
                history.pushState(null, '', page);
            })
            .catch(err => console.error('Erreur de chargement:', err));
    }
    
    // Navigation SPA (Single Page Application)
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadContent(page);
        });
    });
    
    // Gestion du bouton retour
    window.addEventListener('popstate', function() {
        loadContent(window.location.pathname);
    });
});