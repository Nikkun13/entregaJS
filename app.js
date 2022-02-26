////////////////////////////////
// +++ Clase Constructora +++ //
////////////////////////////////

// En mi programa se crean personajes, cada uno con sus estadisticas.

class Personaje {
  //Las estadisticas ingresadas son NOMBRE, FUERZA, DEFENSA, AGILIDAD

  constructor(nombre, fuerza, defensa, agilidad) {
    this.nombre = nombre.toUpperCase();
    this.fuerza = Number(fuerza);
    this.defensa = Number(defensa);
    this.agilidad = Number(agilidad);
  }

  //Solo con esos ingresos, se calculan el resto de estadisticas de cada Personaje.

  //Calculo de vida

  calculoVida() {
    this.vida = vidaBase - this.fuerza - this.defensa - this.agilidad;
  }

  //Calculo de critico (Depende de valores del personaje rival, y tiene un minimo de 5)

  calculoCritico(agilidadEnemigo) {
    if (agilidadEnemigo < this.agilidad) {
      this.critico = (this.agilidad - agilidadEnemigo) * 2 + 5;
    } else {
      this.critico = 5;
    }
  }

  //Calculo de daño de golpe (Depende de valores del personaje rival)

  danio(defensaEnemigo) {
    this.golpe = Math.floor(
      (this.fuerza - defensaEnemigo + danioBase) * (aleatorio() * 0.004 + 0.8)
    );
  }

  //Calculo de daño de golpe critico (Depende de valores del personaje rival)

  danioCritico(defensaEnemigo) {
    this.golpe = Math.floor(
      (this.fuerza - defensaEnemigo + danioBase) *
        (aleatorio() * 0.004 + 0.8) *
        1.5
    );
  }

  //Funcion que agrega las habilidades segun sus estadisticas

  asignarHabilidades(j) {
    //Para averiguar que habilidad le corresponde a cada personaje de acuerdo con sus valores ingresados utilizo la siguiente variable "ayuda" = "a".
    //Es un array de 19 habilidades. Las dos primeras las tienen todos los personajes, pues son atacar y defender. Luego, las tres siguientes se calculan de la
    //misma manera. Para el caso de fuerza por ejemplo si tiene 1 o 2, tendran la habilidad id 3 (enfoque), si tienen 3, 4 o 5 tendran la siguiente, si tienen
    //6, 7 u 8 tendran la siguiente y si tienen 9 o 10 tendran la ultima de las habilidades de fuerza. La siguiente en el orden de id es la primera habilidad de defensa
    // y se repite el mecanismo luego con las habilidades de agilidad. Por ultimo se hace similar para la vida, solo que tienen un rango mas amplio y mayor numero de
    //habilidades. Con vida menor a 27 tienen una habilidad, entre 27 y 31 tendran otra, y asi. El valor de "a" se va eligiendo para que las habilidades fuerza sean
    // 1+a[0] (empieza en 1 porque 0 y 1 corresponder a atacar y defender), las habilidades defensa sean 5 + a[1] (en este caso empieza en 5 porque se agregan las 4
    //habilidades de fuerza), y asi, para poder elegir la habilidad correcta dentro del array de habilidades de 19 habilidades.

    let a = [0, 0, 0, 0];
    let medio = [this.fuerza, this.defensa, this.agilidad];
    for (let p = 0; p < 3; p++) {
      if (medio[p] < 3) {
        a[p] = 1;
      } else if (medio[p] < 6) {
        a[p] = 2;
      } else if (medio[p] < 9) {
        a[p] = 3;
      } else {
        a[p] = 4;
      }
    }
    if (this.vida < 27) {
      a[3] = 1;
    } else if (this.vida < 31) {
      a[3] = 2;
    } else if (this.vida < 35) {
      a[3] = 3;
    } else if (this.vida < 41) {
      a[3] = 4;
    } else {
      a[3] = 5;
    }

    //Para leer el JSON de habilidades utilizo lo siguiente

    $.ajax({
      type: "GET",
      data: "habilidades",
      url: "habilidades.json",
      dataType: "json",
      success: function (data) {
        personajes[j].habilidadAtacar = data[0];
        personajes[j].habilidadDefender = data[1];
        personajes[j].habilidadFuerza = data[1 + a[0]];
        personajes[j].habilidadDefensa = data[5 + a[1]];
        personajes[j].habilidadAgilidad = data[9 + a[2]];
        personajes[j].habilidadVida = data[13 + a[3]];
      },
    });
  }

  //Vida que posee luego de recibir daño enemigo

  vidaResultante(golpeEnemigo) {
    this.vida -= golpeEnemigo;
  }

  //Comprobar si la vida es menor igual que cero (Asigna valor 0 si resulta negativa)

  vidaCero() {
    if (this.vida <= 0) {
      this.vida = 0;
      return true;
    } else {
      return false;
    }
  }

  //Id utilizada para referirse al conjunto de imagenes del Personaje

  imagen(imgId) {
    this.imagenId = imgId;
  }
}

////////////////////////////////
// +++ Declarar Variables +++ //
////////////////////////////////

//Constantes de los personajes
const vidaBase = 50;
const danioBase = 10;
const criticoMaximo = 100;
const maxEnergia = 10;
const maxEnergiaAumentado = 13;
const energiaInicial = 5;
const energiaInicialAumentada = 6;
const nombreAleatorio = [
  //Primera Silaba del nombre
  "a",
  "ana",
  "e",
  "en",
  "se",
  "ma",
  "ni",
  "car",
  "mar",
  "ro",
  //Segunda silaba del nombre
  "co",
  "ria",
  "mi",
  "qui",
  "lu",
  "ru",
  "masi",
  "bas",
  "ti",
  "le",
  //Tercera silaba del nombre
  "no",
  "las",
  "lo",
  "cos",
  "los",
  "mo",
  "ma",
  "na",
  "to",
  "cio",
];

//Arrays de personajes
let personajeUno = [];
let personajes = [];
let personajesEnemigos = [];

//Necesarias en el desarrollo de los turnos
i = 1;
let nombreGuerrero;
let modoUnJugador = true;
let igualAgilidad = false;
let vidaIniciales;
let imagenIdUno;
let imagenIdDos;
let controlImagen = false;
let guia;
let opcionUno;
let opcionDos;
let imagenAccion = [];
let imagenAccionAgiDif = [];
let imagenAccionGolpe = [];

//Referentes a los resultados finales
let nombreGanador;
let empate = false;

//Booleanos necesarios para las habilidades, la mayoría son dobles porque cada personaje tiene su booleano
let enfoque = [false, false];
let paralizado = [false, false];
let paralizadoImagen = [false, false];
let ultimoAliento = [false, false];
let contraataque = [false, false];
let comprobarVigor = [false, false];
let atDesesperadoControl = false;
let atdesesperado = false;
let esquivo = [false, false];
let turnoDefiende = [false, false];
let controlCPU = false;

///////////////////////
// +++ Funciones +++ //
///////////////////////

//Funcion que crea un numero aleatorio entre 1 y 100

const aleatorio = () => Math.floor(Math.random() * 101);

//Funcion para crear nombres aleatorios para la CPU en funcion de 30 silabas ya cargadas

function inventarNombre() {
  return (
    nombreAleatorio[Math.floor(aleatorio() * 0.09)] +
    nombreAleatorio[Math.floor(aleatorio() * 0.09) + 10] +
    nombreAleatorio[Math.floor(aleatorio() * 0.09) + 20]
  ).toUpperCase();
}

//Funcion para crear las estadisticas de la CPU

function inventarAtributo() {
  let atributo = Math.floor(aleatorio() * 0.09) + 1;

  return atributo;
}

//Funcion que crea a los rivales CPU usando las funciones anteriormente descriptas

function crearEnemigo() {
  let nombre = inventarNombre();
  let fuerza = inventarAtributo();
  let defensa = inventarAtributo();
  let agilidad = inventarAtributo();

  return new Personaje(nombre, fuerza, defensa, agilidad);
}

//Funcion que crea los cuadros de ingreso de datos de los personajes

function submitHabilidades(jugadores, imagenes) {
  let parametros = ["nombre", "fuerza", "defensa", "agilidad"];
  if (jugadores == 1) {
    $(`#tutorial`).append(
      `<p>Tiempo de seleccionar las estadisticas de tu guerrero. Recuerda que las estadisticas solo aceptan valores enteros comprendidos entre 1 y 10.</p></br>`
    );
  } else {
    $(`#tutorial`).append(
      `<p>Tiempo de seleccionar las estadisticas de los guerreros. Recuerda que las estadisticas solo aceptan valores enteros comprendidos entre 1 y 10.</p></br>`
    );
  }
  $(`#tutorial`).append(
    `<form class="p-2 d-flex justify-content-around" id="formulario"></form>`
  );
  let valor;
  for (z = 0; z < jugadores; z++) {
    if (z == 0) {
      valor = "Uno";
    } else {
      valor = "Dos";
    }
    $(`#formulario`).append(`<section id="seccion${valor}"></section>`);
    $(`#seccion${valor}`).append(
      `</br><img src="./imagenes/inicio${imagenes[z]}.png" alt="retrato" class="volteado"><p>Guerrero:</p>`
    );
    for (const parametro of parametros) {
      if (parametro == "nombre") {
        $(`#seccion${valor}`).append(`<div class="p-1">
           <label class="input-group-addon">${
             parametro.charAt(0).toLocaleUpperCase() + parametro.slice(1)
           }:</label>
           <input type="text"
           class="form-control"
           placeholder="${
             parametro.charAt(0).toLocaleUpperCase() + parametro.slice(1)
           }"
           aria-label="${parametro}"
           id="${parametro}Guerrero${valor}"
           required></input>
         </div>`);
      } else {
        $(`#seccion${valor}`).append(`<div class="p-1">
         <label class="input-group-addon">${
           parametro.charAt(0).toLocaleUpperCase() + parametro.slice(1)
         }:</label>
         <input type="number"
         min="1"
         max="10"
         class="form-control"
         placeholder="1 - 10"
         aria-label="${parametro}"
         id="${parametro}Guerrero${valor}"
         required></input>
         </div>`);
      }
    }
  }
  $(`#formulario`)
    .append(`</br><div class="d-flex align-items-center" role="group" aria-label="Basic mixed styles example">
      <button id="btnCrearPersonaje${valor}" type="submit" class="btn btn-lg btn-dark"> Crear Personaje </button>
  </div>`);
}

//Funcion que contiene las formulas de la habilidad estandar "Atacar"
//Las siglas at y df significan atacante y defensor, aunque no siempre cumplen con su nombre, porque el atacante puede elegir defender. Mas que "atacante" y "defensor" seria como "el que realiza una accion" y "el que puede verse perjudicado por ella".

