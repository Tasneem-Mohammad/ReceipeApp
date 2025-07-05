// === MASTER SCRIPT: recipe_app_gsap_enhanced.js ===

const buttonsubmit = document.querySelector('.buttonsubmit');
const searchbox = document.querySelector('.searchbox');
const recipeContainer = document.querySelector('.recipeContainer');
const receipeDetails = document.querySelector('.receipe-details');
const receipeDetailsContent = document.querySelector('.receipe-details-content');
const receipeCloseButton = document.querySelector('.receipe-close-button');
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');

// === PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.from("h1", {
    duration: 1,
    y: -30,
    opacity: 0,
    ease: "power2.out"
  });

  gsap.from("form", {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: "power2.out"
  });
});

// === THEME TOGGLE ===
themeToggleCheckbox.addEventListener('change', () => {
  document.body.classList.toggle('light-mode');
  gsap.fromTo(".fa", {
    scale: 0.7,
    rotate: -20
  }, {
    scale: 1,
    rotate: 0,
    duration: 0.5,
    ease: "back.out(1.7)"
  });
});

// === FETCH RECIPES ===
const fetchRecepies = async (q) => {
  recipeContainer.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('recepie', 'skeleton');
    skeleton.innerHTML = `
      <div style="height:300px; background:#ccc; border-radius:4px;"></div>
      <h3 style="background:#ddd; height:24px; width:60%; margin:10px auto;"></h3>
      <p style="background:#eee; height:20px; width:80%; margin:5px auto;"></p>
      <p style="background:#eee; height:20px; width:70%; margin:5px auto;"></p>
    `;
    recipeContainer.appendChild(skeleton);
  }

  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
    const response = await data.json();
    recipeContainer.innerHTML = "";

    if (!response.meals) {
      recipeContainer.innerHTML = `<h2>No recipes found!</h2>`;
      return;
    }

    response.meals.forEach((meal, index) => {
      const receipeDiv = document.createElement('div');
      receipeDiv.classList.add('recepie');
      receipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span></p>
      `;

      const button = document.createElement('button');
      button.textContent = "View Receipe";
      receipeDiv.appendChild(button);

      button.addEventListener('click', () => {
        openRecepiePopup(meal);
      });
      recipeContainer.appendChild(receipeDiv);

      gsap.from(receipeDiv, {
        duration: 0.6,
        opacity: 0,
        y: 40,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });

  } catch (error) {
    recipeContainer.innerHTML = `<h2>Error fetching recipes.</h2>`;
  }
};

// === OPEN RECIPE POPUP ===
const openRecepiePopup = (meal) => {
  receipeDetailsContent.innerHTML = `
    <h2 class="receipeName">${meal.strMeal}</h2>
    <h3>Ingredients</h3>
    <br/>
    <ul class="IngredientsList">${fetchIngredients(meal)}</ul>
    <div class="receipeInstructions">
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    </div>
  `;

  receipeDetails.style.display = "block";
  document.body.classList.add("modal-open");
  window.scrollTo({ top: 0, behavior: "smooth" });

  gsap.from(receipeDetails, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: "power3.out"
  });
};

// === CLOSE RECIPE POPUP ===
receipeCloseButton.addEventListener('click', closePopup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && receipeDetails.style.display === "block") closePopup();
});

function closePopup() {
  gsap.to(receipeDetails, {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "power1.in",
    onComplete: () => {
      receipeDetails.style.display = "none";
      document.body.classList.remove("modal-open");
      gsap.set(receipeDetails, { scale: 1, opacity: 1 });
    }
  });
}

// === EXTRACT INGREDIENTS ===
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measurement = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measurement} ${ingredient}</li>`;
    } else break;
  } 
  return ingredientsList;
};

// === SUBMIT ===
buttonsubmit.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchbox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in the search box</h2>`;
    return;
  }
  fetchRecepies(searchInput);
});
