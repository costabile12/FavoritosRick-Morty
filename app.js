    const API = "https://rickandmortyapi.com/api";
    const MIN_PAGE = 1;
    const MAX_PAGE = 42;

    const contenedor = document.querySelector(".contenedor");
    const btnTema = document.querySelector("#btn-tema");
    const btnSaludar = document.querySelector("#btn-saludar");
    const contenedorPersonajes = document.querySelector(".contenedorPersonajes");
    const btnAnterior = document.querySelector(".btn-anterior");
    const btnSiguiente = document.querySelector(".btn-siguiente");
    const numberPage = document.querySelector(".contadorNumberPage")
    const btnFavoritos = document.querySelector(".favoritos");
    const overlay = document.querySelector(".overlay");
    const containerFavorites = document.querySelector(".contenedorFavorites");
    const btnCloseFavorites = document.querySelector(".closeFavorites");
    const containerFavoritesList = document.querySelector(".listaPersonajes");
    const btnCloseModal = document.querySelector(".closeModal");
    const containerModal = document.querySelector(".infoModal");
    const containerDataModal = document.querySelector(".boxData");
    const inputBuscador = document.querySelector(".buscador");

    let open = false;
    let tema = false;
    let contadorPaginacion = MIN_PAGE;
    let listaPersonajes = [];
    let listaFavoritos = [];

    const saludar = () => {
        alert("Hola Mundo!!!")
    }

    // Obtengo el LocalStorage
    addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("tema") === "oscuro") {
            contenedor.classList.add("darkMode");
        }
        let numPage = localStorage.getItem("numeroPage");

        if (numPage) {
            contadorPaginacion = Number(numPage);
            getPersonajes(contadorPaginacion);
        } else {
            
            getPersonajes(MIN_PAGE);
        }

        
        numberPage.innerText = contadorPaginacion;

        cargarPersonajesFavoritos();
    });

    // Obtengo los personajes y los cargo dinámicamente
    const getPersonajes = async (numberPage = MIN_PAGE) => {
        try {
            let response = await fetch(`${API}/character/?page=${numberPage}`);
            if (response.ok) {
                let personajes = await response.json();
                listaPersonajes = personajes.results;

                // Limpio el contenedor antes de cargar los nuevos personajes
                contenedorPersonajes.innerHTML = "";

                personajes.results.forEach(personaje => {
                    let card = document.createElement("div");
                    card.innerHTML = `
                        <div class="card cardPersonaje" style="width: 18rem;">
                            <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${personaje.name}</h5>
                                <p class="card-text">${personaje.status} - ${personaje.species} - ${personaje.gender}</p>
                                <div class="row mb-2">
                                    <div class="col">
                                        <button type="button" class="btn btn-dark w-75" onclick="addFavoriteList(${personaje.id})">Agregar a favoritos</button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <button type="button" class="btn btn-dark w-75 masInfo" onclick="openInfoCharacter(${personaje.id})">+Info</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    contenedorPersonajes.appendChild(card);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Botón que cambia de tema
    btnTema.addEventListener("click", () => {
        tema = !tema;
        if (tema) {
            contenedor.classList.add("darkMode");
        } else {
            contenedor.classList.remove("darkMode");
        }

        // Guardar en LocalStorage
        if (contenedor.classList.contains("darkMode")) {
            localStorage.setItem("tema", "oscuro");
        } else {
            localStorage.setItem("tema", "claro");
        }
    });

    // Botón que muestra un alert saludando
    btnSaludar.addEventListener("click", () => {
        saludar();
    });

    // Botón que cambia a la página anterior (carrusel infinito)
    btnAnterior.addEventListener("click", () => {
        if (contadorPaginacion > MIN_PAGE) {
            contadorPaginacion--;
        } else {
            contadorPaginacion = MAX_PAGE; // vuelve al final si estaba en la primera
        }
        numberPage.innerText = contadorPaginacion;
        getPersonajes(contadorPaginacion);
        localStorage.setItem("numeroPage", contadorPaginacion);
    });

    // Botón que cambia a la página siguiente (carrusel infinito)
    btnSiguiente.addEventListener("click", () => {
        if (contadorPaginacion < MAX_PAGE) {
            contadorPaginacion++;
        } else {
            contadorPaginacion = MIN_PAGE; // vuelve al inicio si estaba en la última
        }
        numberPage.innerText = contadorPaginacion;
        getPersonajes(contadorPaginacion);
        localStorage.setItem("numeroPage", contadorPaginacion);
    });


    // Botón que abre favoritos
    btnFavoritos.addEventListener("click", () => {
        if (!open) {
            overlay.classList.add("active");
            containerFavorites.classList.add("active");
            open = true;
        }
    });

    btnCloseFavorites.addEventListener("click", () => {
        if (open) {
            overlay.classList.remove("active");
            containerFavorites.classList.remove("active");
            open = false;
        }
    });

    // Agregar a favoritos
    const addFavoriteList = (id) => {
        let personaje = listaPersonajes.find((p) => p.id === id);
        if (personaje) {
            if (!listaFavoritos.some((fav) => fav.id === personaje.id)) {
                listaFavoritos.push(personaje);
                localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));
                alert(`Se agregó a ${personaje.name} a favoritos`);
                renderizarFavoritos();
            } else {
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
        containerFavoritesList.innerHTML = "";
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

    // Modal de +Info
    const openInfoCharacter = async (id) => {
        try {
            let response = await fetch(`${API}/character/${id}`);
            if (response.ok) {
                let personaje = await response.json();

                containerDataModal.innerHTML = `
                    <div class="card cardModal text-center mt-3 p-3">
                        <img src="${personaje.image}" alt="${personaje.name}" class="modalImg mb-3 ms-auto me-auto" style="width:200px; border-radius:10px;">
                        <h3>${personaje.name}</h3>
                        <p><b>Status:</b> ${personaje.status}</p>
                        <p><b>Species:</b> ${personaje.species}</p>
                        <p><b>Gender:</b> ${personaje.gender}</p>
                        <p><b>Origin:</b> ${personaje.origin.name}</p>
                        <p><b>Location:</b> ${personaje.location.name}</p>
                    </div>
                `;

                overlay.classList.add("active");
                containerModal.classList.add("active");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const closeModal = () => {
        overlay.classList.remove("active");
        containerModal.classList.remove("active");
    };

    btnCloseModal.addEventListener("click", closeModal);


    //Buscador de personajes

    const buscarPersonajes = async (nombre) => {
        try {
            let response = await fetch(`${API}/character/?name=${nombre}`);
            
            if(response.ok){
                let personajes = await response.json();

                listaPersonajes = personajes.results;

                contenedorPersonajes.innerHTML = "";

                listaPersonajes.forEach(personaje => {
                    let card = document.createElement("div");
                    card.innerHTML = `<div class="card cardPersonaje" style="width: 18rem;">
                            <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${personaje.name}</h5>
                                <p class="card-text">${personaje.status} - ${personaje.species} - ${personaje.gender}</p>
                                <div class="row mb-2">
                                    <div class="col">
                                        <button type="button" class="btn btn-dark w-75" onclick="addFavoriteList(${personaje.id})">Agregar a favoritos</button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <button type="button" class="btn btn-dark w-75 masInfo" onclick="openInfoCharacter(${personaje.id})">+Info</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                    contenedorPersonajes.appendChild(card);
                })


            }



        } catch (error) {
            contenedorPersonajes.innerHTML = "<p class='text-center'>No se encontraron personajes</p>";
        }
    }

    inputBuscador.addEventListener("input", (e) => {
        const valor = e.target.value.trim();
        if(valor.length > 0){
            buscarPersonajes(valor); //Busca mientras se escribre
        }else {
            getPersonajes(contadorPaginacion) // si esta vacio vuelve a la paginacion normal
        }
    })




// const contenedor = document.querySelector(".contenedor");
// const btnTema = document.querySelector("#btn-tema");

// btnTema.addEventListener("click", () => {
//     contenedor.classList.toggle("darkMode");
// });

// toggle lo que hace es alternar una clase CSS en un elemento:

// Si la clase no está, la agrega.

// Si la clase ya está, la quita.