function habilidadAtacar(at, df) {
  //Con el valor de critico veo si realiza un golpe critico o uno normal

  critico = aleatorio();
  if (criticoMaximo - personajes[at].critico <= critico) {
    personajes[at].danioCritico(personajes[df].defensa);
    $(`#turnos`).append(
      `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
    );
  } else {
    personajes[at].danio(personajes[df].defensa);
  }

  //Para evitar que el defensor se "cure" con los golpes, en caso de ser negativos son cambiados a cero

  if (personajes[at].golpe < 0) {
    personajes[at].golpe = 0;
  }

  if (enfoque[at] == true) {
    //Si tiene la habilidad enfoque activada, el siguiente if se activara

    personajes[at].golpe = Math.floor(2.5 * personajes[at].golpe);
    $(`#turnos`).append(
      `<p>¡${personajes[at].nombre} desencadena el poder concentrado!.</p>`
    );
    enfoque[at] = false;
  }

  //Asigna el nuevo valor de vida resultante del rival

  personajes[df].vidaResultante(personajes[at].golpe);
  $(`#turnos`).append(
    `<p>¡${personajes[at].nombre} ocasionó ${personajes[at].golpe} puntos de daño.</p>`
  );

  //Si el rival tiene la habilidad contraataque activada, el siguiente if se activara

  if (contraataque[df] == true) {
    personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
    $(`#turnos`).append(
      `<p>¡${personajes[at].nombre} recibe ${Math.floor(
        personajes[at].golpe / 2
      )} de daño por un contrataque de ${personajes[df].nombre}</p>`
    );
    contraataque[df] = false;

    //Contraataque es la unica forma de realizar daño en el turno del rival, y la unica forma de empatar sin considerar la igualdad en agilidades, asi que hay que verificar la vida del "at"

    if (personajes[at].vidaCero() && !ultimoAliento[at]) {
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
      );
    }
  }

  //Las habilidades ofensivas regeneran 1 de energía. Luego esta el if para controlar no sobrepase el maximo. En las habilidades no se encuentra el if ya que como empiezan restando energía me aseguro nunca sobrepase el maximo

  personajes[at].energia++;
  if (personajes[at].energia > personajes[at].energiaMaxima) {
    personajes[at].energia = personajes[at].energiaMaxima;
  }
}

//Funcion que contiene las formulas de la habilidad estandar "Defender"

function habilidadDefender(at) {
  $(`#turnos`).append(`<p>¡${personajes[at].nombre} se defiende.</p>`);

  //Las habilidades defensivas regeneran 3 de energía. Nuevamente utilizo el if para controlar el límite, no siendo necesario en las habilidades por la misma razon que antes

  personajes[at].energia += 3;
  if (personajes[at].energia > personajes[at].energiaMaxima) {
    personajes[at].energia = personajes[at].energiaMaxima;
  }
}

//Funcion que contiene las formulas de las diferentes habilidades asignadas al atributo "Fuerza"

function habilidadFuerza(at, df) {
  //Lee el id de la habilidad fuerza del pesonaje

  switch (personajes[at].habilidadFuerza.id) {
    //El id 3 corresponde a la habilidad "Enfoque"

    case 3:
      //Cada habilidad empieza restando su respectivo consumo de energia

      personajes[at].energia -= 4;
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} usa Enfoque!. Concentra su poder para el próximo ataque...</p>`
      );
      enfoque[at] = true;
      personajes[at].energia += 3;

      //Para que funcione la habilidad debo colocar antes de cada accion ofensiva (puedo obviar otras habilidades de fuerza ya que los personajes no pueden usar dos habilidades de una misma rama en una misma pelea) lo siguiente:
      // if (enfoque[at]==true) {
      //   personajes[at].golpe=(Math.floor(2.5*personajes[at].golpe));
      //   $(`#turnos`).append(
      //     `<p>¡${personajes[at].nombre} desencadena el poder concentrado!.</p>`
      //   );
      //  enfoque[at]=false;
      // }

      break;

    //El id 4 corresponde a la habilidad "Golpe al punto débil"

    case 4:
      personajes[at].energia -= 5;
      critico = aleatorio();
      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(0);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(0);
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      personajes[df].vidaResultante(personajes[at].golpe);
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} golpeó el punto débil de su rival! ocasionó ${personajes[at].golpe} puntos de daño.</p>`
      );
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            personajes[at].golpe / 2
          )} de daño por un contrataque de ${personajes[df].nombre}</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;

    //El id 5 corresponde a la habilidad "Golpe en el estómago"

    case 5:
      personajes[at].energia -= 6;
      critico = aleatorio();
      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(personajes[df].defensa);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(personajes[df].defensa);
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      personajes[df].vidaResultante(personajes[at].golpe);
      personajes[df].energia -= 3;
      if (personajes[df].energia < 0) {
        personajes[df].energia = 0;
      }
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} golpeó en el estómago a su rival y lo dejó sin aliento!, ocasionó ${personajes[at].golpe} puntos de daño, y le restó algo de energía.</p>`
      );
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            personajes[at].golpe / 2
          )} de daño por un contrataque de ${personajes[df].nombre}</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;

    //El id 6 corresponde a la habilidad "Gancho en la quijada"

    case 6:
      personajes[at].energia -= 7;
      critico = aleatorio();
      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(personajes[df].defensa);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(personajes[df].defensa);
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      personajes[at].golpe = Math.floor(1.3 * personajes[at].golpe);
      personajes[df].vidaResultante(personajes[at].golpe);
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} golpeó en con un gancho a su rival!, ocasionó ${personajes[at].golpe} puntos de daño, y puede paralizarlo.</p>`
      );

      //Genero un numero aleatorio, y lo comparo con un valor de 50. Si es mayor, se activa el efecto de paralisis

      let paralisis = aleatorio();
      if (paralisis > 50) {
        $(`#turnos`).append(
          `<p>¡${personajes[df].nombre} quedó paralizado! perderá la acción de su próximo movimiento.</p>`
        );
        paralizado[df] = true;
      } else {
        $(`#turnos`).append(
          `<p>¡${personajes[df].nombre} no quedó paralizado!.</p>`
        );
      }
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            personajes[at].golpe / 2
          )} de daño por un contrataque de ${personajes[df].nombre}</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;
  }
}

//Funcion que contiene las formulas de las diferentes habilidades asignadas al atributo "Defensa"

function habilidadDefensa(at, df) {
  //Lee el id de la habilidad defensa del pesonaje

  switch (personajes[at].habilidadDefensa.id) {
    //El id 7 corresponde a la habilidad "Plantado"

    case 7:
      personajes[at].energia -= 4;
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} se defiende plantado en el suelo, y recupera el aliento.</p>`
      );
      personajes[at].energia += 8;
      if (personajes[at].energia > personajes[at].energiaMaxima) {
        personajes[at].energia = personajes[at].energiaMaxima;
      }
      break;

    //El id 8 corresponde a la habilidad "Golpe con escudo"

    case 8:
      personajes[at].energia -= 5;
      critico = aleatorio();

      //Basicamente lo que dice la descripcion de la habilidad es que agrega el valor de defensa a la formula de daño. Para no hacer otra formula diferente a la del metodo en la clase constructora, en vez de ingresar solo con la personajes[df].defensa en la formula de danio, agrego "personajes[df].defensa-personajes[at].defensa". De esta forma ingresa el valor defensa con el signo que quiero a la ecuacion del metodo sin cambiar nada.

      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(
          personajes[df].defensa - personajes[at].defensa
        );
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(personajes[df].defensa - personajes[at].defensa);
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      if (enfoque[at] == true) {
        personajes[at].golpe = Math.floor(2.5 * personajes[at].golpe);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} desencadena el poder concentrado!.</p>`
        );
        enfoque[at] = false;
      }
      personajes[df].vidaResultante(personajes[at].golpe);
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} ocasionó ${personajes[at].golpe} puntos de daño golpeando con su escudo!.</p>`
      );
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            personajes[at].golpe / 2
          )} de daño por un contrataque de ${personajes[df].nombre}</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;

    //El id 9 corresponde a la habilidad "Contraataque"

    case 9:
      personajes[at].energia -= 6;
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} se defiende, mientras espera lanzar un contrataque</p>`
      );
      personajes[at].energia += 3;

      //En cada accion ofensiva debo colocar:
      // if (contraataque[df]==true){
      //   personajes[at].vidaResultante(Math.floor(personajes[at].golpe/2));
      //   $(`#turnos`).append(
      //     `<p>¡${personajes[at].nombre} recibe ${Math.floor(personajes[at].golpe/2)} de daño por un contrataque de ${personajes[df].nombre}</p>`
      //   );
      //   contraataque[df]=false;
      //   if (personajes[at].vidaCero()) {
      //     $(`#turnos`).append(
      //       `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
      //     );
      //   }
      //}

      break;

    //El id 10 corresponde a la habilidad "Defensa de hierro"

    case 10:
      personajes[at].energia -= 7;
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} se defiende con todo, es una montaña inamovible!.</p>`
      );
      comprobarVigor[at] = true;
      personajes[at].energia += 3;
      break;
  }
}

//Funcion que contiene las formulas de las diferentes habilidades asignadas al atributo "Agilidad"

function habilidadAgilidad(at, df) {
  //Lee el id de la habilidad agilidad del pesonaje

  switch (personajes[at].habilidadAgilidad.id) {
    //El id 11 corresponde a la habilidad "Ataque desesperado"

    case 11:
      personajes[at].energia -= 4;
      if (atdesesperado == true) {
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} ataca primero en un movimiento desesperado!.</p>`
        );
      }

      //Ataque desesperado lo que hace es intercambiar el orden de los personajes, y luego realiza el ataque normalmente. El orden no lo cambio aca, lo hago en otro lado, asi que aca solo esta el ataque normal

      habilidadAtacar(at, df);
      break;

    //El id 12 corresponde a la habilidad "Ataque rápido"

    case 12:
      personajes[at].energia -= 5;
      critico = aleatorio();

      //Mismo caso que antes (golpe con escudo), solo que aca agrego el valor de agilidad en vez del de defensa

      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(
          personajes[df].defensa - personajes[at].agilidad
        );
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(personajes[df].defensa - personajes[at].agilidad);
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      if (enfoque[at] == true) {
        personajes[at].golpe = Math.floor(2.5 * personajes[at].golpe);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} desencadena el poder concentrado!.</p>`
        );
        enfoque[at] = false;
      }
      personajes[df].vidaResultante(personajes[at].golpe);
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} ocasionó ${personajes[at].golpe} puntos de daño golpeando rápidamente!.</p>`
      );
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(Math.floor(personajes[at].golpe / 2));
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            personajes[at].golpe / 2
          )} de daño por un contrataque de ${personajes[df].nombre}</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;

    //El id 13 corresponde a la habilidad "Esquiva asombrosa"

    case 13:
      personajes[at].energia -= 6;
      if (igualAgilidad == false && at == 0) {
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} se prepara para esquivar el ataque.</p>`
        );
      }
      if (turnoDefiende[df] == false) {
        if (esquivo[at] == true) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} esquivó con éxito.</p>`
          );
        } else {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} no pudo esquivar.</p>`
          );
        }
      } else {
        esquivo[at] = true;
        imagenAccion[at] = `esquiva${personajes[at].imagenId}.png`;
        imagenAccionAgiDif[at] = `esquiva${personajes[at].imagenId}.png`;
        $(`#turnos`).append(
          `<p>${personajes[at].nombre} intenta esquivar, pero no tiene efecto ante la accion defensiva.</p>`
        );
      }
      personajes[at].energia += 3;
      break;

    //El id 14 corresponde a la habilidad "Ataque Ráfaga"

    case 14:
      personajes[at].energia -= 7;
      critico = aleatorio();

      //A diferencia de los casos anteriores, aca quiero eliminar el atributo fuerza de la ecuacion y reemplazarlo por el de agilidad. Para ello sumo fuerza[at] que se cancelaria con la que ya se encuentra en el metodo, y resto agilidad[at] que es el valor que quiero

      if (criticoMaximo - personajes[at].critico <= critico) {
        personajes[at].danioCritico(
          personajes[df].defensa +
            personajes[at].fuerza -
            personajes[at].agilidad
        );
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} realiza un golpe crítico!</p>`
        );
      } else {
        personajes[at].danio(
          personajes[df].defensa +
            personajes[at].fuerza -
            personajes[at].agilidad
        );
      }
      if (personajes[at].golpe < 0) {
        personajes[at].golpe = 0;
      }
      personajes[at].golpe = Math.floor(personajes[at].golpe / 2.5);
      if (enfoque[at] == true) {
        personajes[at].golpe = Math.floor(2.5 * personajes[at].golpe);
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} desencadena el poder concentrado!.</p>`
        );
        enfoque[at] = false;
      }

      //En vez de pegar una sola vez, esta habilidad pega tres veces. El valor de daño de un golpe es menor (ya que se divide por 2.5), pero al pegar mas veces termina siendo mayor el total. Tanto el enfoque como el contraataque consideran los 3 golpes

      let golpeUno = Math.floor(
        personajes[at].golpe * (aleatorio() * 0.004 + 0.8)
      );
      let golpeDos = Math.floor(
        personajes[at].golpe * (aleatorio() * 0.004 + 0.8)
      );
      let golpeTres = Math.floor(
        personajes[at].golpe * (aleatorio() * 0.004 + 0.8)
      );
      personajes[df].vidaResultante(golpeUno + golpeDos + golpeTres);
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} ocasionó ${golpeUno}, ${golpeDos} y ${golpeTres} puntos de daños en tres golpes consecutivos!.</p>`
      );
      if (contraataque[df] == true) {
        personajes[at].vidaResultante(
          Math.floor(golpeUno / 2) +
            Math.floor(golpeDos / 2) +
            Math.floor(golpeTres / 2)
        );
        $(`#turnos`).append(
          `<p>¡${personajes[at].nombre} recibe ${Math.floor(
            golpeUno / 2
          )},${Math.floor(golpeDos / 2)},
          ${Math.floor(golpeTres / 2)}  de daño por un contrataque de ${
            personajes[df].nombre
          }!</p>`
        );
        contraataque[df] = false;
        if (personajes[at].vidaCero() && !ultimoAliento[at]) {
          $(`#turnos`).append(
            `<p>¡${personajes[at].nombre} ha muerto por el daño de contraataque!</p>`
          );
        }
      }
      personajes[at].energia++;
      break;
  }
}

