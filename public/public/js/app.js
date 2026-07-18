// Qonaq axtarış interfeysinin işləmə məntiqi
document.getElementById('searchInput').addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    // Əgər axtarış sahəsi boşdursa, ekranı təmizlə
    if (query === "") {
        filterEmployees(); // İlkin boş vəziyyətə qaytarır
        return;
    }

    // Gələcəkdə bura backend API-dən real vaxtda axtarış sorğusu gələcək:
    // fetch(`/api/search?q=${encodeURIComponent(query)}`)
    //     .then(res => res.json())
    //     .then(data => renderResults(data));
});
