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
    const vidaBase = 50;
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

  //Calculo de daño de golpe (Depende de valores del personaje rival).

  danio(criticoPropio, defensaEnemigo) {
    const danioBase = 10;
    const criticoMaximo = 100;
    this.golpe = Math.floor(
      (this.fuerza - defensaEnemigo + danioBase) * (aleatorio() * 0.004 + 0.8)
    );
    //Calculo si hay daño critico
    if (criticoMaximo - this.critico <= criticoPropio) {
      $(`#turnos`).append(`<p>¡${this.nombre} realiza un golpe crítico!</p>`);
      this.golpe = Math.floor(this.golpe * 1.5);
    }
    //Para evitar que el defensor se "cure" con los golpes, en caso de ser negativos son cambiados a cero
    if (this.golpe < 0) {
      this.golpe = 0;
    }
  }

  //Funcion que agrega las habilidades segun sus estadisticas

  asignarHabilidades(j) {
    //En el json se encuentran las 19 habilidades en un array. Para saber cual corresponde a cada personaje segun sus estadisticas, evaluo los valores y les voy asignando un número en el
    //"posicionHabilidadesArray" del 1 al 4, cada uno correspondiente a una habilidad diferente basada en cada estadistica.

    let posicionHabilidadArray = [];
    let estadisticasArray = [this.fuerza, this.defensa, this.agilidad];
    for (let p = 0; p < 3; p++) {
      if (estadisticasArray[p] < 3) {
        posicionHabilidadArray[p] = 1;
      } else if (estadisticasArray[p] < 6) {
        posicionHabilidadArray[p] = 2;
      } else if (estadisticasArray[p] < 9) {
        posicionHabilidadArray[p] = 3;
      } else {
        posicionHabilidadArray[p] = 4;
      }
    }

    //Con la estadistica vida el proceso es el mismo, pero cambian los rangos de valores (en vez de ser de 1 a 10, es de 20 a 47), y la cantidad de habilidades disponibles (5 en vez de 4)

    if (this.vida < 27) {
      posicionHabilidadArray[3] = 1;
    } else if (this.vida < 31) {
      posicionHabilidadArray[3] = 2;
    } else if (this.vida < 35) {
      posicionHabilidadArray[3] = 3;
    } else if (this.vida < 41) {
      posicionHabilidadArray[3] = 4;
    } else {
      posicionHabilidadArray[3] = 5;
    }

    //Para leer el JSON de habilidades utilizo lo siguiente

    $.ajax({
      type: "GET",
      data: "habilidades",
      url: "habilidades.json",
      dataType: "json",
      success: function (data) {
        //La posicion 0 y 1 corresponde a atacar y defender, habilidades basicas que tienen todos los personajes. Para el resto se utilizan los valores calculados previamente.

        personajes[j].habilidadAtacar = data[0];
        personajes[j].habilidadDefender = data[1];
        personajes[j].habilidadFuerza = data[1 + posicionHabilidadArray[0]];
        personajes[j].habilidadDefensa = data[5 + posicionHabilidadArray[1]];
        personajes[j].habilidadAgilidad = data[9 + posicionHabilidadArray[2]];
        personajes[j].habilidadVida = data[13 + posicionHabilidadArray[3]];
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