//Funcion que controla las elecciones de la CPU

function iaCPU() {
  //Si tiene poca energía no podrá usar habilidades. La única habilidad "perjudicial" es ataque desesperado, el resto no importa tanto, por lo que cuidaré de que no elija esa opción tan facil. Tambien voy a cuidar de que no use efoque dos veces.

  //Declaro el array de opciones, un valor aleatorio para la eleccion y la eleccion final

  let opcionesCPU = [1, 2];
  let valorCPU = aleatorio();
  let eleccionCPU = 0;

  //Agrego al array de opciones el resto de las habilidades si tienen energía suficiente

  if (
    personajes[0 ** guia].energia >= personajes[0 ** guia].habilidadFuerza.coste
  ) {
    opcionesCPU.push(3);
  }
  if (
    personajes[0 ** guia].energia >=
    personajes[0 ** guia].habilidadDefensa.coste
  ) {
    opcionesCPU.push(4);
  }
  if (personajes[0 ** guia].habilidadAgilidad.id == 11) {
    //En un primer momento habia puesto if (personajes[0 ** guia].habilidadAgilidad.id |= 11) para no tener que usar el else if... pero por alguna razon extraña, usar la oracion anterior cambiaba el id de la habilidad agilidad en 15... nunca saber porque, de esta manera que lo escribi funciona bien al menos.
  } else if (
    personajes[0 ** guia].energia >=
    personajes[0 ** guia].habilidadAgilidad.coste
  ) {
    opcionesCPU.push(5);
  }

  //Sabiendo que 1 corresponde a ataque, 2 a defensa, y 3,4 y 5 a las diferentes habilidades, selecciono aleatoriamente uno de esos 5 numeros.

  switch (opcionesCPU.length) {
    case 2:
      if (valorCPU <= 65) {
        eleccionCPU = opcionesCPU[0];
      } else {
        eleccionCPU = opcionesCPU[1];
      }

      break;

    case 3:
      if (valorCPU <= 45) {
        eleccionCPU = opcionesCPU[0];
      } else if (valorCPU > 45 && valorCPU < 55) {
        eleccionCPU = opcionesCPU[1];
      } else {
        eleccionCPU = opcionesCPU[2];
      }

      break;

    case 4:
      if (valorCPU <= 20) {
        eleccionCPU = opcionesCPU[0];
      } else if (valorCPU > 20 && valorCPU < 30) {
        eleccionCPU = opcionesCPU[1];
      } else if (valorCPU >= 31 && valorCPU <= 65) {
        eleccionCPU = opcionesCPU[2];
      } else {
        eleccionCPU = opcionesCPU[3];
      }

      break;

    case 5:
      if (valorCPU <= 15) {
        eleccionCPU = opcionesCPU[0];
      } else if (valorCPU > 15 && valorCPU < 20) {
        eleccionCPU = opcionesCPU[1];
      } else if (valorCPU >= 21 && valorCPU < 48) {
        eleccionCPU = opcionesCPU[2];
      } else if (valorCPU >= 48 && valorCPU < 75) {
        eleccionCPU = opcionesCPU[3];
      } else {
        eleccionCPU = opcionesCPU[4];
      }

      break;
  }

  //El siguiente es un control para que no use enfoque 2 veces seguidas

  if (controlCPU == true && eleccionCPU == 3) {
    eleccionCPU = 1;
    controlCPU = false;
  }
  if (personajes[0 ** guia].habilidadFuerza.id == 3 && eleccionCPU == 3) {
    controlCPU = true;
  }

  //El siguiente es un arreglo para que utilice ataque desesperado solo cuando sirve hacerlo

  if (
    personajes[0 ** guia].habilidadAgilidad.id == 11 &&
    personajes[0 ** guia].vida < 0.25 * vidaIniciales[0 ** guia] &&
    personajes[0 ** guia].energia >= 4
  ) {
    eleccionCPU = 5;
  }

  return eleccionCPU;
}

//Funcion que contiene las formulas de las diferentes habilidades asignadas al atributo "Vida"

function habilidadVida(at) {
  //Lee el id de la habilidad vida del pesonaje

  switch (personajes[at].habilidadVida.id) {
    case 15:
      //NADA, se resuelve fuera de esto
      break;
    case 16:
      //NADA, se resuelve fuera de esto
      break;
    case 17:
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} regenera 1 de energía adicional gracias a Meditación!.</p>`
      );
      personajes[at].energia++;
      if (personajes[at].energia > personajes[at].energiaMaxima) {
        personajes[at].energia = personajes[at].energiaMaxima;
      }
      break;
    case 18:
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} regenera 1 de vida gracias a Regeneración!.</p>`
      );
      personajes[at].vida++;
      if (personajes[at].vida > vidaIniciales[at]) {
        personajes[at].vida = vidaIniciales[at];
      }
      break;
    case 19:
      $(`#turnos`).append(
        `<p>¡${personajes[at].nombre} regenera 2 de vida gracias a Revitalización!.</p>`
      );
      personajes[at].vida += 2;
      if (personajes[at].vida > vidaIniciales[at]) {
        personajes[at].vida = vidaIniciales[at];
      }
      break;
  }
}

//Funcion que lee la eleccion realizada por los guerreros en un turno y asigna los cambios necesarios a los booleanos y estadisticas antes de entrar en las distintas funciones de habilidad
//Se llama verDefensa ya que inicialmente solo cambiaba los valores de la defensa, ya que seleccionar una opcion defensiva otorga 3 de defensa en ese turno, y necesitaba que el valor estuviera visible antes de usar las habilidades, pero luego le agregue todas las cosas que tambien necesitaba agregar ademas de la defensa, asi que el titulo quedo poco abarcativo

function verDefensa(opcion, j) {
  switch (opcion) {
    //Opcion 1 es para ataque estandar

    case 1:
      imagenAccion[j] = `ataque${personajes[j].imagenId}.png`; //Se usa para representar la accion del guerrero. Si la agilidad es igual solo se usa esta.
      imagenAccionAgiDif[j] = `inicio${personajes[j].imagenId}.png`; //Se usa para representar la reaccion del guerrero a la accion defensiva de su rival. No se usa si la agilidad es igual.
      imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`; //Se usa para representar la reaccion del guerrero a la accion ofensiva de su rival. No se usa si la agilidad es igual.
      break;

    //Opcion 2 es para defensa estandar

    case 2:
      personajes[j].defensa += 3;

      //El turnoDefiende es un booleano necesario en la habilidad esquiva asombrosa, ya que si el rival no ataca, sino que se defiende, el usuario de esquiva asombrosa no tiene nada que esquivar. Solo para que no diga que esquivó el ataque si nadie lo atacó

      turnoDefiende[j] = true;
      imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
      imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
      imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
      break;

    //Opcion 3 es para las habilidades de fuerza. Dentro compara los id de cada habilidad para realizar los cambios necesarios

    case 3:
      if (personajes[j].habilidadFuerza.id == 3) {
        personajes[j].defensa += 3;
        turnoDefiende[j] = true;
        imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
      } else {
        imagenAccion[j] = `ataque${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `inicio${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`;
      }
      break;

    //Opcion 4 es para las habilidades de defensa. Dentro compara los id de cada habilidad para realizar los cambios necesarios

    case 4:
      if (personajes[j].habilidadDefensa.id == 7) {
        personajes[j].defensa += 4;
        turnoDefiende[j] = true;
        imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
      } else if (personajes[j].habilidadDefensa.id == 9) {
        personajes[j].defensa += 3;

        //Aca se activa el booleano contraataque

        contraataque[j] = true;
        turnoDefiende[j] = true;
        imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
      } else if (personajes[j].habilidadDefensa.id == 10) {
        personajes[j].defensa += 8;
        turnoDefiende[j] = true;
        imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
      } else {
        imagenAccion[j] = `ataque${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `inicio${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`;
      }
      break;

    //Opcion 5 es para las habilidades de agilidad. Dentro compara los id de cada habilidad para realizar los cambios necesarios

    case 5:
      if (personajes[j].habilidadAgilidad.id == 13) {
        personajes[j].defensa += 3;

        //Aca se puede activar el booleano esquivo

        let valor = aleatorio();
        if (valor >= 50) {
          esquivo[j] = true;
          imagenAccion[j] = `esquiva${personajes[j].imagenId}.png`;
          imagenAccionAgiDif[j] = `esquiva${personajes[j].imagenId}.png`;
          imagenAccionGolpe[j] = `esquiva${personajes[j].imagenId}.png`;
        } else {
          imagenAccion[j] = `defensa${personajes[j].imagenId}.png`;
          imagenAccionAgiDif[j] = `defensa${personajes[j].imagenId}.png`;
          imagenAccionGolpe[j] = `defensa${personajes[j].imagenId}.png`;
        }
        turnoDefiende[j] = true;
      } else if (personajes[j].habilidadAgilidad.id == 11) {
        personajes[j].defensa -= 3;

        //Aca se activa el booleano atdesesperado, si ya estaba activo significa que ambos jugadores eligieron la misma habilidad, por lo que no hay cambios de turnos entonces. El atDesesperadoControl es un contro necesario para que se muestren correctamente las imagenes en caso de que tengan la misma agilidad y sea el segundo quien utilice la habilidad

        if (j == 0) {
          atDesesperadoControl = true;
        }
        if (atdesesperado == true) {
          $(`#turnos`).append(
            `<p>Ambos personajes usan ataque desesperado, el orden final no cambia.</p>`
          );
          atdesesperado = false;
        } else {
          if (personajes[j].agilidad > personajes[0 ** j].agilidad) {
            $(`#turnos`).append(
              `<p>${personajes[j].nombre} es más rápido que su rival, ataque desesperado es ineficaz...</p>`
            );
          } else {
            atdesesperado = true;
          }
        }
        imagenAccion[j] = `ataque${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `inicio${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`;
      } else {
        imagenAccion[j] = `ataque${personajes[j].imagenId}.png`;
        imagenAccionAgiDif[j] = `inicio${personajes[j].imagenId}.png`;
        imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`;
      }
      break;

    //Opcion 6 es para cuando el personaje sufre paralizis. No puede ser elegida por el usuario

    case 6:
      imagenAccion[j] = `empate${personajes[j].imagenId}.png`;
      imagenAccionAgiDif[j] = `empate${personajes[j].imagenId}.png`;
      imagenAccionGolpe[j] = `golpeado${personajes[j].imagenId}.png`;
      break;
  }
}

