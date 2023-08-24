// Load YAML file via fetch API
fetch('bookmarks.yaml')
  .then(response => response.text())
  .then(yamlText => {
    // Parse YAML text to JavaScript object
    const doc = jsyaml.load(yamlText);

    // Sort categories by priority and then by name
    doc.categories.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.name.localeCompare(b.name);
      }
      return a.priority - b.priority;
    });

    const output = document.getElementById('output');

    // Iterate through each (sorted) category
    doc.categories.forEach((category) => {
      const categoryContainer = document.createElement("div");

      // Create a container for the category title and image
      const titleContainer = document.createElement("div");
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';

      // Create an image element only if the image field exists
      if (category.image) {
        const categoryImage = document.createElement("img");
        categoryImage.src = category.image;
        categoryImage.alt = category.name + " icon";
        categoryImage.style.width = '50px'; // You can customize this
        categoryImage.style.marginRight = '10px'; // Add some space between the image and the title
        titleContainer.appendChild(categoryImage);
      }

      // Create category title
      const categoryHeading = document.createElement("h2");
      categoryHeading.textContent = category.name;
      titleContainer.appendChild(categoryHeading);

      // Append titleContainer to categoryContainer
      categoryContainer.appendChild(titleContainer);

      // Create category box
      const categoryBox = document.createElement("div");
      categoryBox.className = "category-box";
      categoryContainer.appendChild(categoryBox);

      const linkList = document.createElement("ul");
      category.links.forEach((link) => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.textContent = link.title;
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
