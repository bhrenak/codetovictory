export function createToggle($element) {
  $element.addEventListener('click', handleClick);
}

function handleClick(e) {
  const $toggle = e.target;
  const collapsed = ($toggle.dataset.collapsed === 'true');
  const $inputs = $toggle.closest('section').querySelectorAll('input[type="checkbox"].container-toggle');
  $inputs.forEach( ($input) => {
    $input.checked = !collapsed;
  });
  $toggle.dataset.collapsed = !collapsed;
}