//Funcion que vuelve a la normalidad todos los cambios de booleanos y estadisticas sufridos a lo largo del turno, para que esten listos en su posicion original en el nuevo turno. Nuevamente se llama resetDefensa porque al principio modificaba solo a la defensa pero ahora hace mas cosas

function resetDefensa(opcion, j) {
  switch (opcion) {
    case 1:
      //No hay reset en esta opcion
      break;
    case 2:
      personajes[j].defensa -= 3;

      //Esta, y cada accion defensiva, prevee el paralisis

      if (paralizado[j] == true) {
        paralizado[j] = false;
        $(`#turnos`).append(
          `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
        );
      }
      break;
    case 3:
      if (personajes[j].habilidadFuerza.id == 3) {
        personajes[j].defensa -= 3;
        if (paralizado[j] == true) {
          paralizado[j] = false;
          $(`#turnos`).append(
            `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
          );
        }
      }
      break;
    case 4:
      if (personajes[j].habilidadDefensa.id == 7) {
        personajes[j].defensa -= 4;
        if (paralizado[j] == true) {
          paralizado[j] = false;
          $(`#turnos`).append(
            `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
          );
        }
      } else if (personajes[j].habilidadDefensa.id == 9) {
        personajes[j].defensa -= 3;
        if (paralizado[j] == true) {
          paralizado[j] = false;
          $(`#turnos`).append(
            `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
          );
        }
      } else if (personajes[j].habilidadDefensa.id == 10) {
        personajes[j].defensa -= 8;
        if (paralizado[j] == true) {
          paralizado[j] = false;
          $(`#turnos`).append(
            `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
          );
        }
      }
      break;
    case 5:
      if (personajes[j].habilidadAgilidad.id == 13) {
        personajes[j].defensa -= 3;
        if (paralizado[j] == true) {
          paralizado[j] = false;
          $(`#turnos`).append(
            `<p>¡${personajes[j].nombre} se recupera de la paralisis al haber estado en guardia.</p>`
          );
        }
      } else if (personajes[j].habilidadAgilidad.id == 11) {
        personajes[j].defensa += 3;
      }
      break;
    case 6:
      break;
  }
}

//Funcion que lee la opcion elegida por el personaje y desencadena la funcion que resuelve la accion

function resuelveEleccion(opcion, causante, afectado) {
  switch (opcion) {
    case 1:
      habilidadAtacar(causante, afectado);
      break;
    case 2:
      habilidadDefender(causante, afectado);
      break;
    case 3:
      habilidadFuerza(causante, afectado);
      break;
    case 4:
      habilidadDefensa(causante, afectado);
      break;
    case 5:
      habilidadAgilidad(causante, afectado);
      break;
    case 6:
      $(`#turnos`).append(
        `<p>¡${personajes[causante].nombre} está paralizado.</p>`
      );
      if (turnoDefiende[afectado] == false && igualAgilidad) {
        imagenAccion[causante] = `golpeado${personajes[causante].imagenId}.png`;
      }
      paralizadoImagen[causante] = true;
      break;
  }
}

//Funcion que lee y guarda el historial de batallas en el Local Storage
function historialBatallas() {
  let historialUno = JSON.parse(localStorage.getItem("HistorialUno"));
  let historialDos = JSON.parse(localStorage.getItem("HistorialDos"));
  let historialCPU = JSON.parse(localStorage.getItem("HistorialCPU"));

  if (historialUno == null) {
    historialUno = [
      { resultado: "Victorias", cantidad: 0 },
      { resultado: "Derrotas", cantidad: 0 },
      { resultado: "Empates", cantidad: 0 },
    ];
    historialDos = [
      { resultado: "Victorias", cantidad: 0 },
      { resultado: "Derrotas", cantidad: 0 },
      { resultado: "Empates", cantidad: 0 },
    ];
    historialCPU = [
      { resultado: "Victorias", cantidad: 0 },
      { resultado: "Derrotas", cantidad: 0 },
      { resultado: "Empates", cantidad: 0 },
    ];
  }

  if (empate) {
    historialUno[2].cantidad++;
    if (modoUnJugador) {
      historialCPU[2].cantidad++;
    } else {
      historialDos[2].cantidad++;
    }
  } else if (nombreGuerrero == nombreGanador) {
    historialUno[0].cantidad++;
    if (modoUnJugador) {
      historialCPU[1].cantidad++;
    } else {
      historialDos[1].cantidad++;
    }
  } else {
    historialUno[1].cantidad++;
    if (modoUnJugador) {
      historialCPU[0].cantidad++;
    } else {
      historialDos[0].cantidad++;
    }
  }

  localStorage.setItem("HistorialUno", JSON.stringify(historialUno));
  localStorage.setItem("HistorialDos", JSON.stringify(historialDos));
  localStorage.setItem("HistorialCPU", JSON.stringify(historialCPU));
  dibujarTabla(historialUno, historialCPU, historialDos);
}

//Funcion que dibuja una tabla con la infromacion del historial de batalla
function dibujarTabla(historialUno, historialCPU, historialDos) {
  $(`#historial`).append(`<br><h3><u><b>Historial de Batallas</b></u></h3></br>
          <table id="tablaHistorial" class="table">
              <thead>
                  <tr>
                  <th scope="col">#</th>
                      <th scope="col">Victorias</th>
                      <th scope="col">Derrotas</th>
                      <th scope="col">Empates</th>
                      <th scope="col">Total Batallas</th>
                  </tr>
              </thead>
  
              <tbody id="bodyTabla">
              </tbody>
          </table>
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
              <button id="btnBorrarHistorial" type="button" class="btn btn-lg btn-dark"> Borrar Historial </button>
          </div>
      `);
  for (j = 0; j < 3; j++) {
    switch (j) {
      case 0:
        $(`#bodyTabla`).append(`<tr><th scope="row">Guerrero Uno</th>
                    <td>${historialUno[0].cantidad}</td>
                    <td>${historialUno[1].cantidad}</td>
                    <td>${historialUno[2].cantidad}</td>
                    <td>${
                      historialUno[0].cantidad +
                      historialUno[1].cantidad +
                      historialUno[2].cantidad
                    }</td></tr>`);
        break;
      case 1:
        $(`#bodyTabla`).append(`<tr><th scope="row">Guerrero CPU</th>
          <td>${historialCPU[0].cantidad}</td>
          <td>${historialCPU[1].cantidad}</td>
          <td>${historialCPU[2].cantidad}</td>
          <td>${
            historialCPU[0].cantidad +
            historialCPU[1].cantidad +
            historialCPU[2].cantidad
          }</td></tr>`);
        break;
      case 2:
        $(`#bodyTabla`).append(`<tr><th scope="row">Guerrero Dos</th>
          <td>${historialDos[0].cantidad}</td>
          <td>${historialDos[1].cantidad}</td>
          <td>${historialDos[2].cantidad}</td>
          <td>${
            historialDos[0].cantidad +
            historialDos[1].cantidad +
            historialDos[2].cantidad
          }</td></tr>`);
        break;
    }
  }
  $(`#btnBorrarHistorial`).on("click", botonBorrarHistorial);
}

//////////////////////
// +++ Programa +++ //
//////////////////////

$(`#modo`).append(`<p>¡Bienvenidos al Simulador de batallas!</p>`);
$(`#tutorial`)
  .append(`<p>Dotarás a tu guerrero de estadísticas que lo ayudaran en una épica batalla contra oponentes en igualdad de condiciones. Eligiendo su Fuerza, Defensa y Agilidad, se creará un luchador para que puedan combatir ya sea contra un amigo o contra enemigos generados aleatoriamente. Básicamente la fuerza controla tu poder de ataque, la defensa tu capacidad de resistir daño, y la agilidad quien ataca primero y su probabilidad de realizar un golpe crítico (golpe con daño aumentado).</p>
                                <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic mixed styles example">
                                    <button id="btnComencemos" type="button" class="btn btn-lg btn-dark"> ¡COMENCEMOS! </button>
                                </div> `);
$(`#btnComencemos`).on("click", botonComencemos);

//////////////////////////////////
// +++ Funciones de eventos +++ //
//////////////////////////////////

//Funcion que borra el contenido del HTML y escribe el selector de modo

function botonComencemos() {
  $(`#modo`).empty();
  $(`#tutorial`).empty();
  $(`#modo`).append(`<p>MODO: </p>`);
  $(`#tutorial`).append(`<p>Primero selecciona un modo de juego</p>
                                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button id="btnUnJugador" type="button" class="btn btn-lg btn-dark"> 1 vs CPU </button>
                                </div>
                                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button id="btnDosJugadores" type="button" class="btn btn-lg btn-dark"> 1 vs 1 </button>
                                </div>  `);
  $(`#btnUnJugador`).on("click", botonUnJugador);
  $(`#btnDosJugadores`).on("click", botonDosJugadores);
}

//Funcion que borra el contenido del HTML y escribe el formulario para modo 1 jugador

function botonUnJugador() {
  $(`#modo`).empty();
  $(`#tutorial`).empty();
  $(`#modo`).append(`<p>MODO: 1 VS CPU</p>`);
  imagenIdUno = Math.floor(aleatorio() * 0.09) + 1;
  let imagenArray = [imagenIdUno];
  submitHabilidades(1, imagenArray);
  $(`#formulario`).submit(botonCrearPersonaje);
}

//Funcion que borra el contenido del HTML y escribe el formulario para modo 2 jugadores

function botonDosJugadores() {
  modoUnJugador = false;
  $(`#modo`).empty();
  $(`#tutorial`).empty();
  $(`#modo`).append(`<p>MODO: 1 VS 1</p>`);
  imagenIdUno = Math.floor(aleatorio() * 0.09) + 1;

  //Arreglo para que las imagenes de los guerreros sean diferentes. Hago lo mismo con el modo CPU

  do {
    imagenIdDos = Math.floor(aleatorio() * 0.09) + 1;
  } while (imagenIdUno == imagenIdDos);
  let imagenArray = [imagenIdUno, imagenIdDos];
  submitHabilidades(2, imagenArray);
  $(`#formulario`).submit(botonCrearPersonajes);
}

//Funcion que crea el personaje del usuario y los personajes enemigos. Modo 1 jugador

