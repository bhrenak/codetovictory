class Gallery {
  constructor($stage) {
    this.$scene = $stage.querySelector('.scene');
    this.$tiles = $stage.querySelectorAll('.tile');
    this.$back = $stage.querySelector('.back');
  }

  setCurrentTile(index) {
    const $tile = this.$tiles[index];
    const translate = `translateZ(${$tile.dataset.translate})`;
    this.$scene.style.setProperty('transform',translate);

    let $prevTile = $tile;
    while($prevTile) {
      $prevTile.classList.remove('fade-tile');
      $prevTile = $prevTile.previousElementSibling;
    }
    let $nextTile = $tile.nextElementSibling;
    while($nextTile) {
      $nextTile.classList.add('fade-tile');
      $nextTile = $nextTile.nextElementSibling;
    }

    this.$scene.querySelector('.current').classList.remove('current');
    $tile.classList.add('current');

    if (index >= this.$tiles.length - 1) {
      this.$back.classList.add('hide');
    } else {
      this.$back.classList.remove('hide');
    }
  }
}

export function createGallery($stage) {
  const gallery = new Gallery($stage);

  gallery.$tiles.forEach(($tile,index) => {
    $tile.addEventListener('click', () => {
      gallery.setCurrentTile(index);
    });
  });

  gallery.$back.addEventListener('click', () => {
    const $current = gallery.$scene.querySelector('.current');
    const index = [...$current.parentNode.children].indexOf($current);
    if (index < gallery.$tiles.length) {
      gallery.setCurrentTile(index);
    }
  });
}