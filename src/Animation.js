 const sweetEmojis = [
            '🍬', '🍭', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫', 
            '🍯', '🍮', '🍡', '🥮', '🍢', '🍦', '🍧',
            '🍨', '🍩', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯'
        ];

        function createSweetElement() {
            const sweet = document.createElement('div');
            sweet.className = 'sweet-item';
            
            // Random sweet emoji
            sweet.textContent = sweetEmojis[Math.floor(Math.random() * sweetEmojis.length)];
            
            // Random position
            sweet.style.left = Math.random() * 100 + '%';
            sweet.style.top = Math.random() * 100 + '%';
            
            // Random rotation speed
            const duration = Math.random() * 6 + 2; // 2-8 seconds
            sweet.style.animationDuration = duration + 's';
            
            // Random rotation direction
            if (Math.random() < 0.5) {
                sweet.style.animationDirection = 'reverse';
            }
            
            // Random delay
            sweet.style.animationDelay = Math.random() * 4 + 's';
            
            // Random opacity
            sweet.style.opacity = Math.random() * 0.15 + 0.05;
            
            return sweet;
        }

        function initializeBackground() {
            const background = document.getElementById('sweetBackground');
            
            // Create rotating sweets
            for (let i = 0; i < 30; i++) {
                const sweet = createSweetElement();
                background.appendChild(sweet);
            }
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeBackground();
        });




        // For Add cart Logic

        document.addEventListener('DOMContentLoaded', function () {
            const cartToggleBtn = document.getElementById('cartToggleBtn');
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            const closeCartBtn = document.getElementById('closeCartBtn');

            function openCart() {
                cartSidebar.classList.add('open');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }

            function closeCart() {
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore background scrolling
            }

            if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
            if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
            if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

            // Close cart on escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
                    closeCart();
                }
            });

            // Function to show/hide empty cart message
            function toggleEmptyCartMessage() {
                const cartItems = document.getElementById('cartItems');
                const emptyMessage = document.getElementById('emptyCartMessage');

                if (cartItems && emptyMessage) {
                    if (cartItems.children.length === 0) {
                        emptyMessage.classList.remove('hidden');
                    } else {
                        emptyMessage.classList.add('hidden');
                    }
                }
            }

            // Call this function whenever cart items change
            // You can integrate this with your existing cart update logic
            const observer = new MutationObserver(toggleEmptyCartMessage);
            const cartItems = document.getElementById('cartItems');
            if (cartItems) {
                observer.observe(cartItems, { childList: true });
            }

            // Initial check
            toggleEmptyCartMessage();
        });