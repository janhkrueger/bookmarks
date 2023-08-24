// Seed value that changes on every page load
let initialSeed = Math.random();

// Seedable random number generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Function to generate a dynamic pastel color based on priority
function getPriorityColor(priority) {
  let colorSeed = initialSeed + priority;
  const red = Math.floor((seededRandom(colorSeed) * 55) + 200);
  const green = Math.floor((seededRandom(colorSeed + 1) * 55) + 200);
  const blue = Math.floor((seededRandom(colorSeed + 2) * 55) + 200);
  return `rgb(${red}, ${green}, ${blue})`;
}

// Function to fetch and load YAML
function loadYAML(yamlSource) {
  fetch(yamlSource)
    .then(response => response.text())
    .then(yamlText => {
      const doc = jsyaml.load(yamlText);
      doc.categories.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.name.localeCompare(b.name);
        }
        return a.priority - b.priority;
      });

      const output = document.getElementById('output');
      output.innerHTML = '';  // Clear previous content
      doc.categories.forEach((category) => {
        const categoryContainer = document.createElement("div");

        const titleContainer = document.createElement("div");
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';

        if (category.image) {
          const categoryImage = document.createElement("img");
          categoryImage.src = category.image;
          categoryImage.alt = category.name + " icon";
          categoryImage.style.width = '20px';
          categoryImage.style.marginRight = '10px';
          titleContainer.appendChild(categoryImage);
        }

        const categoryHeading = document.createElement("h2");
        categoryHeading.textContent = category.name;
        titleContainer.appendChild(categoryHeading);

        categoryContainer.appendChild(titleContainer);

        const categoryBox = document.createElement("div");
        categoryBox.className = "category-box";
        categoryBox.style.backgroundColor = getPriorityColor(category.priority);
        categoryBox.style.color = 'black';

        categoryContainer.appendChild(categoryBox);

        // Sort links alphabetically by title
        category.links.sort((a, b) => a.title.localeCompare(b.title));

        const linkList = document.createElement("ul");
        category.links.forEach((link) => {
          const listItem = document.createElement("li");
          const anchor = document.createElement("a");
          anchor.href = link.url;
          anchor.textContent = link.title;
          anchor.style.color = 'black';

          // Open in new tab if specified in the YAML
          if (category.openInNewTab) {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
          }

          listItem.appendChild(anchor);
          linkList.appendChild(listItem);
        });

        categoryBox.appendChild(linkList);
        output.appendChild(categoryContainer);
      });
    })
    .catch((error) => {
      console.error('There was an error:', error);
    });
}

// Automatically load the YAML source specified in the HTML data attribute when the page loads
document.addEventListener("DOMContentLoaded", function() {
  const output = document.getElementById('output');
  const yamlSource = output.getAttribute('data-yaml-source') || 'bookmarks.yaml';
  loadYAML(yamlSource);
});