function botonCrearPersonaje(e) {
  e.preventDefault();
  personajeUno = new Personaje(
    $("#nombreGuerreroUno").val(),
    $("#fuerzaGuerreroUno").val(),
    $("#defensaGuerreroUno").val(),
    $("#agilidadGuerreroUno").val()
  );
  personajeUno.calculoVida();
  personajeUno.imagen(imagenIdUno);
  nombreGuerrero = personajeUno.nombre;
  $(`#tutorial`).remove();

  //Creo 4 personajes enemigos

  let personajeEnemigoUno = crearEnemigo();
  personajeEnemigoUno.calculoVida();
  let imagenIdEnemigoUno;
  do {
    imagenIdEnemigoUno = Math.floor(aleatorio() * 0.09) + 1;
  } while (imagenIdUno == imagenIdEnemigoUno);
  personajeEnemigoUno.imagen(imagenIdEnemigoUno);
  let personajeEnemigoDos = crearEnemigo();
  personajeEnemigoDos.calculoVida();
  let imagenIdEnemigoDos;
  do {
    imagenIdEnemigoDos = Math.floor(aleatorio() * 0.09) + 1;
  } while (
    imagenIdUno == imagenIdEnemigoDos ||
    imagenIdEnemigoUno == imagenIdEnemigoDos
  );
  personajeEnemigoDos.imagen(imagenIdEnemigoDos);
  let personajeEnemigoTres = crearEnemigo();
  personajeEnemigoTres.calculoVida();
  let imagenIdEnemigoTres;
  do {
    imagenIdEnemigoTres = Math.floor(aleatorio() * 0.09) + 1;
  } while (
    imagenIdUno == imagenIdEnemigoTres ||
    imagenIdEnemigoUno == imagenIdEnemigoTres ||
    imagenIdEnemigoDos == imagenIdEnemigoTres
  );
  personajeEnemigoTres.imagen(imagenIdEnemigoTres);
  let personajeEnemigoCuatro = crearEnemigo();
  personajeEnemigoCuatro.calculoVida();
  let imagenIdEnemigoCuatro;
  do {
    imagenIdEnemigoCuatro = Math.floor(aleatorio() * 0.09) + 1;
  } while (
    imagenIdUno == imagenIdEnemigoCuatro ||
    imagenIdEnemigoUno == imagenIdEnemigoCuatro ||
    imagenIdEnemigoDos == imagenIdEnemigoCuatro ||
    imagenIdEnemigoTres == imagenIdEnemigoCuatro
  );
  personajeEnemigoCuatro.imagen(imagenIdEnemigoCuatro);
  personajesEnemigos.push(
    personajeEnemigoUno,
    personajeEnemigoDos,
    personajeEnemigoTres,
    personajeEnemigoCuatro
  );

  //Utilizo un contador para formar una id de enemigo diferente, y luego usarla en el boton

  let contador = 0;
  $(`#tarjetas`).append(
    `<p class="parrafo">Elige uno de los siguientes 4 rivales para enfrentarte en una batalla:</p></br>`
  );
  $(`#tarjetas`).append(
    `<div id="cards" class="d-flex justify-content-around"></div>`
  );
  for (const enemigo of personajesEnemigos) {
    $(`#cards`).append(`<div class="card" style="width: 18rem;">
        <div class="card-body">
          <img src="./imagenes/inicio${enemigo.imagenId}.png" alt="retrato" class="volteado">
          <h2 class="card-title">${enemigo.nombre}</h2>
          <p class="card-text">Fuerza: ${enemigo.fuerza} </br>Defensa: ${enemigo.defensa} </br>Agilidad: ${enemigo.agilidad} </br>Vida: ${enemigo.vida}</p>
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button id="enemigo${contador}" type="button" class="btn btn-dark"> Elegir Rival</button>
          </div>
        </div>
      </div>`);
    contador++;
  }
  $(`#enemigo0`).on("click", () => eleccionRival(0));
  $(`#enemigo1`).on("click", () => eleccionRival(1));
  $(`#enemigo2`).on("click", () => eleccionRival(2));
  $(`#enemigo3`).on("click", () => eleccionRival(3));
}

//Funcion que crea el array de guerreros jugables para modo 1 jugador

function eleccionRival(valor) {
  personajes.push(personajeUno, personajesEnemigos[valor]);
  personajes[0].calculoCritico(personajes[1].agilidad);
  personajes[1].calculoCritico(personajes[0].agilidad);
  $(`#tarjetas`).empty();
  posicionamientoGuerreros();
}

//Funcion que crea el array de guerreros jugables para modo 2 jugadores

function botonCrearPersonajes(e) {
  e.preventDefault();
  personajeUno = new Personaje(
    $("#nombreGuerreroUno").val(),
    $("#fuerzaGuerreroUno").val(),
    $("#defensaGuerreroUno").val(),
    $("#agilidadGuerreroUno").val()
  );
  personajeUno.calculoVida();
  personajeUno.imagen(imagenIdUno);
  nombreGuerrero = personajeUno.nombre;
  let personajeDos = new Personaje(
    $("#nombreGuerreroDos").val(),
    $("#fuerzaGuerreroDos").val(),
    $("#defensaGuerreroDos").val(),
    $("#agilidadGuerreroDos").val()
  );
  personajeDos.calculoVida();
  personajeDos.imagen(imagenIdDos);
  $(`#tutorial`).remove();
  personajes.push(personajeUno, personajeDos);
  personajes[0].calculoCritico(personajes[1].agilidad);
  personajes[1].calculoCritico(personajes[0].agilidad);
  posicionamientoGuerreros();
}

//Funcion que asigna las habilidades
//Esta funcion no es un evento, sino que pertenecia al evento "function eleccionRival", pero al
//programar el modo 1 vs 1, la parti en dos porque necesitaba la parte inferior que es comun a ambos modos
//Como no es evento talvez deberia ir arriba con el resto de funciones, pero lo dejo aca por ahora para que se entienda era parte de un evento antes
function posicionamientoGuerreros() {
  //Asigno las habilidades basado en las estadisticas

  for (z = 0; z < 2; z++) {
    personajes[z].asignarHabilidades(z);
  }

  $(`#tarjetas`)
    .append(`<p style="font-size:2rem;">Mientras se terminan los ultimos detalles demos un repaso al desarrollo de las batallas. Cada encuentro se realiza por turnos
   donde cada luchador podrá elegir una opción de un máximo de 5. Estas acciones serán atacar o defender, o usar una de las 3 habilidades aisgnadas de acuerdo a los atributos elegidos.
   Estas habilidades tienen un costo de energía según lo poderosas que sean. Cada luchador empieza con la mitad de su energía máxima disponible. Para generar más energía basta con jugar su turno
   , ya que cada acción ofensiva generará 1 de energía, mientras que cada acción defensiva generara 3 (las habilidades tambien se dividen en acciones ofensivas y defensivas, y generan 
    esta cantidad de energía además de los efectos que cada una podría tener). Por último, cada luchador posee una habilidad pasiva que se activará en el momento adecuado sin consumo de energía.</p>
                        <br><div class="d-flex justify-content-center"><button id="btnPreCombate" type="button" class="btn btn-lg btn-dark">Entendido</button></div>`);

  $(`#btnPreCombate`).on("click", preCombate);
}

//Funcion que crea las tarjetas de guerreros jugables y el boton para empezar la batalla

function preCombate() {
  $(`#tarjetas`).empty();

  //Con las habilidades ya colocadas, puedo empezar a cambiar los booleanos y los valores necesarios para los efectos de estas
  for (z = 0; z < 2; z++) {
    if (personajes[z].habilidadVida.id == 16) {
      personajes[z].energia = energiaInicialAumentada;
      personajes[z].energiaMaxima = maxEnergiaAumentado;
    } else {
      personajes[z].energia = energiaInicial;
      personajes[z].energiaMaxima = maxEnergia;
    }
    if (personajes[z].habilidadVida.id == 15) {
      ultimoAliento[z] = true;
    }
  }

  //Creo las tarjetas que contendran todos los datos de los personajes, incluyendo las habilidades, y se podran ver en todo momento

  $(`#tarjetas`).append(
    `<div id="cards" class="d-flex justify-content-around"></div>`
  );
  for (j = 0; j < 2; j++) {
    $(`#cards`).append(`
          <div class="card" style="width: 40rem;">
            <div class="card-body">
            <img src="./imagenes/inicio${personajes[j].imagenId}.png" alt="retrato" class="volteado">
              <h3 class="card-title"><b>${personajes[j].nombre}</b></h3>
              <p class="card-text fs-3"><b>Fuerza:</b> ${personajes[j].fuerza} </br><b>Defensa:</b> ${personajes[j].defensa} </br><b>Agilidad:</b> ${personajes[j].agilidad} </br><b>Vida:</b> ${personajes[j].vida}
              <br><b>${personajes[j].habilidadFuerza.nombre}:</b> ${personajes[j].habilidadFuerza.descripcion}
              <br><b>${personajes[j].habilidadDefensa.nombre}:</b> ${personajes[j].habilidadDefensa.descripcion}
              <br><b>${personajes[j].habilidadAgilidad.nombre}:</b> ${personajes[j].habilidadAgilidad.descripcion}
              <br><b>${personajes[j].habilidadVida.nombre}:</b> ${personajes[j].habilidadVida.descripcion}</p>
            
              </div>
        </div>`);
  }
  $(`#tarjetas`).append(
    `<br><div class="d-flex justify-content-center"><button id="btnEmpezar" type="button" class="btn btn-lg btn-dark">Empezar el Combate</button></div></br>`
  );

  //Comparo las agilidades para saber quien ataco primero. El valor de guia me ayudara a saber quien es el personajeUno, ya que luego el array se ordenara segun las agilidades

  if (personajes[0].agilidad == personajes[1].agilidad) {
    igualAgilidad = true;
    guia = 0;
  } else {
    if (personajes[0].agilidad > personajes[1].agilidad) {
      guia = 0;
    } else {
      guia = 1;
    }
    personajes = personajes.sort((a, b) => b.agilidad - a.agilidad);
  }
  $(`#btnEmpezar`).on("click", botonEmpezarBatalla);
}

//Funcion que empieza la batalla por turnos. Esta funcion se repite cada turno

