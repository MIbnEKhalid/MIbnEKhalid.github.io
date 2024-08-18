    document.addEventListener("DOMContentLoaded", function() {
        AskForCookieConsent();
        // Get the hash from the URL
        const hash = window.location.hash.substring(1);
        const categoryFilter = document.getElementById('categoryFilter');
        if (hash) {
            // Set the dropdown to the hash value
            categoryFilter.value = hash;
            filterProducts();
        }
    });
        
        
    const products = [
        { imageURL: "https://project.mbktechstudio.com/Assets/Images/CTMCpp.png",    name: "Centre The Message Cpp",              category: "cpp",   description: "", link: "https://mbktechstudio.com/CentreTheMessageCpp/"    },
        { imageURL: "https://project.mbktechstudio.com/Assets/Images/download.svg",  name: "Unity Feedback Report System",        category: "unity", description: "", link: "https://docs.mbktechstudio.com/quiz-game-cpp-cli/" },
        { imageURL: "https://project.mbktechstudio.com/Assets/Images/cpp.png",       name: "Cpp Quiz Game",                       category: "cpp",   description: "", link: "https://docs.mbktechstudio.com/quiz-game-cpp-cli/" },
        { imageURL: "https://project.mbktechstudio.com/Assets/Images/mainpage.png",  name: "MBK Tech Studio Website",             category: "web",   description: "", link: "https://docs.mbktechstudio.com/mbktechstudio.com/" },       
    ];
            
    const productsContainer = document.querySelector('.products');
    const searchInput = document.getElementById('searchProduct');
    const categoryFilter = document.getElementById('categoryFilter');
            
    function displayProducts(productsArray) {
        productsContainer.innerHTML = "";
        if (productsArray.length === 0) {
            productsContainer.innerHTML = '<p class="nmessage">Project not found</p>';
            return;
        }
        productsArray.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.imageURL}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            `;
            //<p>Price: $${product.price}</p>
            productElement.addEventListener('click', () => {
                window.open(product.link, '_blank');
            });
        productsContainer.appendChild(productElement)
        });
    }
            
    function filterProducts() {
        const selectedCategory = categoryFilter.value;
        let filteredProducts = products;
        if (selectedCategory !== 'all') {
            filteredProducts = products.filter(product => product.category === selectedCategory);
        }
        filteredProducts = searchProducts(filteredProducts);
        displayProducts(filteredProducts);
    }
            
    function searchProducts(productsArray) {
        const searchText = searchInput.value.toLowerCase();
        return productsArray.filter(product => product.name.toLowerCase().includes(searchText));
    }
            
    categoryFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);
            
    // Initial display of all products
    displayProducts(products);