const API = "https://rickandmortyapi.com/api";
const MIN_PAGE = 1;
const MAX_PAGE = 42;

const contenedor = document.querySelector(".contenedor");
const btnTema = document.querySelector("#btn-tema");
const btnSaludar = document.querySelector("#btn-saludar");
const contenedorPersonajes = document.querySelector(".contenedorPersonajes");
const btnAnterior = document.querySelector(".btn-anterior");
const btnSiguiente = document.querySelector(".btn-siguiente");
const btnFavoritos = document.querySelector(".favoritos");
const overlay = document.querySelector(".overlay");
const containerFavorites = document.querySelector(".contenedorFavorites");
const btnCloseFavorites = document.querySelector(".closeFavorites");
const containerFavoritesList = document.querySelector(".listaPersonajes");

let open = false;
let tema = false;
let contadorPaginacion = MIN_PAGE;
let listaPersonajes = [];
let listaFavoritos = [];

const saludar = () => {
    alert("Hola Mundo!!!")
}

//Obtengo el Local storage
addEventListener("DOMContentLoaded", () => {
    if  ( localStorage.getItem("tema") === "oscuro" ){
        contenedor.classList.add("darkMode");
    }
    let numPage = localStorage.getItem("numeroPage");
    
    if (numPage){
        contadorPaginacion = Number(numPage);
        getPersonajes(contadorPaginacion);
    }else {
        getPersonajes(MIN_PAGE)
    }

    cargarPersonajesFavoritos();
    
})

//Obtengo los PJ y los cargo de forma dinamica
const getPersonajes = async (numberPage = MIN_PAGE) => {
    try {
        let response = await fetch(`${API}/character/?page=${numberPage}`);
        
        if (response.ok){
            let personajes = await response.json();
            console.log(personajes);

            listaPersonajes = personajes.results

            // Limpio el contenedor antes de cargar los nuevos personajes
            contenedorPersonajes.innerHTML = "";

            personajes.results.forEach(personaje => {
                //console.log(personaje.name)
                let card = document.createElement("div");

                card.innerHTML = `<div class="card cardPersonaje" style="width: 18rem;">
            <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
            <div class="card-body text-center">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text">${personaje.status}-${personaje.species}-${personaje.gender}</p>
                <button type="button" class="btn btn-dark" onclick="addFavoriteList(${personaje.id})">Agregar a favoritos</button>
                
            </div>
        </div>`

                contenedorPersonajes.appendChild(card);


            });

            
        }
        

        
        



    } catch (error) {
        console.log(error)
    }
}

// Boton que cambia de tema
btnTema.addEventListener("click", () => {
    tema = !tema; 
    if (tema) {
        contenedor.classList.add("darkMode");
    } else {
        contenedor.classList.remove("darkMode");
    }

    //Guardar en el local storage
    if (contenedor.classList.contains("darkMode")){
        localStorage.setItem("tema", "oscuro");
    }else {
        localStorage.setItem("tema", "claro");
    }
});

// Boton que muestra un alert saludando
btnSaludar.addEventListener("click", () => {
    saludar();
})

// Boton que cambia de pagina
btnAnterior.addEventListener("click", () => {
    if(contadorPaginacion>MIN_PAGE){
        contadorPaginacion--;
        getPersonajes(contadorPaginacion);
        localStorage.setItem("numeroPage", contadorPaginacion);
    }else{
        return
    }
    
});

// Boton que cambia de pagina
btnSiguiente.addEventListener("click", () => {
    if(contadorPaginacion<MAX_PAGE){
        contadorPaginacion++;
        getPersonajes(contadorPaginacion);
        localStorage.setItem("numeroPage", contadorPaginacion);
    }
});

// Boton que abre la seccion de favoritos

btnFavoritos.addEventListener("click", () => {
    
    if (open === false){
        overlay.classList.add("active");
        containerFavorites.classList.add("active");
        open = true;
        //console.log("abierto")
    }
    
});

btnCloseFavorites.addEventListener("click", () => {
    if (open === true) {
        overlay.classList.remove("active");
        containerFavorites.classList.remove("active");
        open = false;
        //console.log("cerrado")
    }
});

const addFavoriteList = (id) => {
    let personaje = listaPersonajes.find((p) => p.id === id);

    if (personaje) {
        //console.log(personaje.name)
    

        if(!listaFavoritos.some((fav) => fav.id === personaje.id)) {
            listaFavoritos.push(personaje);
            localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));
            renderizarFavoritos();
        }else {
            alert("Ya está en favoritos");
        }
    }

}



const cargarPersonajesFavoritos = () => {
    let personajesFavoritos = localStorage.getItem("favoritos");
    listaFavoritos = personajesFavoritos ? JSON.parse(personajesFavoritos) : [];
    renderizarFavoritos();
};

const renderizarFavoritos = () => {
    containerFavoritesList.innerHTML = ""; // Limpio lista antes de renderizar

    listaFavoritos.forEach(favorito => {
        let card = document.createElement("li");

        card.innerHTML = `
            <div class="cardPj">
                <div class="containterImg">
                    <img src="${favorito.image}" alt="${favorito.name}" class="imagenPj">
                </div>
                <h4>${favorito.name}</h4>
                <button class="btnDeletePj" onclick="borrarDeFavoritos(${favorito.id})">x</button>
            </div>`;

        containerFavoritesList.appendChild(card);
    });
};

const borrarDeFavoritos = (id) => {
    listaFavoritos = listaFavoritos.filter(personaje => personaje.id !== id);
    localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));
    renderizarFavoritos();

};

// const contenedor = document.querySelector(".contenedor");
// const btnTema = document.querySelector("#btn-tema");

// btnTema.addEventListener("click", () => {
//     contenedor.classList.toggle("darkMode");
// });

// toggle lo que hace es alternar una clase CSS en un elemento:

// Si la clase no está, la agrega.

// Si la clase ya está, la quita.