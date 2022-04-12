let addToy = false;

const preLoadContent = () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

const loadToys = () => {
  
  fetch('http://localhost:3000/toys')
  .then((response)=> response.json())
  .then((toys)=> loadToysOnHTML(toys))
  .catch((err)=> console.log(err))
  
}

const loadToysOnHTML = (toys) => {

  for (let toy of toys) {
    toy2HTML(toy)
  }
  
}

const toy2HTML = (toy) => {
  let div, h2, img, p, button, toysCollection = document.getElementById('toy-collection');

  div = document.createElement('div')
  div.classList.add('card')

  h2 = document.createElement('h2')
  h2.innerText = toy.name

  img = document.createElement('img')
  img.classList.add('toy-avatar')
  img.src = toy.image

  p = document.createElement('p')
  p.innerText=toy.likes

  button = document.createElement('button')
  button.classList.add('like-btn')
  button.id = toy.id
  button.innerText='Like ❤️'
  button.addEventListener('click', updateLikes)

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(button)

  toysCollection.appendChild(div)
}

const reloadToys2HTML = () => {
  let toysCollection = document.getElementById('toy-collection');
  let first = toysCollection.firstElementChild;
  while(first){
    first.remove();
    first = toysCollection.firstElementChild
  }
  loadToys();
  document.getElementsByClassName('add-toy-form')[0].reset()
}

const onSubmitToy = (event) => {
  event.preventDefault()
  let userResponse = document.getElementsByClassName('input-text')
  fetch('http://localhost:3000/toys',{
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      "name": userResponse[0].value,
      "image": userResponse[1].value,
      "likes": 0
    })
  })
  .then(() => reloadToys2HTML())
  .catch((err)=> console.log(err))
}

const updateLikes = (event) => {
  
  fetch(`http://localhost:3000/toys/${event.target.id}`)
  .then((response)=> response.json())
  .then((toy)=>{

    let newNumberOfLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${event.target.id}`,{
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      method: 'PATCH',
      body: JSON.stringify({
        "likes": newNumberOfLikes
      })
    })
    .then(() => reloadToys2HTML())
  })
}

document.addEventListener("DOMContentLoaded", () => {
  preLoadContent();
  loadToys();

  let form = document.getElementsByClassName('add-toy-form')[0]
  form.addEventListener('submit', onSubmitToy)

});

