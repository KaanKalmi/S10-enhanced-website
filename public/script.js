var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var countElement = document.getElementById('count');
var selectedCheckboxesElement = document.getElementById('selectedCheckboxes');

function countCheckedCheckboxes() {
    return Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
}

function updateCount() {
    var count = countCheckedCheckboxes();
    countElement.textContent = count + ' checkboxes selected';
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (countCheckedCheckboxes() > 5) {
            alert('You can only select 5 checkboxes at once.');
            this.checked = false;
        }
        updateCount();
        updateSelectedCheckboxes();
    });
});

updateCount();
updateSelectedCheckboxes();