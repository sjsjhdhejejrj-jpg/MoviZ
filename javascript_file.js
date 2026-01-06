
// Sidebar ko Toggle karne ka function
function toggleMenu() {
    const sb = document.getElementById("sidebar");
    const ov = document.getElementById("overlay");
    
    if (sb.style.width === "250px") {
        closeSidebar(); // Agar khula hai to band karo
    } else {
        sb.style.width = "250px";
        ov.style.display = "block"; // Overlay dikhao
    }
}

// Sidebar ko band karne ka specific function
function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("overlay").style.display = "none";
}

// Dropdown (Year, Genre etc.) ke liye purana logic
function toggleDropdown(id, el) {
    const content = document.getElementById("filter-" + id);
    const arrow = el.querySelector(".arrow-icon");
    if (content.style.display === "block") {
        content.style.display = "none";
        if(arrow) arrow.style.transform = "rotate(0deg)";
    } else {
        content.style.display = "block";
        if(arrow) arrow.style.transform = "rotate(180deg)";
    }
}

//uppar wala only side bar




// --- PAGINATION & SEARCH FIX ---

let allEntries = []; 
let filteredEntries = [];
const postsPerPage = 2; // Ek page par 20 cards

// 1. Initial Load
window.handleBloggerData = function(json) {
    allEntries = json.feed.entry || [];
    filteredEntries = allEntries;
    if (allEntries.length > 0) {
        goToPage(1); 
    }
};

// 2. Main Search Function (With UI Toggle)
function searchMovies() {
    const query = document.getElementById("searchInput").value.trim();
    const categoriesSection = document.querySelector(".categories");
    const container = document.getElementById("movie-display-container");
    let resultHeader = document.getElementById("search-res-header");

    if (!resultHeader) {
        resultHeader = document.createElement("div");
        resultHeader.id = "search-res-header";
        resultHeader.style.cssText = "color:#82e03f; font-weight:bold; margin-bottom:15px; font-size:18px; padding:10px;";
        container.parentNode.insertBefore(resultHeader, container);
    }

    if (query === "") {
        filteredEntries = allEntries;
        if (categoriesSection) categoriesSection.style.display = "block";
        resultHeader.style.display = "none";
    } else {
        filteredEntries = allEntries.filter(entry => 
            entry.title.$t.toLowerCase().includes(query.toLowerCase())
        );
        if (categoriesSection) categoriesSection.style.display = "none";
        resultHeader.innerHTML = `Search Results for: <span style="color:#fff;">${query}</span>`;
        resultHeader.style.display = "block";
    }

    goToPage(1); // Search ke baad wapas page 1 se pagination shuru ho
}

//ycvyuvybby

window.goToPage = function(page) {
    const container = document.getElementById("movie-display-container");
    if (!container) return;
    container.innerHTML = "";

    let start = (page - 1) * postsPerPage;
    let end = start + postsPerPage;
    
    // Search result ya normal entries me se data nikalna
    let paginatedItems = filteredEntries.slice(start, end);

    let html = "";
    paginatedItems.forEach((entry, index) => {
        let title = entry.title.$t;
        let img = entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s[0-9]+.*?\//, "/s1600/") : "https://via.placeholder.com/300x450";
        
        // Yeh index number (0, 1, 2...) pass karega, jo kabhi crash nahi hota
        let globalIndex = start + index;

        html += `
            <div class="card" onclick="openPostModal(${globalIndex})">
                <img src="${img}" alt="${title}">
                <div class="card-title">${title}</div>
            </div>`;
    });

    container.innerHTML = html;
    renderPagination(filteredEntries.length, page);
    window.scrollTo(0, 0);
};


 