function botonEmpezarBatalla() {
  //En el primer turno se coloca el aviso sobre quien ataca primero, o si atacan al mismo tiempo.
  if (i == 1) {
    $(`#btnEmpezar`).remove();
    vidaIniciales = [personajes[0].vida, personajes[1].vida];
    if (igualAgilidad) {
      $(`#turnos`).append(
        `<p>Ambos guerreros atacan al mismo tiempo al ser igual de rápidos</p>`
      );
    } else {
      $(`#turnos`).append(
        `<p>${personajes[0].nombre} ataca primero al ser más rápido</p>`
      );
    }
  }
  $(`#opciones`).remove();

  //Se crean las tarjetas que tendran las opciones para elegir

  $(`#turnos`).append(
    `<div id="opciones" class="d-flex justify-content-around"></div>`
  );
  for (j = 0; j < 2; j++) {
    $(`#opciones`).append(`
          <div class="card" style="width: auto;">
            <div id= "card${j}" class="card-body">
            <img src="./imagenes/inicio${
              personajes[j].imagenId
            }.png" alt="retrato" class="volteado">
            <h3 class="card-title"><b>${personajes[j].nombre}</b></h3>
            <div>
            <label for="medidorVida${j}">Vida: ${personajes[j].vida} / ${
      vidaIniciales[j]
    } </label>
            <meter id= "medidorVida${j}" min="0" max="100" low="25" high="75" optimum="100" value="${
      (personajes[j].vida / vidaIniciales[j]) * 100
    }">
            </div>
            <div>
            <label for="medidorEnergia${j}">Energía: ${
      personajes[j].energia
    } / ${personajes[j].energiaMaxima} </label>
            <meter id= "medidorEnergia${j}" min="0" max="100" low="25" high="75" optimum="100" value="${
      (personajes[j].energia / personajes[j].energiaMaxima) * 100
    }">
            </div>
            </div>
            </div>`);

    //Lo siguiente basicamente lo que hace es imprimir las opciones, aunque no lo hace para el personaje de la maquina. Tampoco imprime si esta paralizado

    if (paralizado[j] == true) {
      $(`#card${j}`).append(
        `<br><p>¡${personajes[j].nombre} pierde el turno debido a la paralisis!</p>`
      );
    } else if (modoUnJugador == false) {
      $(`#card${j}`)
        .append(`<form id="opciones${j}" class="btn-group btn-group-toggle" data-toggle="buttons">
      <input type="radio" class="btn-check" name="options${j}" id="option1${j}" autocomplete="off" checked>
      <label class="btn btn-secondary" for="option1${j}">Ataque</label>
      <input type="radio" class="btn-check" name="options${j}" id="option2${j}" autocomplete="off">
      <label class="btn btn-secondary" for="option2${j}">Defensa</label>
      <input type="radio" class="btn-check" name="options${j}" id="option3${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option3${j}">${personajes[j].habilidadFuerza.nombre}</label>
      <input type="radio" class="btn-check" name="options${j}" id="option4${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option4${j}">${personajes[j].habilidadDefensa.nombre}</label>
      <input type="radio" class="btn-check" name="options${j}" id="option5${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option5${j}">${personajes[j].habilidadAgilidad.nombre}</label></form>`);

      //Si no se tiene la suficiente energia, los botones aparecen deshabilitados. Esto me ahorró tener que controlarlos de otra manera
      //El .disabled no me funcionaba con jquery o no supe hacerlo funcionar, asi que utilice vanilla

      if (personajes[j].energia >= personajes[j].habilidadFuerza.coste) {
        document.getElementById(`option3${j}`).disabled = false;
      }
      if (personajes[j].energia >= personajes[j].habilidadDefensa.coste) {
        document.getElementById(`option4${j}`).disabled = false;
      }
      if (personajes[j].energia >= personajes[j].habilidadAgilidad.coste) {
        document.getElementById(`option5${j}`).disabled = false;
      }
    } else if (j == guia) {
      $(`#card${j}`)
        .append(`<form id="opciones${j}" class="btn-group btn-group-toggle" data-toggle="buttons">
      <input type="radio" class="btn-check" name="options${j}" id="option1${j}" autocomplete="off" checked>
      <label class="btn btn-secondary" for="option1${j}">Ataque</label>
      <input type="radio" class="btn-check" name="options${j}" id="option2${j}" autocomplete="off">
      <label class="btn btn-secondary" for="option2${j}">Defensa</label>
      <input type="radio" class="btn-check" name="options${j}" id="option3${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option3${j}">${personajes[j].habilidadFuerza.nombre}</label>
      <input type="radio" class="btn-check" name="options${j}" id="option4${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option4${j}">${personajes[j].habilidadDefensa.nombre}</label>
      <input type="radio" class="btn-check" name="options${j}" id="option5${j}" autocomplete="off" disabled>
      <label class="btn btn-secondary" for="option5${j}">${personajes[j].habilidadAgilidad.nombre}</label></form>`);
      if (personajes[j].energia >= personajes[j].habilidadFuerza.coste) {
        document.getElementById(`option3${j}`).disabled = false;
      }
      if (personajes[j].energia >= personajes[j].habilidadDefensa.coste) {
        document.getElementById(`option4${j}`).disabled = false;
      }
      if (personajes[j].energia >= personajes[j].habilidadAgilidad.coste) {
        document.getElementById(`option5${j}`).disabled = false;
      }
    }
  }
  $(`#turnos`).append(
    `<br><button id="btnAcciones" type="button" class="btn btn-dark">Realizar Acciones</button>`
  );

  //Linea para ir al fondo de la pagina
  $(`#turnos`).append(`<a id="irAbajo" href="#abajo"></a>`);
  document.getElementById("irAbajo").click();
  $(`#irAbajo`).remove();

  $(`#btnAcciones`).on("click", desarrolloTurno);
}

//Funcion en donde se desarrolla cada turno

