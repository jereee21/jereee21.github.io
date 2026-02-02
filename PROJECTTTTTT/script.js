document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. NAVIGASI & HAMBURGER MENU
       ========================================= */
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle Menu saat tombol hamburger diklik
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Tutup menu otomatis saat salah satu link diklik
        document.querySelectorAll('.nav-menu li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling (Agar gerakan scroll halus)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Hanya jalankan jika link diawali tanda pagar (#)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* =========================================
       2. ANIMASI FADE-IN (INTERSECTION OBSERVER)
       ========================================= */
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Hanya animasi sekali
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product').forEach(product => {
        observer.observe(product);
    });

    /* =========================================
       3. SISTEM KERANJANG BELANJA (CART)
       ========================================= */
    
    // Cek apakah ada data tersimpan di LocalStorage? Jika tidak, buat array kosong.
    // Kita pakai nama key 'kopiCart' agar konsisten dengan halaman checkout
    let cart = JSON.parse(localStorage.getItem('kopiCart')) || [];
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.querySelector('#cart-total p');
    const addToCartButtons = document.querySelectorAll('.product .btn');

    // A. Fungsi Update Tampilan Keranjang
    function updateCartDisplay() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color:#666; font-style:italic;">Keranjang masih kosong.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                
                // Style inline untuk kerapian (bisa dipindah ke CSS)
                itemElement.style.display = 'flex';
                itemElement.style.justifyContent = 'space-between';
                itemElement.style.borderBottom = '1px solid #eee';
                itemElement.style.padding = '8px 0';
                itemElement.style.fontSize = '0.9rem';

                itemElement.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> <br>
                        <small>${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        <button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">&times;</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(itemElement);
                totalPrice += (item.price * item.quantity);
            });
        }

        // Update Total Text
        if (cartTotalElement) {
            cartTotalElement.innerText = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
        }

        // Simpan update terbaru ke LocalStorage
        localStorage.setItem('kopiCart', JSON.stringify(cart));
    }

    // B. Fungsi Menambah Barang
    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        updateCartDisplay();
        
        // Efek visual kecil (alert opsional)
        // alert(`${name} berhasil ditambahkan!`); 
    }

    // C. Event Listener Tombol "Tambah ke Keranjang"
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product');
            const productName = productCard.querySelector('h3').innerText;
            const priceText = productCard.querySelector('.price').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, '')); // Ambil angka saja

            addItemToCart(productName, price);
            
            // Animasi tombol ditekan
            button.innerText = "Terbovel!";
            setTimeout(() => button.innerText = "Tambah ke Keranjang", 1000);
        });

        // Efek Hover Tombol (opsional, untuk UX)
        button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.05)');
        button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
    });

    // D. Fungsi Hapus Item (Global Scope agar bisa diakses onclick di HTML)
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    };

    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Keranjang Anda masih kosong!");
            } else {
                // Data sudah tersimpan otomatis di localStorage 'kopiCart' lewat fungsi updateCartDisplay
                // Jadi kita tinggal redirect
                window.location.href = 'checkout.html';
            }
        });
    }

    // Panggil updateCartDisplay saat halaman pertama kali dimuat
    // untuk menampilkan data jika user kembali dari halaman lain
    updateCartDisplay();
});

/* =========================================
       5. LOGIKA FORMULIR KONTAK (WHATSAPP)
       ========================================= */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah reload halaman

            // Ambil nilai dari input
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Nomor WA Admin (GANTI DENGAN NOMOR ANDA, awali 62)
            const adminPhone = "6281212592004"; 

            // Format Pesan
            let waMessage = `Halo Admin, saya ingin bertanya.%0A%0A`;
            waMessage += `*Nama:* ${name}%0A`;
            if(email) waMessage += `*Email:* ${email}%0A`;
            waMessage += `*Pesan:*%0A${message}`;

            // Buat Link WA
            const waURL = `https://wa.me/${adminPhone}?text=${waMessage}`;

            // Buka di tab baru
            window.open(waURL, '_blank');

            // Reset form setelah kirim (opsional)
            contactForm.reset();
        });
    }