// 4. Pagination (1, 2, 3...) Generator
function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / postsPerPage);
    const pContainer = document.getElementById("pagination-container");
    
    if (!pContainer) return;
    pContainer.innerHTML = ""; // Purana pagination clear karein

    if (totalPages <= 1) return; // Agar 1 hi page hai to pagination na dikhayein

    // Previous Button
    if (currentPage > 1) {
        pContainer.innerHTML += `<div class="page-box" onclick="goToPage(${currentPage - 1})">« Prev</div>`;
    }

    // Numbers (1, 2, 3...)
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pContainer.innerHTML += `<div class="page-box ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</div>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pContainer.innerHTML += `<span class="page-dots">...</span>`;
        }
    }

    // Next Button
    if (currentPage < totalPages) {
        pContainer.innerHTML += `<div class="page-box" onclick="goToPage(${currentPage + 1})">Next »</div>`;
    }
}

// 5. Setup
document.addEventListener("DOMContentLoaded", function() {
    // Blogger API Load
    const s = document.createElement("script");
    s.src = "https://animflixapp.blogspot.com/feeds/posts/default?alt=json-in-script&callback=handleBloggerData&max-results=500";
    document.body.appendChild(s);

    // Search input handlers
    const input = document.getElementById("searchInput");
    if (input) {
        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter" || input.value === "") searchMovies();
        });
    }
});


// Modal open karne ka function
function openPostModal(index) {
    // Check karein index sahi hai ya nahi
    if (typeof filteredEntries[index] === 'undefined') return;

    const entry = filteredEntries[index];
    const title = entry.title.$t;
    const img = entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s[0-9]+.*?\//, "/s1600/") : "https://via.placeholder.com/300x450";
    
    // Blogger Feed settings "Full" honi chahiye tabhi post content dikhega
    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : "Content not found!");

    // UI elements ko dikhao
    const modal = document.getElementById("postModal");
    const overlay = document.getElementById("modalOverlay");
    
    if (modal && overlay) {
        modal.style.display = "block";
        overlay.style.display = "block";
        document.body.style.overflow = "hidden"; // Main page ka scroll band karein

        document.getElementById("modalBody").innerHTML = `
            <h2 style="color:#82e03f; text-align:center; padding:10px; font-size:22px;">${title}</h2>
            <div style="text-align:center;">
                <img src="${img}" style="width:100%; max-width:350px; border-radius:10px; border:2px solid #333; margin-bottom:20px; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
            </div>
            <div class="post-content-area" style="color:#eee; line-height:1.7; font-size:15px;">
                ${content}
            </div>
        `;
    }
}

// Modal ko close karne ka function
function closePostModal() {
    const modal = document.getElementById("postModal");
    const overlay = document.getElementById("modalOverlay");
    
    if (modal && overlay) {
        modal.style.display = "none";
        overlay.style.display = "none";
        document.body.style.overflow = "auto"; // Main page ka scroll wapas on karein
    }
}

// Keyboard ke 'Esc' button se bhi close karne ke liye (Extra feature)
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closePostModal();
    }
});










// Category Filter Function
function filterCategory(label) {
    const container = document.getElementById("movie-display-container");
    const categoriesSection = document.querySelector(".categories");
    
    // Search result div dikhane ke liye (agar aapne pehle wale step ka use kiya hai)
    let resultHeader = document.getElementById("search-res-header") || createResultHeader();

    // Filtering Logic: Check if post has the clicked label
    filteredEntries = allEntries.filter(entry => {
        if (entry.category) {
            // Blogger labels ko check karein
            return entry.category.some(cat => cat.term.toLowerCase() === label.toLowerCase());
        }
        return false;
    });

    // UI Updates
    if (categoriesSection) categoriesSection.style.display = "none"; // Categories hide karein
    
    resultHeader.innerHTML = `Category: <span style="color:#fff;">${label}</span>`;
    resultHeader.style.display = "block";

    if (filteredEntries.length === 0) {
        container.innerHTML = `<div class='status-msg' style='text-align:center; padding:50px;'>Is category mein abhi koi post nahi hai.</div>`;
        document.getElementById("pagination-container").innerHTML = "";
    } else {
        goToPage(1); // Filtered results dikhao
    }
    
    // Screen ke top par scroll karein
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Result Header Helper (agar miss ho gaya ho)
function createResultHeader() {
    const container = document.getElementById("movie-display-container");
    const header = document.createElement("div");
    header.id = "search-res-header";
    header.style.cssText = "color:#82e03f; font-weight:bold; margin-bottom:15px; font-size:18px; padding:10px; border-bottom: 2px solid #333;";
    container.parentNode.insertBefore(header, container);
    return header;
}




//side bar select show hide all items


    
    function toggleYear() {
        const box = document.getElementById("filter-year");
        if (box.style.display === "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }

    function toggleLang() {
        const box = document.getElementById("filter-lang");
        if (box.style.display === "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }

    function toggleGenre() {
        const box = document.getElementById("filter-genre");
        if (box.style.display === "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }








    function closeSidebar() {
        const sb = document.getElementById("sidebar");
        const ov = document.getElementById("overlay");

        sb.style.width = "0";
        ov.style.display = "none";
    }





    function showOption(type, value) {
        // 1. Trigger filter
        filterCategory(value); // Tumhara existing logic

        // 2. Sidebar band karo
        closeSidebar();
    }


// Get the container where options will be added
const filterYear = document.getElementById('filter-year');

// Generate years from 2026 down to 1980
for (let year = 2026; year >= 1980; year--) {
    const div = document.createElement('div');
    div.className = 'filter-opt';
    div.textContent = year;
    div.onclick = function() { showOption('Year', year); };
    filterYear.appendChild(div);
}




const languages = [
    "Bengali",
    "Bhojpuri",
    "Bollywood",
    "Chinese",
    "Foreign",
    "Gujarati",
    "Hindi",
    "Hollywood",
    "Japanese",
    "Kannada",
    "Korean",
    "Malayalam",
    "Marathi",
    "Others",
    "Punjabi",
    "South",
    "Tamil",
    "Telugu",
    "Turkish",
    "Urdu"
];

const filterLang = document.getElementById('filter-lang');

languages.forEach(lang => {
    const div = document.createElement('div');
    div.className = 'filter-opt';
    div.textContent = lang;
    div.onclick = function() { showOption('Language', lang); };
    filterLang.appendChild(div);
});



const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Thriller",
    "War",
    "Western"
];

const filterGenre = document.getElementById('filter-genre');

genres.forEach(genre => {
    const div = document.createElement('div');
    div.className = 'filter-opt';
    div.textContent = genre;
    div.onclick = function() { showOption('Genre', genre); };
    filterGenre.appendChild(div);
});




// QUALITY OPTIONS
const qualities = ["240p","360p","480p","720p","HD","Full HD","2K","4K"];
const filterQuality = document.getElementById('filter-quality');

// Get existing options to avoid duplicates
const existingOptions = Array.from(filterQuality.children).map(div => div.textContent.trim());

qualities.forEach(q => {
    if(!existingOptions.includes(q)){ // duplicate check
        const div = document.createElement('div');
        div.className = 'filter-opt';
        div.textContent = q;
        div.onclick = function() { showOption('Quality', q); };
        filterQuality.appendChild(div);
    }
});

// TOGGLE FUNCTION
function toggleQuality() {
    const dropdown = document.getElementById('filter-quality');
    dropdown.classList.toggle('show');
}

// Example showOption function
function showOption(type, value) {
    alert(type + ": " + value);
}