function desarrolloTurno() {
  $(`#btnAcciones`).remove();

  //Para seleccionar las opciones radio tuve que usar obligatoriamente vanilla, no funciono de ninguna manera $(`#Id`).checked
  //Si esta paralizado, por defecto elije la opcion 6

  if (modoUnJugador == true) {
    if (paralizado[guia] == true) {
      opcionUno = 6;
      paralizado[guia] = false;
    } else {
      for (opcionUno = 1; opcionUno < 6; opcionUno++) {
        if (document.getElementById(`option${opcionUno}${guia}`).checked) {
          break;
        }
      }
    }
    if (paralizado[0 ** guia] == true) {
      opcionDos = 6;
      paralizado[0 ** guia] = false;
    } else {
      opcionDos = iaCPU();
    }
  } else {
    if (paralizado[guia] == true) {
      opcionUno = 6;
      paralizado[guia] = false;
    } else {
      for (opcionUno = 1; opcionUno < 6; opcionUno++) {
        if (document.getElementById(`option${opcionUno}${guia}`).checked) {
          break;
        }
      }
    }
    if (paralizado[0 ** guia] == true) {
      opcionDos = 6;
      paralizado[0 ** guia] = false;
    } else {
      for (opcionDos = 1; opcionDos < 6; opcionDos++) {
        //guia siempre va a ser la posicion del jugador Uno en el array ordenado por agilidad. Si el jugadorUno es guia=0, entonces el jugadorDos tiene posicion 1, si guia=1, el jugadorDos tiene posicion 0. Para que se de esta igualdad siempre, el jugadorUno=guia y el jugadorDos=0**guia.
        if (document.getElementById(`option${opcionDos}${0 ** guia}`).checked) {
          break;
        }
      }
    }
  }
  let vidaAlPrincipio = [personajes[0].vida, personajes[1].vida];

  //Se coloca el turno en juego

  $(`#turnos`).append(`<br><p><u>Turno ${i}: </u></p>`);

  //No puedo poner una id dinamica en las animate. No las lee. Queria que la id fuera img1${i} asi podia diferenciar entre turnos, pero no pude. Por lo que remuevo la id de la imagen anterior para usarla en la nueva con el siguiente if.

  if (i > 1) {
    $(`#img1`).removeAttr("id");
    $(`#img2`).removeAttr("id");
    if (igualAgilidad && atdesesperado) {
      if (controlImagen == false) {
        controlImgen = true;
      } else {
        $(`#img3`).removeAttr("id");
        $(`#img4`).removeAttr("id");
      }
    } else if (igualAgilidad == false) {
      $(`#img3`).removeAttr("id");
      $(`#img4`).removeAttr("id");
    }
  }

  //Dado que existe la habilidad ataque desesperado que cambia el orden de los personajes, necesito asegurar las opciones para saber a quien le corresponde cada una

  let primero, segundo;
  if (guia == 0) {
    primero = opcionUno;
    segundo = opcionDos;

    //Antes de seguir, debo aumentar la defensa de aquellos personajes que hayan utilizado acciones defensivas, y cambiar el resto de valores necesarios antes de las acciones

    verDefensa(opcionUno, 0);
    verDefensa(opcionDos, 1);
  } else {
    primero = opcionDos;
    segundo = opcionUno;
    verDefensa(opcionUno, 1);
    verDefensa(opcionDos, 0);
  }

  //Cambio el orden si utilizan ataque desesperado

  if (atdesesperado == true) {
    let imagenControl = [];
    imagenControl[0] = imagenAccion[0];
    imagenControl[1] = imagenAccionAgiDif[0];
    imagenControl[2] = imagenAccionGolpe[0];
    imagenAccion[0] = imagenAccion[1];
    imagenAccionAgiDif[0] = imagenAccionAgiDif[1];
    imagenAccionGolpe[0] = imagenAccionGolpe[1];
    imagenAccion[1] = imagenControl[0];
    imagenAccionAgiDif[1] = imagenControl[1];
    imagenAccionGolpe[1] = imagenControl[2];
    if (igualAgilidad == true && atDesesperadoControl) {
    } else {
      let personajeIntermediario = personajes[0];
      personajes[0] = personajes[1];
      personajes[1] = personajeIntermediario;
      let opcionIntermedia = primero;
      primero = segundo;
      segundo = opcionIntermedia;
    }
  }

  //Existe la posibilidad de que esquiven usando esquiva asombrosa, por lo que tengo que ver cada caso con anterioridad
  if (esquivo[1] == true && !turnoDefiende[0]) {
    $(`#turnos`).append(`<p>¡${personajes[0].nombre} erra su ataque!</p>`);

    //Aunque esquive, la energia se gasta, por lo que fue necesario el siguiente arreglo

    switch (primero) {
      case 1:
        //Nada, atacar no gasta energía
        break;
      case 3:
        personajes[0].energia -= personajes[0].habilidadFuerza.coste;
        break;
      case 4:
        personajes[0].energia -= personajes[0].habilidadDefensa.coste;
        break;
      case 5:
        personajes[0].energia -= personajes[0].habilidadAgilidad.coste;
        break;
    }
    personajes[0].energia++;
  } else {
    resuelveEleccion(primero, 0, 1);
  }
  //Debo diferenciar si atacan al mismo tiempo o uno primero y otro despues, ya que el orden de acciones cambia segun el caso
  //Si la agilidad es igual, se resuelven primero las dos elecciones, y despues se ve el resultado de las dos elecciones
  if (igualAgilidad == true && atdesesperado == false) {
    if (esquivo[0] == true && !turnoDefiende[1]) {
      $(`#turnos`).append(`<p>¡${personajes[1].nombre} erra su ataque!</p>`);
      switch (segundo) {
        case 1:
          //Nada, atacar no gasta energía
          break;
        //No hay opcion 2, porque solo es para acciones ofensivas y la 2 es defender
        case 3:
          personajes[1].energia -= personajes[1].habilidadFuerza.coste;
          break;
        case 4:
          personajes[1].energia -= personajes[1].habilidadDefensa.coste;
          break;
        case 5:
          personajes[1].energia -= personajes[1].habilidadAgilidad.coste;
          break;
      }
      personajes[1].energia++;
      $(`#turnos`).append(
        `<div style=""><img src="./imagenes/${imagenAccion[0]}" alt="accion" id="img1" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img2" style="position:relative; left: 40px;" alt="reaccion"></img></div>
        <br>`
      );
    } else {
      resuelveEleccion(segundo, 1, 0);
      $(`#turnos`).append(
        `<div style=""><img src="./imagenes/${imagenAccion[0]}" alt="accion" id="img1" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img2" style="position:relative; left: 40px;" alt="reaccion"></img></div>
        <br>`
      );

      if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
        //Cada vez que evaluo si la vida llego a 0, debo evaluar si posee la habilidad ultimo aliento que lo salva de morir una vez

        if (ultimoAliento[0]) {
          ultimoAliento[0] = false;
          $(`#turnos`).append(
            `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
          );
          personajes[0].vida = 1;
        }
        if (ultimoAliento[1]) {
          ultimoAliento[1] = false;
          $(`#turnos`).append(
            `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
          );
          personajes[1].vida = 1;
        }
        if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
          empate = true;
          $(`#turnos`).append(
            `<p>Ambos combatientes tienen sus puntos de vida en cero, el encuentro termina empatado</p>
            <div style=""><img src="./imagenes/empate${personajes[0].imagenId}.png" alt="empate" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/empate${personajes[1].imagenId}.png" style="position:relative; left: 40px;" id="img6" alt="empate"></div></br>`
          );
        }
      } else if (personajes[0].vidaCero()) {
        if (ultimoAliento[0]) {
          ultimoAliento[0] = false;
          $(`#turnos`).append(
            `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
          );
          personajes[0].vida = 1;
        } else {
          nombreGanador = personajes[1].nombre;
          $(`#turnos`).append(
            `<p>El encuentro ha terminado, ${personajes[1].nombre} ha ganado</p>
            <div style=""><img src="./imagenes/muerto${personajes[0].imagenId}.png" alt="muerto" style="position:relative;" id="img5" class="volteado"><img src="./imagenes/victoria${personajes[1].imagenId}.png" style="position:relative; left: 40px;" id="img6" alt="victoria"></div></br>`
          );
        }
      } else if (personajes[1].vidaCero()) {
        if (ultimoAliento[1]) {
          ultimoAliento[1] = false;
          $(`#turnos`).append(
            `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
          );
          personajes[1].vida = 1;
        } else {
          nombreGanador = personajes[0].nombre;
          $(`#turnos`).append(
            `<p>El encuentro ha terminado, ${personajes[0].nombre} ha ganado</p>
            <div style=""><img src="./imagenes/victoria${personajes[0].imagenId}.png" id="img5" style="position:relative;" alt="victoria" class="volteado"><img src="./imagenes/muerto${personajes[1].imagenId}.png" style="position:relative; left: 40px;" id="img6" alt="muerto"></div></br>`
          );
        }
      }
    }
  } else {
    //Si la agilidad es diferente, se resuelve la eleccion del primero, luego se ve su resultado, si el segundo sigue vivo, se resuelve la accion del segundo jugador y luego se ve su resultado.
    if (turnoDefiende[0]) {
      $(`#turnos`).append(
        `<div style=""><img src="./imagenes/${imagenAccion[0]}" alt="accion" id="img1" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccionAgiDif[1]}" id="img2" style="position:relative; left: 40px;" alt="reaccion"></img></div><br>`
      );
    } else {
      $(`#turnos`).append(
        `<div style=""><img src="./imagenes/${imagenAccion[0]}" alt="accion" id="img1" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccionGolpe[1]}" id="img2" style="position:relative;left: 40px; " alt="reaccion"></img><br>`
      );
    }
    if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
      if (ultimoAliento[0]) {
        ultimoAliento[0] = false;
        $(`#turnos`).append(
          `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
        );
        personajes[0].vida = 1;
      }
      if (ultimoAliento[1]) {
        ultimoAliento[1] = false;
        $(`#turnos`).append(
          `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
        );
        personajes[1].vida = 1;
      }
      if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
        empate = true;
        $(`#turnos`).append(
          `<p>Ambos combatientes tienen sus puntos de vida en cero, el encuentro termina empatado</p>
          <div style=""><img src="./imagenes/empate${personajes[0].imagenId}.png" alt="empate" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/empate${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="empate"></div></br>`
        );
      }
    } else if (personajes[0].vidaCero()) {
      if (ultimoAliento[0]) {
        ultimoAliento[0] = false;
        $(`#turnos`).append(
          `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
        );
        personajes[0].vida = 1;
      } else {
        nombreGanador = personajes[1].nombre;
        $(`#turnos`).append(
          `<p>El encuentro ha terminado, ${personajes[1].nombre} ha ganado</p>
          <div style=""><img src="./imagenes/muerto${personajes[0].imagenId}.png" alt="muerto" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/victoria${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="victoria"></div></br>`
        );
      }
    } else if (personajes[1].vidaCero()) {
      if (ultimoAliento[1]) {
        ultimoAliento[1] = false;
        $(`#turnos`).append(
          `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
        );
        personajes[1].vida = 1;
        if (paralizado[1] == false) {
          if (esquivo[0] == true && !turnoDefiende[1]) {
            $(`#turnos`).append(
              `<p>¡${personajes[1].nombre} erra su ataque!</p>`
            );
            switch (segundo) {
              case 1:
                //Nada, atacar no gasta energía
                break;
              case 3:
                personajes[1].energia -= personajes[1].habilidadFuerza.coste;
                break;
              case 4:
                personajes[1].energia -= personajes[1].habilidadDefensa.coste;
                break;
              case 5:
                personajes[1].energia -= personajes[1].habilidadAgilidad.coste;
                break;
            }
            personajes[1].energia++;
            $(`#turnos`).append(
              `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
            );
          } else {
            resuelveEleccion(segundo, 1, 0);
            if (turnoDefiende[1]) {
              $(`#turnos`).append(
                `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
              );
            } else {
              $(`#turnos`).append(
                `<div style=""><img src="./imagenes/${imagenAccionGolpe[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
              );
            }
            if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
              if (ultimoAliento[0]) {
                ultimoAliento[0] = false;
                $(`#turnos`).append(
                  `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
                );
                personajes[0].vida = 1;
                nombreGanador = personajes[0].nombre;
                $(`#turnos`).append(
                  `<p>El encuentro ha terminado, ${personajes[0].nombre} ha ganado</p>
                  <div style=""><img src="./imagenes/victoria${personajes[0].imagenId}.png" alt="victoria" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/muerto${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="muerto"></div></br>`
                );
              } else {
                empate = true;
                $(`#turnos`).append(
                  `<p>Ambos combatientes tienen sus puntos de vida en cero, el encuentro termina empatado</p>
                  <div style=""><img src="./imagenes/empate${personajes[0].imagenId}.png" alt="empate" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/empate${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="empate"></div></br>`
                );
              }
            } else if (personajes[0].vidaCero()) {
              if (ultimoAliento[0]) {
                ultimoAliento[0] = false;
                $(`#turnos`).append(
                  `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
                );
                personajes[0].vida = 1;
              } else {
                nombreGanador = personajes[1].nombre;
                $(`#turnos`).append(
                  `<p>El encuentro ha terminado, ${personajes[1].nombre} ha ganado</p>
                  <div style=""><img src="./imagenes/muerto${personajes[0].imagenId}.png" alt="muerto" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/victoria${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="victoria"></div></br>`
                );
              }
            } else if (personajes[1].vidaCero()) {
              if (ultimoAliento[1]) {
                ultimoAliento[1] = false;
                $(`#turnos`).append(
                  `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
                );
                personajes[1].vida = 1;
              } else {
                nombreGanador = personajes[0].nombre;
                $(`#turnos`).append(
                  `<p>El encuentro ha terminado, ${personajes[0].nombre} ha ganado</p>
                  <div style=""><img src="./imagenes/victoria${personajes[0].imagenId}.png" alt="victoria" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/muerto${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="muerto"></div></br>`
                );
              }
            }
          }
        } else if (paralizado[1] == true) {
          $(`#turnos`).append(
            `<p>¡${personajes[1].nombre} pierde el turno debido a la paralisis!</p>`
          );
          paralizadoImagen[1] = true;
          paralizado[1] = false;
          imagenAccion[1] = `empate${personajes[1].imagenId}.png`;
          $(`#turnos`).append(
            `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
          );
        }
      } else {
        nombreGanador = personajes[0].nombre;
        $(`#turnos`).append(
          `<p>El encuentro ha terminado, ${personajes[0].nombre} ha ganado</p>
          <div style=""><img src="./imagenes/victoria${personajes[0].imagenId}.png" alt="victoria" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/muerto${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="muerto"></div></br>`
        );
      }
    } else if (paralizado[1] == false) {
      if (esquivo[0] == true && !turnoDefiende[1]) {
        $(`#turnos`).append(`<p>¡${personajes[1].nombre} erra su ataque!</p>`);
        switch (segundo) {
          case 1:
            //Nada, atacar no gasta energía
            break;
          case 3:
            personajes[1].energia -= personajes[1].habilidadFuerza.coste;
            break;
          case 4:
            personajes[1].energia -= personajes[1].habilidadDefensa.coste;
            break;
          case 5:
            personajes[1].energia -= personajes[1].habilidadAgilidad.coste;
            break;
        }
        personajes[1].energia++;
        $(`#turnos`).append(
          `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
        );
      } else {
        resuelveEleccion(segundo, 1, 0);
        if (turnoDefiende[1]) {
          $(`#turnos`).append(
            `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
          );
        } else {
          $(`#turnos`).append(
            `<div style=""><img src="./imagenes/${imagenAccionGolpe[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
          );
        }
        if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
          if (ultimoAliento[0]) {
            ultimoAliento[0] = false;
            $(`#turnos`).append(
              `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
            );
            personajes[0].vida = 1;
          }
          if (ultimoAliento[1]) {
            ultimoAliento[1] = false;
            $(`#turnos`).append(
              `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
            );
            personajes[1].vida = 1;
          }
          if (personajes[0].vidaCero() && personajes[1].vidaCero()) {
            empate = true;
            $(`#turnos`).append(
              `<p>Ambos combatientes tienen sus puntos de vida en cero, el encuentro termina empatado</p>
              <div style=""><img src="./imagenes/empate${personajes[0].imagenId}.png" alt="empate" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/empate${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="empate"></div></br>`
            );
          }
        } else if (personajes[0].vidaCero()) {
          if (ultimoAliento[0]) {
            ultimoAliento[0] = false;
            $(`#turnos`).append(
              `<p>${personajes[0].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
            );
            personajes[0].vida = 1;
          } else {
            nombreGanador = personajes[1].nombre;
            $(`#turnos`).append(
              `<p>El encuentro ha terminado, ${personajes[1].nombre} ha ganado</p>
              <div style=""><img src="./imagenes/muerto${personajes[0].imagenId}.png" alt="muerto" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/victoria${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="victoria"></div></br>`
            );
          }
        } else if (personajes[1].vidaCero()) {
          if (ultimoAliento[1]) {
            ultimoAliento[1] = false;
            $(`#turnos`).append(
              `<p>${personajes[1].nombre} ha sobrevivido al daño mortal gracias a su Ultimo Aliento!</p>`
            );
            personajes[1].vida = 1;
          } else {
            nombreGanador = personajes[0].nombre;
            $(`#turnos`).append(
              `<p>El encuentro ha terminado, ${personajes[0].nombre} ha ganado</p>
              <div style=""><img src="./imagenes/victoria${personajes[0].imagenId}.png" alt="victoria" id="img5" style="position:relative;" class="volteado"><img src="./imagenes/muerto${personajes[1].imagenId}.png" id="img6" style="position:relative; left: 40px;" alt="muerto"></div></br>`
            );
          }
        }
      }
    } else if (paralizado[1] == true) {
      $(`#turnos`).append(
        `<p>¡${personajes[1].nombre} pierde el turno debido a la paralisis!</p>`
      );
      paralizadoImagen[1] = true;
      paralizado[1] = false;
      imagenAccion[1] = `empate${personajes[1].imagenId}.png`;
      $(`#turnos`).append(
        `<div style=""><img src="./imagenes/${imagenAccionAgiDif[0]}" alt="accion" id="img3" style="position:relative;" class="volteado"></img><img src="./imagenes/${imagenAccion[1]}" id="img4" style="position:relative; left: 40px;" alt="reaccion"></div></img>`
      );
    }
  }

  //Animaciones
  if (igualAgilidad && !atdesesperado) {
    if (paralizadoImagen[0] && paralizadoImagen[1]) {
      paralizadoImagen = [false, false];
    } else if (paralizadoImagen[0] && turnoDefiende[1]) {
      if (esquivo[1]) {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
      paralizadoImagen[0] = false;
    } else if (turnoDefiende[0] && paralizadoImagen[1]) {
      if (esquivo[0]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
      paralizadoImagen[1] = false;
    } else if (paralizadoImagen[0] && !turnoDefiende[1]) {
      $(() => {
        $(`#img1`).animate(
          {
            left: "=0",
          },
          1500,
          function () {
            $(this).after(
              $(`#img1`).animate(
                {
                  left: "-=40",
                },
                500
              )
            );
          }
        );
      });
      $(() => {
        $(`#img2`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img2`).animate(
                {
                  left: "-=60",
                },
                500
              )
            );
          }
        );
      });
      paralizadoImagen[0] = false;
    } else if (!turnoDefiende[0] && paralizadoImagen[1]) {
      $(() => {
        $(`#img1`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img1`).animate(
                {
                  left: "+=60",
                },
                500
              )
            );
          }
        );
      });
      $(() => {
        $(`#img2`).animate(
          {
            left: "=0",
          },
          1500,
          function () {
            $(this).after(
              $(`#img2`).animate(
                {
                  left: "+=40",
                },
                500
              )
            );
          }
        );
      });
      paralizadoImagen[1] = false;
    } else if (
      (turnoDefiende[0] && turnoDefiende[1]) ||
      (!turnoDefiende[0] && !turnoDefiende[1])
    ) {
      if (esquivo[0] && esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else if (esquivo[0] && !esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else if (!esquivo[0] && esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
    } else if (!turnoDefiende[0] && turnoDefiende[1]) {
      $(() => {
        $(`#img1`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img1`).animate(
                {
                  left: "+=40",
                },
                500
              )
            );
          }
        );
      });
      if (esquivo[1]) {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=20",
                  },
                  500
                )
              );
            }
          );
        });
      }
    } else if (turnoDefiende[0] && !turnoDefiende[1]) {
      if (esquivo[0]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=20",
                  },
                  500
                )
              );
            }
          );
        });
      }
      $(() => {
        $(`#img2`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img2`).animate(
                {
                  left: "-=40",
                },
                500
              )
            );
          }
        );
      });
    }
  } else {
    if (paralizadoImagen[0] && paralizadoImagen[1]) {
      paralizadoImagen = [false, false];
    } else if (paralizadoImagen[0] && turnoDefiende[1]) {
      if (esquivo[1]) {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
      paralizadoImagen[0] = false;
    } else if (turnoDefiende[0] && paralizadoImagen[1]) {
      if (esquivo[0]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
      paralizadoImagen[1] = false;
    } else if (paralizadoImagen[0] && !turnoDefiende[1]) {
      $(() => {
        $(`#img3`).animate(
          {
            left: "=0",
          },
          2500,
          function () {
            $(this).after(
              $(`#img3`).animate(
                {
                  left: "-=40",
                },
                500
              )
            );
          }
        );
      });
      $(() => {
        $(`#img4`).animate(
          {
            left: "=0",
          },
          2000,
          function () {
            $(this).after(
              $(`#img4`).animate(
                {
                  left: "-=60",
                },
                500
              )
            );
          }
        );
      });
      paralizadoImagen[0] = false;
    } else if (!turnoDefiende[0] && paralizadoImagen[1]) {
      $(() => {
        $(`#img1`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img1`).animate(
                {
                  left: "+=60",
                },
                500
              )
            );
          }
        );
      });
      $(() => {
        $(`#img2`).animate(
          {
            left: "=0",
          },
          1500,
          function () {
            $(this).after(
              $(`#img2`).animate(
                {
                  left: "+=40",
                },
                500
              )
            );
          }
        );
      });
      paralizadoImagen[1] = false;
    } else if (
      (turnoDefiende[0] && turnoDefiende[1]) ||
      (!turnoDefiende[0] && !turnoDefiende[1])
    ) {
      if (esquivo[0] && esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else if (esquivo[0] && !esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else if (!esquivo[0] && esquivo[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else if (turnoDefiende[0] && turnoDefiende[1]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=60",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1500,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=40",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2500,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "-=40",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "-=60",
                  },
                  500
                )
              );
            }
          );
        });
      }
    } else if (!turnoDefiende[0] && turnoDefiende[1]) {
      $(() => {
        $(`#img1`).animate(
          {
            left: "=0",
          },
          1000,
          function () {
            $(this).after(
              $(`#img1`).animate(
                {
                  left: "+=40",
                },
                500
              )
            );
          }
        );
      });
      if (esquivo[1]) {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img2`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img2`).animate(
                  {
                    left: "-=20",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img4`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img4`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      }
    } else if (turnoDefiende[0] && !turnoDefiende[1]) {
      if (esquivo[0]) {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1250,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2250,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "-=30",
                  },
                  500
                )
              );
            }
          );
        });
      } else {
        $(() => {
          $(`#img1`).animate(
            {
              left: "=0",
            },
            1000,
            function () {
              $(this).after(
                $(`#img1`).animate(
                  {
                    left: "+=30",
                  },
                  500
                )
              );
            }
          );
        });
        $(() => {
          $(`#img3`).animate(
            {
              left: "=0",
            },
            2000,
            function () {
              $(this).after(
                $(`#img3`).animate(
                  {
                    left: "+=20",
                  },
                  500
                )
              );
            }
          );
        });
      }
      $(() => {
        $(`#img4`).animate(
          {
            left: "=0",
          },
          2000,
          function () {
            $(this).after(
              $(`#img4`).animate(
                {
                  left: "-=40",
                },
                500
              )
            );
          }
        );
      });
    }
  }

  //En esta etapa ya ocurrieron los procesos, tengo que ir regresando todos los valores originales de booleanos y demas para estar preparado para el proximo turno

  if (atdesesperado == true) {
    if (igualAgilidad == true && atDesesperadoControl) {
    } else {
      let personajeIntermediario = personajes[0];
      personajes[0] = personajes[1];
      personajes[1] = personajeIntermediario;
    }
    atDesesperadoControl = false;
    atdesesperado = false;
  }
  if (guia == 0) {
    resetDefensa(opcionUno, 0);
    resetDefensa(opcionDos, 1);
  } else {
    resetDefensa(opcionUno, 1);
    resetDefensa(opcionDos, 0);
  }
  contraataque = [false, false];
  turnoDefiende = [false, false];
  esquivo = [false, false];

  //Aumenta el contador de turnos

  i++;

  //Evito un bug de energía negativa ocasionado por el uso en el mismo turno de ataca en el estomago (resta energia al rival), y una habilidad del rival (resta su propia energia)

  if (personajes[0].energia < 0) {
    personajes[0].energia = 0;
  }
  if (personajes[1].energia < 0) {
    personajes[1].energia = 0;
  }

  //Remuevo el boton atacar de donde esta

  $(`#btnEmpezar`).remove();

  //Si el encuentro terminó, dibujo el historial.

  if (personajes[0].vidaCero() || personajes[1].vidaCero()) {
    $(`#opciones`).remove();

    // Animaciones del final

    if (personajes[0].vidaCero() == false && personajes[1].vidaCero()) {
      $(() => {
        $(`#img5`).animate(
          {
            left: "=0",
          },
          3000,
          function () {
            $(this).after(
              $(`#img5`).animate(
                {
                  top: "-=30",
                },
                200,
                function () {
                  $(this).after(
                    $(`#img5`).animate(
                      {
                        top: "+=30",
                      },
                      200,
                      function () {
                        $(this).after(
                          $(`#img5`).animate(
                            {
                              top: "-=30",
                            },
                            200,
                            function () {
                              $(this).after(
                                $(`#img5`).animate(
                                  {
                                    top: "+=30",
                                  },
                                  200
                                )
                              );
                            }
                          )
                        );
                      }
                    )
                  );
                }
              )
            );
          }
        );
      });
    } else if (personajes[0].vidaCero() && personajes[1].vidaCero() == false) {
      $(() => {
        $(`#img6`).animate(
          {
            left: "=0",
          },
          3000,
          function () {
            $(this).after(
              $(`#img6`).animate(
                {
                  top: "-=30",
                },
                200,
                function () {
                  $(this).after(
                    $(`#img6`).animate(
                      {
                        top: "+=30",
                      },
                      200,
                      function () {
                        $(this).after(
                          $(`#img6`).animate(
                            {
                              top: "-=30",
                            },
                            200,
                            function () {
                              $(this).after(
                                $(`#img6`).animate(
                                  {
                                    top: "+=30",
                                  },
                                  200
                                )
                              );
                            }
                          )
                        );
                      }
                    )
                  );
                }
              )
            );
          }
        );
      });
    }

    $(`#turnos`).append(`<br><p><b>Resultado Final:</b></p>`);
    $(`#turnos`).append(
      `<div id="opciones" class="d-flex justify-content-around"></div>`
    );
    for (j = 0; j < 2; j++) {
      $(`#opciones`).append(`
          <div class="card" style="width: auto;">
            <div id= "card${j}" class="card-body">
            <img src="./imagenes/inicio${
              personajes[j].imagenId
            }.png" alt="retrato" class="volteado">
            <h3 class="card-title"><b>${personajes[j].nombre}</b></h3>
            <div>
            <label for="medidorVida${j}">Vida: ${personajes[j].vida} / ${
        vidaIniciales[j]
      } </label>
            <meter id= "medidorVida${j}" min="0" max="100" low="25" high="75" optimum="100" value="${
        (personajes[j].vida / vidaIniciales[j]) * 100
      }">
            </div>
            <div>
            <label for="medidorEnergia${j}">Energía: ${
        personajes[j].energia
      } / ${personajes[j].energiaMaxima} </label>
            <meter id= "medidorEnergia${j}" min="0" max="100" low="25" high="75" optimum="100" value="${
        (personajes[j].energia / personajes[j].energiaMaxima) * 100
      }">
            </div>
            </div>
            </div>`);
    }
    historialBatallas();

    //Si no termino, vuelvo a colocar el boton de atacar abajo del turno recien colocado, y resuelvo los efectos que quedan por resolver, principalmente las habilidades vida
  } else {
    if (comprobarVigor[0] == true) {
      if (vidaAlPrincipio[0] == personajes[0].vida) {
        $(`#turnos`).append(
          `<p>¡${personajes[0].nombre} no sufrio daños gracias a su defensa perfecta, recupera 4 de vida.</p>`
        );
        personajes[0].vida += 4;
        comprobarVigor[0] = false;
      } else {
        comprobarVigor[0] = false;
      }
    }
    if (comprobarVigor[1] == true) {
      if (vidaAlPrincipio[1] == personajes[1].vida) {
        $(`#turnos`).append(
          `<p>¡${personajes[1].nombre} no sufrio daños gracias a su defensa perfecta, recupera 4 de vida.</p>`
        );
        personajes[1].vida += 4;
        comprobarVigor[1] = false;
      } else {
        comprobarVigor[1] = false;
      }
    }
    habilidadVida(0);
    habilidadVida(1);
    $(`#turnos`).append(
      `<br><button id="btnEmpezar" type="button" class="btn btn-dark">Siguiente Turno</button>`
    );
  }

  //Linea para ir al fondo de la pagina
  $(`#turnos`).append(`<a id="irAbajo" href="#abajo"></a>`);
  document.getElementById("irAbajo").click();
  $(`#irAbajo`).remove();

  //Realizo el evento sobre el evento anterior a este, produciendose una especie de ciclo cada vez que selecciona el boton de atacar

  $(`#btnEmpezar`).on("click", botonEmpezarBatalla);
}

//Funcion para borrar el historial del Local Storage y tambien de la tabla mostrada en el HTML

function botonBorrarHistorial() {
  $(`#historial`).empty();
  historialUno = [
    { resultado: "Victorias", cantidad: 0 },
    { resultado: "Derrotas", cantidad: 0 },
    { resultado: "Empates", cantidad: 0 },
  ];
  historialDos = [
    { resultado: "Victorias", cantidad: 0 },
    { resultado: "Derrotas", cantidad: 0 },
    { resultado: "Empates", cantidad: 0 },
  ];
  historialCPU = [
    { resultado: "Victorias", cantidad: 0 },
    { resultado: "Derrotas", cantidad: 0 },
    { resultado: "Empates", cantidad: 0 },
  ];
  localStorage.setItem("HistorialUno", JSON.stringify(historialUno));
  localStorage.setItem("HistorialDos", JSON.stringify(historialDos));
  localStorage.setItem("HistorialCPU", JSON.stringify(historialCPU));
  dibujarTabla(historialUno, historialCPU, historialDos);
}

/////////////////
// +++ FIN +++ //
/////////////////

//Mejorar las explicaciones y ortografia de todos los p
